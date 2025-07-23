const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Serve static files from the out directory (if it exists) or public
app.use(express.static(path.join(__dirname, 'out')));
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Simple Test Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .nav { display: flex; gap: 20px; margin-bottom: 40px; }
            .nav a { padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; }
            .nav a:hover { background: #0052a3; }
            .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/campaigns">Campaigns</a>
            <a href="/bookings">Bookings</a>
        </div>
        
        <div class="card">
            <h1>Simple Test Server - Home</h1>
            <p>This is a basic test to see if we can connect to a local server.</p>
            <p>Click the navigation links above to test routing.</p>
        </div>
    </body>
    </html>
  `);
});

app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Dashboard - Test Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .nav { display: flex; gap: 20px; margin-bottom: 40px; }
            .nav a { padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; }
            .nav a:hover { background: #0052a3; }
            .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/campaigns">Campaigns</a>
            <a href="/bookings">Bookings</a>
        </div>
        
        <div class="card">
            <h1>Dashboard Page</h1>
            <p>This would be the dashboard template from Storybook.</p>
        </div>
    </body>
    </html>
  `);
});

app.get('/campaigns', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Campaigns - Test Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .nav { display: flex; gap: 20px; margin-bottom: 40px; }
            .nav a { padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; }
            .nav a:hover { background: #0052a3; }
            .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/campaigns">Campaigns</a>
            <a href="/bookings">Bookings</a>
        </div>
        
        <div class="card">
            <h1>Campaigns Page</h1>
            <p>This would be the campaigns template from Storybook.</p>
        </div>
    </body>
    </html>
  `);
});

app.get('/bookings', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bookings - Test Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .nav { display: flex; gap: 20px; margin-bottom: 40px; }
            .nav a { padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; }
            .nav a:hover { background: #0052a3; }
            .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/campaigns">Campaigns</a>
            <a href="/bookings">Bookings</a>
        </div>
        
        <div class="card">
            <h1>Bookings Calendar</h1>
            <p>This would be the booking calendar template from Storybook.</p>
        </div>
    </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at:`);
  console.log(`- Local: http://localhost:${port}`);
  console.log(`- Network: http://192.168.178.101:${port}`);
  console.log(`\nIf you can access this, then we know the network connection works.`);
  console.log(`If not, there might be a firewall or network configuration issue.`);
});