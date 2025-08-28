// Simple Node server to handle video uploads with proper CORS headers.
// This server responds with JSON and exposes the required CORS headers so
// that the front-end fetch call in index.html can succeed when using
// `mode: 'cors'`.

const http = require('http');

function validatePayload(data) {
  return data &&
    typeof data.sessionCode === 'string' && data.sessionCode.trim() !== '' &&
    typeof data.filename === 'string';
}

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

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let data;
    try {
      data = JSON.parse(body || '{}');
    } catch (err) {
      res.writeHead(400, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
    }

    if (!validatePayload(data)) {
      res.writeHead(400, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify({ success: false, error: 'Invalid input' }));
    }

    // Process the body as needed. For this example we simply acknowledge
    // receipt of the data.
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ success: true }));
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

// Log uncaught errors to avoid silent failures
process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
});

