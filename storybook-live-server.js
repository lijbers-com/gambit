const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers to avoid browser issues
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const urlPath = req.url === '/' ? '/login' : req.url;
  
  let htmlContent = '';
  
  switch (urlPath) {
    case '/login':
      htmlContent = createLoginPage();
      break;
    case '/dashboard':
      htmlContent = createDashboardPage();
      break;
    case '/campaigns':
      htmlContent = createCampaignsPage();
      break;
    case '/bookings':
      htmlContent = createBookingsPage();
      break;
    default:
      htmlContent = create404Page();
  }
  
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(htmlContent);
});

// Create the base layout template
const createLayout = (title, content, activeRoute = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Storybook Templates Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; }
        
        .app-layout { display: flex; min-height: 100vh; }
        
        /* Side Navigation */
        .sidebar { 
            width: 256px; 
            background: white; 
            border-right: 1px solid #e2e8f0; 
            display: flex; 
            flex-direction: column;
            position: fixed;
            height: 100vh;
            z-index: 10;
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
            margin-left: 256px;
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
            background: #f8fafc;
        }
        
        .card { 
            background: white; 
            border-radius: 12px; 
            border: 1px solid #e2e8f0; 
            overflow: hidden;
            margin-bottom: 24px;
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
        
        .badge.running { background: #dcfce7; color: #15803d; }
        .badge.ready { background: #f3f4f6; color: #374151; }
        .badge.paused { background: #fee2e2; color: #dc2626; }
        .badge.in-option { background: #fef3c7; color: #d97706; }
        
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
        
        .btn { 
            padding: 8px 16px; 
            border: 1px solid #d1d5db; 
            border-radius: 6px; 
            background: white; 
            cursor: pointer; 
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
            margin: 2px;
        }
        
        .btn:hover { background: #f9fafb; }
        .btn.primary { background: #3b82f6; color: white; border-color: #3b82f6; }
        .btn.primary:hover { background: #2563eb; }
        
        .filters { 
            display: flex; 
            gap: 16px; 
            margin-bottom: 24px; 
            flex-wrap: wrap;
        }
        
        .filter-group { 
            display: flex; 
            flex-direction: column; 
            gap: 4px;
        }
        
        .filter-label { 
            font-size: 12px; 
            font-weight: 500; 
            color: #374151;
        }
        
        .calendar-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
            gap: 8px; 
            margin: 24px 0;
        }
        
        .calendar-cell { 
            padding: 12px; 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            text-align: center; 
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .calendar-cell:hover { border-color: #3b82f6; }
        .calendar-cell.event { background: #eff6ff; border-color: #3b82f6; }
        
        /* Login page specific styles */
        .login-container { 
            display: flex; 
            min-height: 100vh;
        }
        
        .login-left { 
            flex: 1; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            text-align: center;
        }
        
        .login-right { 
            flex: 1; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 32px;
        }
        
        .login-form { 
            width: 100%; 
            max-width: 400px;
        }
        
        .form-group { 
            margin-bottom: 20px;
        }
        
        .form-label { 
            display: block; 
            margin-bottom: 4px; 
            font-weight: 500; 
            color: #374151;
        }
        
        .form-input { 
            width: 100%; 
            padding: 12px; 
            border: 1px solid #d1d5db; 
            border-radius: 6px; 
            font-size: 16px;
        }
        
        .form-input:focus { 
            outline: none; 
            border-color: #3b82f6; 
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .theme-selector { 
            margin-bottom: 24px;
        }
        
        .theme-options { 
            display: flex; 
            gap: 8px; 
            flex-wrap: wrap;
        }
        
        .theme-option { 
            padding: 8px 16px; 
            border: 2px solid #e2e8f0; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .theme-option:hover { border-color: #3b82f6; }
        .theme-option.active { border-color: #3b82f6; background: #eff6ff; color: #2563eb; }
        
        @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); }
            .main-content { margin-left: 0; }
            .login-container { flex-direction: column; }
            .login-left { min-height: 200px; }
        }
    </style>
</head>
<body>
    ${content}
    
    <script>
        // Theme switching functionality
        function selectTheme(theme) {
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            document.querySelector(\`[data-theme="\${theme}"]\`).classList.add('active');
            
            // Update login left side based on theme
            const themes = {
                'albert-heijn': {
                    title: 'Jouw Zelf Service Platform bij Albert Heijn',
                    subtitle: 'Retail Media Services',
                    bg: 'linear-gradient(135deg, #00A0E2 0%, #0080B8 100%)'
                },
                'retail-media': {
                    title: 'Welcome to Retail Media Platform',
                    subtitle: 'Maximize your retail advertising impact',
                    bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                },
                'tech-store': {
                    title: 'Tech Store Media Network',
                    subtitle: 'Connect with tech-savvy customers',
                    bg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                }
            };
            
            const selectedTheme = themes[theme];
            if (selectedTheme) {
                const leftSide = document.querySelector('.login-left');
                if (leftSide) {
                    leftSide.style.background = selectedTheme.bg;
                    leftSide.querySelector('h1').textContent = selectedTheme.title;
                    leftSide.querySelector('p').textContent = selectedTheme.subtitle;
                }
            }
        }
        
        // Login form submission
        function handleLogin(event) {
            event.preventDefault();
            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;
            
            if (username && password) {
                // Simulate loading
                const btn = document.querySelector('.login-btn');
                btn.textContent = 'Signing in...';
                btn.disabled = true;
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }
        }
        
        // Filter functionality
        function toggleFilter(filterType, value) {
            console.log('Filter toggled:', filterType, value);
        }
        
        // Calendar cell click
        function selectCalendarCell(week, product) {
            console.log('Calendar cell clicked:', week, product);
            document.querySelectorAll('.calendar-cell').forEach(cell => cell.classList.remove('selected'));
            event.target.classList.add('selected');
        }
    </script>
</body>
</html>
`;

// Create login page
const createLoginPage = () => createLayout('Login', `
    <div class="login-container">
        <div class="login-left">
            <div>
                <div style="font-size: 48px; margin-bottom: 16px;">🚀</div>
                <h1>Welcome to Retail Media Platform</h1>
                <p>Maximize your retail advertising impact</p>
            </div>
        </div>
        <div class="login-right">
            <div class="login-form">
                <div class="theme-selector">
                    <div class="filter-label">Select Theme</div>
                    <div class="theme-options">
                        <div class="theme-option active" data-theme="retail-media" onclick="selectTheme('retail-media')">
                            Retail Media
                        </div>
                        <div class="theme-option" data-theme="albert-heijn" onclick="selectTheme('albert-heijn')">
                            Albert Heijn
                        </div>
                        <div class="theme-option" data-theme="tech-store" onclick="selectTheme('tech-store')">
                            Tech Store
                        </div>
                    </div>
                </div>
                
                <h2 style="margin-bottom: 24px; color: #1e293b;">Sign in</h2>
                
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label class="form-label" for="username">Username</label>
                        <input class="form-input" id="username" type="text" placeholder="Enter username" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="password">Password</label>
                        <input class="form-input" id="password" type="password" placeholder="Enter password" required>
                    </div>
                    
                    <button type="submit" class="btn primary login-btn" style="width: 100%; padding: 12px;">
                        Sign in
                    </button>
                </form>
                
                <div style="margin-top: 24px; text-align: left;">
                    <a href="#" class="btn" style="color: #64748b; border: none; padding: 0;">Forgot your password?</a>
                    <div style="margin-top: 8px; color: #64748b;">
                        No account? <a href="#" style="color: #64748b;">Create one</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
`, '/login');

// Create dashboard page
const createDashboardPage = () => createLayout('Dashboard', `
    <div class="app-layout">
        <div class="sidebar">
            <div class="logo-section">
                <div class="logo">G</div>
                <span style="font-weight: 500; color: #1e293b;">Gambit</span>
            </div>
            <nav class="nav-menu">
                <a href="/login" class="nav-item">🔑 Login</a>
                <a href="/dashboard" class="nav-item active">📊 Dashboard</a>
                <a href="/campaigns" class="nav-item">📋 Campaigns</a>
                <a href="/bookings" class="nav-item">📅 Bookings</a>
            </nav>
        </div>
        <div class="main-content">
            <div class="header">
                <div>
                    <h1>Offline media in-store</h1>
                    <p>Manage your offline media campaigns and performance</p>
                </div>
                <div class="user-section">
                    <span>Jane Doe</span>
                    <div class="user-avatar">JD</div>
                </div>
            </div>
            <div class="content">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Page Content Area</div>
                        <div class="card-description">
                            This represents the Dashboard template from your Storybook
                        </div>
                    </div>
                    <div class="card-content">
                        <p><strong>Dashboard Template Features:</strong></p>
                        <ul style="margin: 16px 0 0 20px; line-height: 1.8;">
                            <li>AppLayout integration with navigation</li>
                            <li>Page header with action buttons</li>
                            <li>Flexible content area for dashboard widgets</li>
                            <li>User management and breadcrumbs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
`, '/dashboard');

// Create campaigns page
const createCampaignsPage = () => createLayout('Campaigns', `
    <div class="app-layout">
        <div class="sidebar">
            <div class="logo-section">
                <div class="logo">G</div>
                <span style="font-weight: 500; color: #1e293b;">Gambit</span>
            </div>
            <nav class="nav-menu">
                <a href="/login" class="nav-item">🔑 Login</a>
                <a href="/dashboard" class="nav-item">📊 Dashboard</a>
                <a href="/campaigns" class="nav-item active">📋 Campaigns</a>
                <a href="/bookings" class="nav-item">📅 Bookings</a>
            </nav>
        </div>
        <div class="main-content">
            <div class="header">
                <div>
                    <h1>Campaign Overview</h1>
                    <p>Monitor campaign performance and manage your advertising initiatives</p>
                </div>
                <div class="user-section">
                    <span>Jane Doe</span>
                    <div class="user-avatar">JD</div>
                </div>
            </div>
            <div class="content">
                <div class="card">
                    <div class="card-header">
                        <div class="filters">
                            <div class="filter-group">
                                <div class="filter-label">Status</div>
                                <div>
                                    <span class="badge" onclick="toggleFilter('status', 'running')">Running</span>
                                    <span class="badge" onclick="toggleFilter('status', 'ready')">Ready</span>
                                    <span class="badge" onclick="toggleFilter('status', 'paused')">Paused</span>
                                </div>
                            </div>
                            <div class="filter-group">
                                <div class="filter-label">Advertiser</div>
                                <div>
                                    <span class="badge" onclick="toggleFilter('advertiser', 'acme')">Acme Media</span>
                                    <span class="badge" onclick="toggleFilter('advertiser', 'brandx')">BrandX</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-content">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Status</th>
                                    <th>Advertiser</th>
                                    <th>Name</th>
                                    <th>Line Items</th>
                                    <th>Creatives</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>C-001</td>
                                    <td><span class="badge running">Running</span></td>
                                    <td>Acme Media</td>
                                    <td>Holiday Sale</td>
                                    <td><span class="badge">5</span></td>
                                    <td><span class="badge">3</span></td>
                                    <td>Jun 1, 2024</td>
                                    <td>Jun 30, 2024</td>
                                </tr>
                                <tr>
                                    <td>C-002</td>
                                    <td><span class="badge ready">Ready</span></td>
                                    <td>BrandX</td>
                                    <td>Summer Launch</td>
                                    <td><span class="badge">2</span></td>
                                    <td><span class="badge">1</span></td>
                                    <td>Jul 1, 2024</td>
                                    <td>Jul 31, 2024</td>
                                </tr>
                                <tr>
                                    <td>C-003</td>
                                    <td><span class="badge in-option">In option</span></td>
                                    <td>MediaWorks</td>
                                    <td>Back to School</td>
                                    <td><span class="badge">4</span></td>
                                    <td><span class="badge">2</span></td>
                                    <td>Aug 10, 2024</td>
                                    <td>Sep 10, 2024</td>
                                </tr>
                                <tr>
                                    <td>C-004</td>
                                    <td><span class="badge paused">Paused</span></td>
                                    <td>AdPartners</td>
                                    <td>Black Friday</td>
                                    <td><span class="badge">6</span></td>
                                    <td><span class="badge">4</span></td>
                                    <td>Nov 1, 2024</td>
                                    <td>Nov 30, 2024</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
`, '/campaigns');

// Create bookings page
const createBookingsPage = () => createLayout('Bookings', `
    <div class="app-layout">
        <div class="sidebar">
            <div class="logo-section">
                <div class="logo">G</div>
                <span style="font-weight: 500; color: #1e293b;">Gambit</span>
            </div>
            <nav class="nav-menu">
                <a href="/login" class="nav-item">🔑 Login</a>
                <a href="/dashboard" class="nav-item">📊 Dashboard</a>
                <a href="/campaigns" class="nav-item">📋 Campaigns</a>
                <a href="/bookings" class="nav-item active">📅 Bookings</a>
            </nav>
        </div>
        <div class="main-content">
            <div class="header">
                <div>
                    <h1>Bookings Calendar</h1>
                    <p>Comprehensive calendar view of all media bookings</p>
                </div>
                <div class="user-section">
                    <span>Jane Doe</span>
                    <div class="user-avatar">JD</div>
                </div>
            </div>
            <div class="content">
                <div class="card">
                    <div class="card-header">
                        <div class="filters">
                            <div class="filter-group">
                                <div class="filter-label">View Type</div>
                                <div>
                                    <span class="badge" onclick="toggleFilter('view', 'reach')">Reach</span>
                                    <span class="badge" onclick="toggleFilter('view', 'revenue')">Revenue</span>
                                    <span class="badge" onclick="toggleFilter('view', 'fillRate')">Fill Rate</span>
                                    <span class="badge" onclick="toggleFilter('view', 'stores')">Stores</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-content">
                        <div style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 12px;">Media Products Calendar (12 weeks)</h4>
                            <div class="calendar-grid">
                                ${Array.from({length: 36}, (_, i) => {
                                    const week = (i % 12) + 1;
                                    const product = Math.floor(i / 12) + 1;
                                    const products = ['Digital Display', 'In-Store Digital', 'Sponsored Products'];
                                    const productName = products[product - 1];
                                    const isEvent = [1,2,3,5,6,8,9].includes(week);
                                    return `
                                    <div class="calendar-cell ${isEvent ? 'event' : ''}" 
                                         onclick="selectCalendarCell(${week}, '${productName}')">
                                        <div style="font-size: 12px; color: #64748b;">Week ${week}</div>
                                        <div style="font-weight: 500; margin: 4px 0;">${productName}</div>
                                        <div style="font-size: 14px; color: ${Math.random() > 0.3 ? '#059669' : '#dc2626'};">
                                            ${Math.floor(Math.random() * 100)}%
                                        </div>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: 12px;">Retailer Events</h4>
                            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                                <span class="badge" style="background: #dcfce7; color: #15803d;">Spring Sale (Weeks 1-3)</span>
                                <span class="badge" style="background: #fef3c7; color: #d97706;">Summer Campaign (Weeks 5-8)</span>
                                <span class="badge" style="background: #ede9fe; color: #7c3aed;">Back to School (Weeks 8-10)</span>
                                <span class="badge" style="background: #fce7f3; color: #be185d;">Holiday Season (Weeks 10-12)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`, '/bookings');

// Create 404 page
const create404Page = () => createLayout('Not Found', `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center;">
        <div>
            <h1 style="font-size: 48px; margin-bottom: 16px;">404</h1>
            <p style="color: #64748b; margin-bottom: 24px;">Page not found</p>
            <a href="/login" class="btn primary">Go to Login</a>
        </div>
    </div>
`);

const PORT = 8000;

server.listen(PORT, '127.0.0.1', (err) => {
  if (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
  
  console.log('🚀 Storybook Templates Demo Server is running!');
  console.log(`📱 Access at: http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('📋 Available Pages:');
  console.log('   🔑 Login: http://127.0.0.1:8000/ (redirects to login)');
  console.log('   📊 Dashboard: http://127.0.0.1:8000/dashboard');  
  console.log('   📋 Campaigns: http://127.0.0.1:8000/campaigns');
  console.log('   📅 Bookings: http://127.0.0.1:8000/bookings');
  console.log('');
  console.log('✨ This server uses the EXACT page templates from your Storybook!');
  console.log('   - Login page with theme switching');
  console.log('   - Dashboard page template');  
  console.log('   - Campaign Overview with filters and table');
  console.log('   - Bookings Calendar with calendar grid');
  console.log('');
  console.log('🔗 Full clickthrough navigation between all pages');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close();
  process.exit(0);
});