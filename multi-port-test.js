const http = require('http');

const testPorts = [8000, 8080, 3000, 3001, 9000];

testPorts.forEach(port => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Server working on port ${port}!</h1>
      <p>Time: ${new Date().toLocaleString()}</p>
      <p>URL: ${req.url}</p>
      <p>If you can see this, the connection is working.</p>
    `);
  });

  server.listen(port, '127.0.0.1', (err) => {
    if (err) {
      console.log(`❌ Port ${port}: Failed - ${err.message}`);
    } else {
      console.log(`✅ Port ${port}: Server running at http://127.0.0.1:${port}`);
    }
  });

  server.on('error', (err) => {
    console.log(`❌ Port ${port}: Error - ${err.message}`);
  });
});

console.log('Testing multiple ports...');
console.log('Try accessing:');
testPorts.forEach(port => {
  console.log(`  http://127.0.0.1:${port}`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down all servers...');
  process.exit(0);
});