const http = require('http');
const port = 8000;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*' 
  });
  
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gambit Application - Test Server</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        .status { background: #e8f5e8; padding: 10px; border-radius: 4px; margin: 10px 0; }
        .link { display: block; margin: 10px 0; padding: 10px; background: #f0f8ff; border-radius: 4px; text-decoration: none; color: #0066cc; }
        .link:hover { background: #e6f3ff; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎯 Gambit Application - Server Running</h1>
        <div class="status">✅ Server is running successfully on port ${port}</div>
        <p>This confirms the server connectivity is working. All the page templates have been created using EXACT Storybook implementations:</p>
        
        <h3>📋 Available Pages:</h3>
        <a href="/login" class="link">🔐 Login Page (story/page-templates-login--albert-heijn)</a>
        <a href="/dashboard" class="link">📊 Dashboard (story/page-templates-dashboard--dashboard)</a>
        <a href="/campaigns" class="link">📋 Campaign Overview (story/page-templates-campaign-overview--campaign-overview)</a>
        <a href="/campaigns/C-001" class="link">📝 Campaign Details (story/page-templates-campaign-details--campaign-details)</a>
        <a href="/creatives/CR-001" class="link">🎨 Creative Detail (story/page-templates-creative-detail--display)</a>
        <a href="/line-items/LI-001" class="link">📊 Line Item Detail (story/page-templates-line-item-detail--display)</a>
        
        <h3>🚀 Next Steps:</h3>
        <p>The Next.js development server should be running. If you need the full application:</p>
        <ol>
          <li>Stop this test server</li>
          <li>Run: <code>npm run dev</code></li>
          <li>Access at: <code>http://127.0.0.1:3000</code> or <code>http://localhost:3000</code></li>
        </ol>
        
        <p><strong>Note:</strong> Based on previous testing, if localhost doesn't work, use 127.0.0.1 instead.</p>
      </div>
    </body>
    </html>
  `);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`✅ Test server running at http://127.0.0.1:${port}/`);
  console.log(`✅ Also accessible at http://localhost:${port}/`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});