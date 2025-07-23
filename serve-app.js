const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  let parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle Next.js routing
  if (pathname === '/' || pathname === '/index.html') {
    pathname = '/index.html';
  } else if (!pathname.includes('.')) {
    // For dynamic routes like /campaigns/123, serve the app shell
    pathname = '/index.html';
  }
  
  let filePath = path.join(__dirname, 'out', pathname);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Try serving index.html for client-side routing
      filePath = path.join(__dirname, 'out', 'index.html');
    }
    
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404);
          res.end('File not found');
        } else {
          res.writeHead(500);
          res.end('Server error: ' + error.code);
        }
      } else {
        const ext = path.parse(filePath).ext;
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(content);
      }
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`✅ Server running at http://127.0.0.1:${port}/`);
  console.log(`✅ Also accessible at http://localhost:${port}/`);
  console.log(`📁 Serving from: ${path.join(__dirname, 'out')}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});