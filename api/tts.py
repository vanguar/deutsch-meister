"""
TTS-прокси для Deutsch Meister (Vercel serverless, Python stdlib).

Проксирует Google Translate TTS и отдаёт mp3 с заголовком CORS
(Access-Control-Allow-Origin: *). Это нужно, чтобы фронтенд мог загрузить звук
через fetch() и проиграть его в Web Audio API — самый надёжный способ звука
внутри Telegram WebView (обычный <audio> там часто молчит).

Эндпоинт: https://<project>.vercel.app/api/tts?text=Hallo&tl=de
"""

import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

GOOGLE = "https://translate.google.com/translate_tts"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")


class handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        text = (q.get("text") or q.get("q") or [""])[0]
        tl = (q.get("tl") or ["de"])[0]

        if not text:
            self.send_response(400)
            self._cors()
            self.end_headers()
            self.wfile.write(b"missing text")
            return

        url = GOOGLE + "?" + urllib.parse.urlencode({
            "ie": "UTF-8", "client": "tw-ob", "tl": tl, "q": text[:200],
        })
        req = urllib.request.Request(url, headers={
            "User-Agent": UA,
            "Referer": "https://translate.google.com/",
        })

        try:
            with urllib.request.urlopen(req, timeout=8) as r:
                data = r.read()
                ctype = r.headers.get("Content-Type", "audio/mpeg")
        except Exception as e:  # noqa: BLE001
            self.send_response(502)
            self._cors()
            self.end_headers()
            self.wfile.write(("tts upstream error: " + str(e)).encode("utf-8"))
            return

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self._cors()
        self.send_header("Cache-Control", "public, max-age=604800, immutable")
        self.end_headers()
        self.wfile.write(data)
