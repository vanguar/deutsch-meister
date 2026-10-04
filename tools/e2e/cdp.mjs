// Мини-обвязка CDP: запуск headless Chrome + статический сервер
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
export const SP = process.env.SP || os.tmpdir();
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export async function start(port = 9333) {
  const chrome = spawn(CHROME,
    ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${SP}\chr${Date.now()}`, '--window-size=390,844', 'about:blank'], { stdio: 'ignore' });
  let list;
  for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (list.find(t => t.type === 'page')) break; } catch {} await new Promise(r => setTimeout(r, 200)); }
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
  let id = 0; const pend = {}; const events = [];
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } else if (m.method) events.push(m); };
  await new Promise(r => ws.onopen = r);
  const send = (method, params = {}) => new Promise(r => { pend[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const ev = async x => { const m = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); if (m.result?.exceptionDetails) throw new Error(JSON.stringify(m.result.exceptionDetails).slice(0, 400)); return m.result?.result?.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const go = async (url, ms = 1500) => { events.length = 0; await send('Page.navigate', { url }); await wait(ms); };
  const errors = () => events.filter(e => e.method === 'Runtime.exceptionThrown').map(e => e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text);
  const shot = async f => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(SP + '/' + f, Buffer.from(r.result.data, 'base64')); };
  const close = () => { try { ws.close(); } catch {} chrome.kill(); };
  return { send, ev, go, wait, errors, shot, close, events };
}
