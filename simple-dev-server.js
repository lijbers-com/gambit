const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const port = 8000;

console.log('🚀 Starting Next.js development server on port 8000...');

// Start Next.js dev server in background
const nextProcess = exec('npm run dev -- --port 3000', (error, stdout, stderr) => {
  if (error) {
    console.error(`Next.js error: ${error}`);
    return;
  }
});

// Wait a moment for Next.js to start
setTimeout(() => {
  // Create proxy server
  const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Proxy requests to Next.js dev server
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(500);
      res.end('Server error');
    });

    req.pipe(proxyReq);
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`✅ Proxy server running at http://127.0.0.1:${port}/`);
    console.log(`✅ Also accessible at http://localhost:${port}/`);
    console.log(`🔄 Proxying to Next.js dev server on port 3000`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}, 3000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  if (nextProcess) {
    nextProcess.kill();
  }
  process.exit();
});