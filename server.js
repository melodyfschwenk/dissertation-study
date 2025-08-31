// Simple Node server to handle video uploads with proper CORS headers.
// This server responds with JSON and exposes the required CORS headers so
// that the front-end fetch call in index.html can succeed when using
// `mode: 'cors'`.

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;
const requestCounts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestCounts.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  requestCounts.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

const REQUIRED_CONFIG = ['SHEETS_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_UPLOAD_PRESET'];

const logPath = path.join(__dirname, 'access.log');
let accessLog;
try {
  accessLog = fs.createWriteStream(logPath, { flags: 'a' });
} catch (err) {
  console.error('Failed to open access log:', err);
}

process.on('exit', () => {
  if (accessLog) accessLog.end();
});

function validateConfig() {
  const missing = REQUIRED_CONFIG.filter(key => !process.env[key]);
  if (missing.length) {
    console.warn(`Missing configuration values: ${missing.join(', ')}`);
    process.exit(1);
  }
}

validateConfig();

const server = http.createServer((req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    });
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
    return res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  }

  const ip = req.socket.remoteAddress;
  if (accessLog) {
    accessLog.write(`${new Date().toISOString()} ${ip} ${req.method} ${req.url}\n`);
  }
  if (isRateLimited(ip)) {
    res.writeHead(429, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
    return res.end(JSON.stringify({ success: false, error: 'Too many requests' }));
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      if (data && data.website) {
        res.writeHead(400, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        });
        return res.end(JSON.stringify({ success: false, error: 'Spam detected' }));
      }
    } catch (e) {
      // ignore malformed JSON
    }
    try {
      const gsRes = await fetch(process.env.SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body
      });
      const text = await gsRes.text();
      res.writeHead(gsRes.status, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': gsRes.headers.get('content-type') || 'application/json'
      });
      res.end(text);
    } catch (err) {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ success: false, error: 'Proxy request failed' }));
    }
  });

  req.on('error', err => {
    console.error('Request error:', err);
    res.writeHead(500, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ success: false, error: 'Request stream error' }));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on('error', err => {
  console.error('Server error:', err);
});

