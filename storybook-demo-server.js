const http = require('http');
const url = require('url');

// Shared layout template
const createLayout = (title, content, activeRoute = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Retail Media Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; }
        
        .app-layout { display: flex; min-height: 100vh; }
        
        /* Side Navigation */
        .sidebar { 
            width: 256px; 
            background: white; 
            border-right: 1px solid #e2e8f0; 
            display: flex; 
            flex-direction: column;
        }
        
        .logo-section { 
            padding: 24px 20px; 
            border-bottom: 1px solid #e2e8f0; 
            display: flex; 
            align-items: center; 
            gap: 12px;
        }
        
        .logo { 
            width: 32px; 
            height: 32px; 
            background: #3b82f6; 
            border-radius: 6px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold;
        }
        
        .nav-menu { flex: 1; padding: 24px 0; }
        
        .nav-item { 
            display: block; 
            padding: 12px 20px; 
            color: #64748b; 
            text-decoration: none; 
            border-left: 3px solid transparent;
            transition: all 0.2s;
        }
        
        .nav-item:hover { 
            background: #f1f5f9; 
            color: #334155; 
        }
        
        .nav-item.active { 
            background: #eff6ff; 
            color: #2563eb; 
            border-left-color: #2563eb; 
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
        }
        
        .header { 
            background: white; 
            border-bottom: 1px solid #e2e8f0; 
            padding: 20px 32px; 
            display: flex; 
            align-items: center; 
            justify-content: space-between;
        }
        
        .header h1 { 
            font-size: 24px; 
            font-weight: 600; 
            color: #1e293b; 
        }
        
        .header p { 
            color: #64748b; 
            margin-top: 4px; 
        }
        
        .user-section { 
            display: flex; 
            align-items: center; 
            gap: 12px;
        }
        
        .user-avatar { 
            width: 32px; 
            height: 32px; 
            background: #10b981; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: 500;
        }
        
        .content { 
            flex: 1; 
            padding: 32px; 
        }
        
        .card { 
            background: white; 
            border-radius: 12px; 
            border: 1px solid #e2e8f0; 
            overflow: hidden;
        }
        
        .card-header { 
            padding: 24px; 
            border-bottom: 1px solid #e2e8f0; 
        }
        
        .card-title { 
            font-size: 20px; 
            font-weight: 600; 
            color: #1e293b; 
            margin-bottom: 8px;
        }
        
        .card-description { 
            color: #64748b; 
            line-height: 1.5;
        }
        
        .card-content { 
            padding: 24px; 
        }
        
        .badge { 
            display: inline-flex; 
            align-items: center; 
            padding: 4px 8px; 
            background: #eff6ff; 
            color: #2563eb; 
            border-radius: 6px; 
            font-size: 12px; 
            font-weight: 500; 
            margin: 2px;
        }
        
        .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 16px;
        }
        
        .table th, .table td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #e2e8f0; 
        }
        
        .table th { 
            background: #f8fafc; 
            font-weight: 500; 
            color: #374151;
        }
        
        .status-available { color: #059669; }
        .status-full { color: #dc2626; }
        
        .metric { 
            text-align: center; 
            padding: 20px; 
            margin: 10px; 
            background: #f8fafc; 
            border-radius: 8px;
        }
        
        .metric-value { 
            font-size: 32px; 
            font-weight: bold; 
            color: #1e293b; 
        }
        
        .metric-label { 
            color: #64748b; 
            margin-top: 4px; 
        }
    </style>
</head>
<body>
    <div class="app-layout">
        <div class="sidebar">
            <div class="logo-section">
                <div class="logo">G</div>
                <span style="font-weight: 500; color: #1e293b;">Gambit</span>
            </div>
            <nav class="nav-menu">
                <a href="/" class="nav-item ${activeRoute === '/' ? 'active' : ''}">🏠 Home</a>
                <a href="/dashboard" class="nav-item ${activeRoute === '/dashboard' ? 'active' : ''}">📊 Dashboard</a>
                <a href="/campaigns" class="nav-item ${activeRoute === '/campaigns' ? 'active' : ''}">📋 Campaigns</a>
                <a href="/bookings" class="nav-item ${activeRoute === '/bookings' ? 'active' : ''}">📅 Bookings</a>
                <a href="/performance" class="nav-item ${activeRoute === '/performance' ? 'active' : ''}">📈 Performance</a>
            </nav>
        </div>
        <div class="main-content">
            <div class="header">
                <div>
                    <h1>${title}</h1>
                    <p>Storybook Page Templates Connected via Navigation</p>
                </div>
                <div class="user-section">
                    <span>Jane Doe</span>
                    <div class="user-avatar">JD</div>
                </div>
            </div>
            <div class="content">
                ${content}
            </div>
        </div>
    </div>
</body>
</html>
`;

// Page content templates
const homePage = () => `
    <div class="card">
        <div class="card-header">
            <div class="card-title">Welcome to Retail Media Platform</div>
            <div class="card-description">
                This demonstrates your Storybook page templates connected via the SideNavigation component.
                Use the navigation on the left to explore different templates.
            </div>
        </div>
        <div class="card-content">
            <p><strong>Available Templates:</strong></p>
            <ul style="margin: 16px 0; padding-left: 20px; line-height: 1.8;">
                <li>📊 <strong>Dashboard</strong> - Overview metrics and key performance indicators</li>
                <li>📋 <strong>Campaigns</strong> - Campaign management and overview table</li>
                <li>📅 <strong>Bookings</strong> - Calendar view with booking management</li>
                <li>📈 <strong>Performance</strong> - Analytics and performance metrics</li>
            </ul>
            <p style="color: #64748b; margin-top: 24px;">
                Each page represents a different Storybook template from your component library, 
                now connected in a single application flow.
            </p>
        </div>
    </div>
`;

const dashboardPage = () => `
    <div class="card">
        <div class="card-header">
            <div class="card-title">Dashboard Overview</div>
            <div class="card-description">
                Key metrics and performance indicators for offline media campaigns
            </div>
        </div>
        <div class="card-content">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div class="metric">
                    <div class="metric-value">€24,521</div>
                    <div class="metric-label">Revenue</div>
                </div>
                <div class="metric">
                    <div class="metric-value">156</div>
                    <div class="metric-label">Active Campaigns</div>
                </div>
                <div class="metric">
                    <div class="metric-value">89%</div>
                    <div class="metric-label">Fill Rate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">2.4M</div>
                    <div class="metric-label">Impressions</div>
                </div>
            </div>
            <p style="color: #64748b;">
                🎯 <strong>Template Source:</strong> This represents your Dashboard Storybook template with 
                metrics cards and overview data.
            </p>
        </div>
    </div>
`;

const campaignsPage = () => `
    <div class="card">
        <div class="card-header">
            <div class="card-title">Campaign Overview</div>
            <div class="card-description">
                Monitor campaign performance and manage your advertising initiatives
            </div>
        </div>
        <div class="card-content">
            <table class="table">
                <thead>
                    <tr>
                        <th>Campaign</th>
                        <th>Status</th>
                        <th>Budget</th>
                        <th>Spend</th>
                        <th>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Spring Sale 2025</strong></td>
                        <td><span class="badge">Active</span></td>
                        <td>€15,000</td>
                        <td>€8,234</td>
                        <td>+24% CTR</td>
                    </tr>
                    <tr>
                        <td><strong>Product Launch</strong></td>
                        <td><span class="badge">Active</span></td>
                        <td>€25,000</td>
                        <td>€12,450</td>
                        <td>+18% Conversion</td>
                    </tr>
                    <tr>
                        <td><strong>Brand Awareness</strong></td>
                        <td><span class="badge">Paused</span></td>
                        <td>€10,000</td>
                        <td>€4,123</td>
                        <td>+12% Reach</td>
                    </tr>
                </tbody>
            </table>
            <p style="color: #64748b; margin-top: 24px;">
                🎯 <strong>Template Source:</strong> This represents your Campaign Overview Storybook template 
                with data tables and status indicators.
            </p>
        </div>
    </div>
`;

const bookingsPage = () => `
    <div class="card">
        <div class="card-header">
            <div class="card-title">Bookings Calendar</div>
            <div class="card-description">
                Comprehensive calendar view of all media bookings across different weeks
            </div>
        </div>
        <div class="card-content">
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 24px;">
                ${Array.from({length: 21}, (_, i) => `
                    <div style="padding: 12px; background: ${i % 3 === 0 ? '#eff6ff' : '#f8fafc'}; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0;">
                        <div style="font-weight: 500;">Week ${i + 1}</div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                            ${i % 3 === 0 ? 'Spring Sale' : i % 5 === 0 ? 'Summer Campaign' : 'Available'}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div>
                <h4 style="margin-bottom: 12px;">Product Availability</h4>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Campaigns</th>
                            <th>Status</th>
                            <th>Capacity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>End Cap Display</td>
                            <td><span class="badge">3</span></td>
                            <td class="status-available">Available</td>
                            <td>85%</td>
                        </tr>
                        <tr>
                            <td>Digital Screen</td>
                            <td><span class="badge">2</span></td>
                            <td class="status-full">Full</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td>Shelf Talkers</td>
                            <td><span class="badge">1</span></td>
                            <td class="status-available">Available</td>
                            <td>40%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="color: #64748b; margin-top: 24px;">
                🎯 <strong>Template Source:</strong> This represents your Booking Calendar Storybook template 
                with calendar table, filters, and right-drawer functionality.
            </p>
        </div>
    </div>
`;

const performancePage = () => `
    <div class="card">
        <div class="card-header">
            <div class="card-title">Performance Analytics</div>
            <div class="card-description">
                Detailed performance metrics and analytics dashboard
            </div>
        </div>
        <div class="card-content">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div class="metric">
                    <div class="metric-value">94.2%</div>
                    <div class="metric-label">Campaign Success Rate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">€3.24</div>
                    <div class="metric-label">Cost Per Click</div>
                </div>
                <div class="metric">
                    <div class="metric-value">12.4%</div>
                    <div class="metric-label">Conversion Rate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">4.2x</div>
                    <div class="metric-label">Return on Ad Spend</div>
                </div>
            </div>
            
            <h4 style="margin: 24px 0 12px;">Top Performing Campaigns</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>Campaign</th>
                        <th>Impressions</th>
                        <th>Clicks</th>
                        <th>CTR</th>
                        <th>Conversions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Spring Sale 2025</strong></td>
                        <td>1,245,678</td>
                        <td>15,234</td>
                        <td>1.22%</td>
                        <td>1,834</td>
                    </tr>
                    <tr>
                        <td><strong>Product Launch</strong></td>
                        <td>894,512</td>
                        <td>12,456</td>
                        <td>1.39%</td>
                        <td>1,567</td>
                    </tr>
                    <tr>
                        <td><strong>Brand Awareness</strong></td>
                        <td>654,321</td>
                        <td>8,765</td>
                        <td>1.34%</td>
                        <td>1,123</td>
                    </tr>
                </tbody>
            </table>
            
            <p style="color: #64748b; margin-top: 24px;">
                🎯 <strong>Template Source:</strong> This represents your Performance Analytics Storybook template 
                with charts, metrics, and detailed reporting tables.
            </p>
        </div>
    </div>
`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${path}`);
  
  let content = '';
  let title = '';
  
  switch (path) {
    case '/':
      title = 'Home';
      content = homePage();
      break;
    case '/dashboard':
      title = 'Dashboard';
      content = dashboardPage();
      break;
    case '/campaigns':
      title = 'Campaigns';
      content = campaignsPage();
      break;
    case '/bookings':
      title = 'Bookings Calendar';
      content = bookingsPage();
      break;
    case '/performance':
      title = 'Performance';
      content = performancePage();
      break;
    default:
      title = '404 - Not Found';
      content = `
        <div class="card">
          <div class="card-content">
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go back to Home</a>
          </div>
        </div>
      `;
  }
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(createLayout(title, content, path));
});

const PORT = 8000;

server.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
  console.log('🚀 Storybook Demo Server running!');
  console.log(`📱 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('📋 Available Pages:');
  console.log('   🏠 Home: http://localhost:8000/');
  console.log('   📊 Dashboard: http://localhost:8000/dashboard');
  console.log('   📋 Campaigns: http://localhost:8000/campaigns');
  console.log('   📅 Bookings: http://localhost:8000/bookings');
  console.log('   📈 Performance: http://localhost:8000/performance');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close();
  process.exit(0);
});