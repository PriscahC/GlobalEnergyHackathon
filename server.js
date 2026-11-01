'use strict';
/*
 * Pamoja Cell server: serves the demo page from ./docs and forwards AI questions to Groq.
 * The Groq key stays on the server. It is never sent to the browser.
 * No npm packages needed. Requires Node 18 or newer.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// Tiny .env loader so no extra packages are needed.
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch (e) { /* no .env file: fine, AI stays off */ }

const PORT = Number(process.env.PORT) || 3000;
const KEY = process.env.GROQ_API_KEY || '';
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const BASE = (process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
const DAILY_CAP = Number(process.env.MAX_REQUESTS_PER_DAY) || 300;
const WEB_ROOT = path.join(__dirname, 'docs');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon'
};

const SYSTEM_PROMPT = [
  'You are the explainer inside Pamoja Cell, a tool that grades retired e-motorcycle battery packs for second-life use.',
  'The grade (A, B or Reject) is set by fixed rules. Never change it, argue with it, or declare a pack safe.',
  'Grade A packs suit cold storage and clinics, Grade B packs suit kiosk power and lighting, Reject packs go to a recycler.',
  'Explain results in plain language for a small-workshop technician, suggest practical checks, and say when a qualified technician or the pack operator must decide.',
  'Use only the numbers provided. If you need a number that was not given, say so.',
  'Keep answers under 120 words. No headings.'
].join(' ');

// Simple protection for your credits: 12 questions per minute per visitor, and a daily cap.
const hits = new Map();
let dayKey = '';
let dayCount = 0;
function allow(ip) {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey) { dayKey = today; dayCount = 0; }
  if (dayCount >= DAILY_CAP) return false;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= 12) { hits.set(ip, recent); return false; }
  recent.push(now);
  hits.set(ip, recent);
  dayCount++;
  return true;
}

function json(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 10000) { reject(new Error('too large')); req.destroy(); }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

async function ask(req, res) {
  if (!KEY) return json(res, 503, { error: 'AI is not connected. Add GROQ_API_KEY to the .env file and restart the server.' });
  if (!allow(clientIp(req))) return json(res, 429, { error: 'Too many questions right now. Wait a minute and try again.' });

  let body;
  try { body = JSON.parse(await readBody(req)); } catch (e) { return json(res, 400, { error: 'Bad request.' }); }

  const question = String(body.question || '').trim().slice(0, 500);
  if (!question) return json(res, 400, { error: 'Type a question first.' });

  const p = body.pack || {};
  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 'not given');
  const damage = ['none', 'swelling', 'leak'].includes(p.damage) ? p.damage : 'none';
  const grade = ['A', 'B', 'Reject'].includes(body.grade) ? body.grade : 'unknown';
  const id = String(p.id || 'unnamed').replace(/[^\w\- ]/g, '').slice(0, 40);
  const hours = Number.isFinite(Number(body.backupHours)) && body.backupHours !== null ? Number(body.backupHours).toFixed(1) + ' h at ' + num(p.load) + ' W' : 'not deployed';
  const facts = [
    'Pack ' + id + ': state of health ' + num(p.soh) + '%, resistance rise ' + num(p.rise) + '% vs new, peak temperature ' + num(p.temp) + ' C, visible damage: ' + damage + '.',
    'Rules-based grade: ' + grade + '. Reason: ' + String(body.reason || '').slice(0, 300),
    'Estimated backup: ' + hours + '.'
  ].join('\n');

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const r = await fetch(BASE + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: facts + '\nQuestion: ' + question }
        ]
      }),
      signal: ctrl.signal
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = (data.error && (data.error.message || data.error)) || data.message || ('Groq returned status ' + r.status);
      return json(res, 502, { error: 'Groq request failed: ' + String(msg).slice(0, 200) + ' (check GROQ_MODEL and your key).' });
    }
    const answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!answer) return json(res, 502, { error: 'Groq returned an empty answer.' });
    return json(res, 200, { answer: String(answer).trim() });
  } catch (e) {
    return json(res, 504, { error: e.name === 'AbortError' ? 'Groq took too long. Try again.' : 'Could not reach Groq: ' + e.message });
  } finally {
    clearTimeout(timer);
  }
}

function serveStatic(req, res) {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch (e) { res.writeHead(400); return res.end('Bad request'); }
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(WEB_ROOT, rel));
  if (file !== WEB_ROOT && !file.startsWith(WEB_ROOT + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : buf);
  });
}

http.createServer((req, res) => {
  const pathname = req.url.split('?')[0];
  if (req.method === 'GET' && pathname === '/api/status') return json(res, 200, { ai: Boolean(KEY), model: MODEL });
  if (req.method === 'POST' && pathname === '/api/ask') return ask(req, res);
  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
  res.writeHead(405);
  res.end();
}).listen(PORT, () => {
  console.log('Pamoja Cell running at http://localhost:' + PORT);
  console.log(KEY ? 'Groq AI connected (model ' + MODEL + ').' : 'Groq AI is off. Add GROQ_API_KEY to .env to turn it on.');
});