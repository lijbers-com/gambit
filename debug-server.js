const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Debug Server</title>
    </head>
    <body>
        <h1>Debug Server Working!</h1>
        <p>URL: ${req.url}</p>
        <p>Method: ${req.method}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        
        <div style="margin: 20px 0;">
            <a href="/" style="margin-right: 10px;">Home</a>
            <a href="/test" style="margin-right: 10px;">Test Page</a>
        </div>
        
        <p>This is the simplest possible server to test connectivity.</p>
    </body>
    </html>
  `);
});

const PORT = 8000;

server.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
  console.log(`Debug server running on http://localhost:${PORT}`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  
  // Test internal connectivity
  setTimeout(() => {
    const testReq = http.get(`http://localhost:${PORT}`, (res) => {
      console.log('✓ Internal test successful - server can reach itself');
    }).on('error', (err) => {
      console.error('✗ Internal test failed:', err.message);
    });
  }, 1000);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close();
  process.exit(0);
});