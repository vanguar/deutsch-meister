"""Regression tests for concurrent writes, failed reads and webhook delivery.
All network/storage/Telegram calls are fakes. No messages or payments are sent.
"""
import io
import json
import os
import sys
import threading
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'api'))
import webhook as W
import progress_state as P


class Redis:
    def __init__(self):
        self.values = {}
        self.lock = threading.Lock()
        self.barrier = None
        self.reads = 0

    def __call__(self, cmd):
        with self.lock:
            if cmd[0] == 'GET':
                value = self.values.get(cmd[1])
                self.reads += 1
                wait = self.barrier if self.reads <= 2 else None
            elif cmd[0] == 'EVAL' and cmd[1] == P.CAS:
                _, _, _, key, kind, expected, payload = cmd
                current = self.values.get(key)
                success = (current is None and kind == 'missing') or (kind == 'present' and current == expected)
                if success:
                    self.values[key] = payload
                return {'result': int(success)}
            elif cmd[0] == 'SET':
                if 'NX' in cmd and cmd[1] in self.values:
                    return {'result': None}
                self.values[cmd[1]] = cmd[2]
                return {'result': 'OK'}
            elif cmd[0] == 'EVAL' and "redis.call('DEL'" in cmd[1]:
                if self.values.get(cmd[3]) == cmd[4]:
                    del self.values[cmd[3]]
                return {'result': 1}
            else:
                raise AssertionError(cmd)
        if wait:
            wait.wait(timeout=3)
        return {'result': value}


class Reliability(unittest.TestCase):
    def test_invalid_auth_input_and_missing_bot_token(self):
        for value in ([], {}, 123, None):
            self.assertIsNone(W.verify_init_data(value, 'test'))
        with patch.object(W, 'BOT_TOKEN', ''), patch.object(W, 'UPSTASH_URL', ''), patch.object(W, 'handle_update', side_effect=lambda _: W.tg('sendMessage', {})):
            with self.assertRaises(W.TelegramRetry):
                W.process_update({'update_id': 99})

    def test_admin_ids_take_precedence_over_mutable_username(self):
        with patch.object(W, 'ADMIN_IDS', {'42'}), patch.object(W, 'ADMIN_USERNAMES', {'owner'}):
            self.assertTrue(W.is_admin({'id': 42, 'username': 'renamed'}))
            self.assertFalse(W.is_admin({'id': 43, 'username': 'owner'}))

    def test_concurrent_devices_retain_both_lessons(self):
        redis = Redis()
        redis.barrier = threading.Barrier(2)
        errors = []
        def save(lid):
            try:
                P.write(redis, 1, {'progress': {'completedLessons': [lid]}})
            except Exception as exc:
                errors.append(exc)
        threads = [threading.Thread(target=save, args=(lid,)) for lid in ['a1-01', 'a1-02']]
        for t in threads:
            t.start()
        for t in threads:
            t.join(5)
        self.assertFalse(errors)
        self.assertFalse(any(t.is_alive() for t in threads))
        self.assertEqual(P.read_raw(redis, 'dm:progress:1')[1]['progress']['completedLessons'], ['a1-01', 'a1-02'])

    def test_failed_or_corrupt_read_never_writes(self):
        for response in (None, {'error': 'timeout'}, {'result': 'broken'}, {'result': 'null'}):
            calls = []
            def redis(cmd):
                calls.append(cmd)
                return response
            with self.assertRaises(P.ProgressUnavailable):
                P.write(redis, 1, {'progress': {}})
            self.assertEqual([c[0] for c in calls], ['GET'])

    def test_cas_exhaustion_is_reported(self):
        def redis(cmd):
            return {'result': None if cmd[0] == 'GET' else 0}
        with self.assertRaises(P.ProgressUnavailable):
            P.write(redis, 1, {})

    def test_relearning_and_independent_xp(self):
        self.assertEqual(P._merge_word({'status': 'known', 'statusTs': 10, 'ts': 50}, {'status': 'new', 'statusTs': 20, 'ts': 20})['status'], 'new')
        a = {'xpBase': 100, 'xp': 110, 'xpEvents': {'a': 10}}
        b = {'xpBase': 100, 'xp': 108, 'xpEvents': {'b': 8}}
        merged = P._merge_global(a, b)
        self.assertEqual(merged['xp'], 118)
        self.assertEqual(P._merge_global(merged, a)['xp'], 118)

    def test_stale_streak_does_not_resurrect(self):
        merged = P._merge_global({'lastActive': '2026-10-01', 'streak': 30}, {'lastActive': '2026-11-15', 'streak': 1})
        self.assertEqual(merged['streak'], 1)

    def test_exam_attempts_merge_once(self):
        old = {'tries': 3, 'passed': 1, 'best': 5}
        a = P.merge_exam(old, {})
        b = P.merge_exam(old, {})
        a['records']['device-a'] = {'points': 2, 'passed': True, 'ts': 10}
        b['records']['device-b'] = {'points': 12, 'passed': False, 'ts': 20}
        merged = P.merge_exam(a, b)
        self.assertEqual((merged['tries'], merged['passed'], merged['best']), (5, 2, 2))
        self.assertEqual(P.merge_exam(merged, b)['tries'], 5)

    def test_duplicate_webhook_and_partial_retry(self):
        redis = Redis()
        sent = []
        def http(method, payload):
            sent.append(payload['text'])
            if payload['text'] == 'second' and sent.count('second') == 1:
                return {'ok': False, 'error_code': 503}
            return {'ok': True, 'result': {'message_id': len(sent)}}
        def handle(_):
            W.tg('sendMessage', {'text': 'first'})
            W.tg('sendMessage', {'text': 'second'})
        with patch.object(W, '_upstash', redis), patch.object(W, '_tg_http', http), patch.object(W, 'handle_update', handle), patch.object(W, 'UPSTASH_URL', 'test'), patch.object(W, 'UPSTASH_TOK', 'test'):
            with self.assertRaises(W.TelegramRetry):
                W.process_update({'update_id': 42})
            W.process_update({'update_id': 42})
            W.process_update({'update_id': 42})
        self.assertEqual(sent, ['first', 'second', 'second'])

    def test_precheckout_does_not_wait_for_storage(self):
        with patch.object(W, '_upstash', side_effect=AssertionError('storage before payment')), patch.object(W, 'handle_update') as handle:
            W.process_update({'update_id': 5, 'pre_checkout_query': {}})
            handle.assert_called_once()

    def test_webhook_requires_secret_and_retries_processing_errors(self):
        def request(secret, header='', raw=b'{"update_id":1}'):
            handler = W.handler.__new__(W.handler)
            handler.path = '/api/webhook'
            handler.headers = {'content-length': str(len(raw)), 'X-Telegram-Bot-Api-Secret-Token': header}
            handler.rfile = io.BytesIO(raw)
            handler.wfile = io.BytesIO()
            statuses = []
            handler.send_response = lambda code: statuses.append(code)
            handler.send_header = lambda *a: None
            handler.end_headers = lambda: None
            with patch.object(W, 'WEBHOOK_SECRET', secret):
                handler.do_POST()
            return statuses[0]
        self.assertEqual(request(''), 503)
        self.assertEqual(request('secret'), 403)
        self.assertEqual(request('secret', 'secret', b'broken'), 400)
        with patch.object(W, 'process_update', side_effect=RuntimeError('test')):
            self.assertEqual(request('secret', 'secret'), 503)


if __name__ == '__main__':
    unittest.main()
