import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/ui/logo';
import React, { useState } from 'react';

const meta: Meta = {
  title: 'Page templates/Login',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Login Page Template

The Login page template provides a modern, theme-aware authentication interface with customizable branding for different retail partners.

## Features

- **Split Screen Layout**: Theme-specific branding on the left, login form on the right
- **Theme Variations**: Different visual themes for various retail partners
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Fully accessible form inputs and keyboard navigation
- **Security Features**: Password input with show/hide toggle
- **Additional Actions**: Forgot password and create account links

## Theme Support

Each theme includes:
- Custom background image
- Brand logo
- Theme-specific colors
- Custom welcome text

## Available Themes

1. **Albert Heijn** - Dutch supermarket chain theme
2. **Retail Media Platform** - Generic retail media theme

## Components Used

- Card (form container)
- Input (form fields)
- Label (form labels)
- Button (submit action)
- Custom theme styling
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

interface Theme {
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  title: string;
  subtitle: string;
}

interface LoginTemplateProps {
  themes: Record<string, Theme>;
  initialTheme?: string;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({ themes, initialTheme = 'albertHeijn' }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = themes[currentTheme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert(`Login attempted with username: ${username}`);
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Theme specific image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: `url(${theme.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Logo 
              theme={currentTheme === 'albertHeijn' ? 'albert-heijn' : 'auto'}
              variant="auto"
              alt={`${theme.name} logo`} 
              className="h-12 w-auto mb-8"
            />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">{theme.title}</h1>
            <p className="text-xl opacity-90">{theme.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="space-y-6">
              {/* Mobile logo */}
              <div className="lg:hidden flex justify-center mb-8">
                <Logo 
                  theme={currentTheme === 'albertHeijn' ? 'albert-heijn' : 'auto'}
                  variant={currentTheme === 'albertHeijn' ? 'blue' : 'auto'}
                  alt={`${theme.name} logo`} 
                  className="h-10 w-auto"
                />
              </div>

              {/* Theme switcher logo above sign in */}
              <div className="flex justify-start mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:opacity-75 transition-opacity">
                      <Logo 
                        theme={currentTheme === 'albertHeijn' ? 'albert-heijn' : 'auto'}
                        variant={currentTheme === 'albertHeijn' ? 'blue' : 'auto'}
                        alt={`${theme.name} logo`} 
                        className="h-8 w-auto"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(themes).map(([key, themeOption]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => setCurrentTheme(key)}
                        className="flex items-center gap-3"
                      >
                        <Logo 
                          theme={key === 'albertHeijn' ? 'albert-heijn' : 'auto'}
                          variant={key === 'albertHeijn' ? 'blue' : 'auto'}
                          alt={`${themeOption.name} logo`} 
                          className="h-5 w-auto"
                        />
                        <span>{themeOption.name}</span>
                        {currentTheme === key && (
                          <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-normal text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-11 bg-white border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-normal text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 bg-white border-gray-300 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                  style={{ backgroundColor: theme.primaryColor }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="space-y-3 text-left">
                <a 
                  href="#" 
                  className="block text-sm text-gray-600 hover:text-gray-900 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Forgot password clicked');
                  }}
                >
                  Forgot your password?
                </a>
                <div className="text-sm text-gray-600">
                  No account?{' '}
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Create account clicked');
                    }}
                  >
                    Create one
                  </a>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Theme configurations
const themes = {
  albertHeijn: {
    name: 'Albert Heijn',
    logo: '/ah-logo.svg',
    backgroundImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop',
    primaryColor: '#00A0E2',
    title: 'Jouw Zelf Service Platform bij Albert Heijn',
    subtitle: 'Retail Media Services',
  },
  retailMedia: {
    name: 'Retail Media Platform',
    logo: '/gambit-logo.svg',
    backgroundImage: '/Gambit_background.svg',
    primaryColor: '#10B981',
    title: 'Welcome to Retail Media Platform',
    subtitle: 'Maximize your retail advertising impact',
  },
};

// Stories
export const AlbertHeijn: Story = {
  render: () => <LoginTemplate themes={themes} initialTheme="albertHeijn" />,
};

export const RetailMediaPlatform: Story = {
  render: () => <LoginTemplate themes={themes} initialTheme="retailMedia" />,
};

