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
import { Image } from '@/lib/router-context';
import React, { useState, useEffect } from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';

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
  loginLogo?: string; // Specific logo for login page background
  backgroundImage: string;
  primaryColor: string;
  brandAppBg: string; // Brand app background color for icon backgrounds
  title: string;
  subtitle: string;
}

interface LoginTemplateProps {
  themes: Record<string, Theme>;
  initialTheme?: string;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({ themes, initialTheme = 'albertHeijn' }) => {
  const { theme: storybookTheme, setTheme: setStorybookTheme } = useStorybookTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use theme from context, fallback to initialTheme
  const currentTheme = storybookTheme || initialTheme;
  const theme = themes[currentTheme];

  // Handle theme change - update context
  const handleThemeChange = (newTheme: string) => {
    setStorybookTheme(newTheme);
  };

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
        {/* Content */}
        <div className="relative z-10 p-12 text-white">
          <div className="absolute top-80 left-12">
            <div className="mb-8">
              {theme.loginLogo ? (
                <div className={`flex items-start justify-start w-auto ${currentTheme === 'retailMedia' ? 'max-h-[180px]' : 'h-20'}`}>
                  <Image
                    src={theme.loginLogo}
                    alt={`${theme.name} logo`}
                    width={currentTheme === 'retailMedia' ? 450 : 200}
                    height={currentTheme === 'retailMedia' ? 180 : 80}
                    className="object-contain object-left"
                    style={{ maxHeight: currentTheme === 'retailMedia' ? '180px' : '80px', width: 'auto' }}
                    priority
                  />
                </div>
              ) : (
                <Logo
                  theme={
                    currentTheme === 'albertHeijn' ? 'albert-heijn' :
                    currentTheme === 'delhaize' ? 'delhaize' :
                    currentTheme === 'adusa' ? 'adusa' :
                    'auto'
                  }
                  variant="auto"
                  alt={`${theme.name} logo`}
                  className={`w-auto !justify-start ${currentTheme === 'retailMedia' ? 'max-h-[180px]' : 'h-20'}`}
                />
              )}
            </div>
            <h1
              className="text-4xl font-bold mb-4 w-[400px]"
              style={{
                color:
                  currentTheme === 'albertHeijn' ? '#253964' :
                  currentTheme === 'alfaBeta' ? '#FFFFFF' :
                  currentTheme === 'delhaize' ? '#002948' :
                  currentTheme === 'adusa' ? '#00644C' :
                  currentTheme === 'retailMedia' ? '#10351F' :
                  undefined
              }}
            >
              {theme.title.split('\n').map((line, index, array) => (
                <React.Fragment key={index}>
                  {line}
                  {index < array.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
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
                  theme={
                    currentTheme === 'albertHeijn' ? 'albert-heijn' :
                    currentTheme === 'delhaize' ? 'delhaize' :
                    currentTheme === 'adusa' ? 'adusa' :
                    'auto'
                  }
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
                      <div
                        className="flex items-center justify-center rounded-lg w-10 h-10 p-2"
                        style={{ backgroundColor: theme.brandAppBg }}
                      >
                        <Logo
                          theme={
                            currentTheme === 'albertHeijn' ? 'albert-heijn' :
                            currentTheme === 'delhaize' ? 'delhaize' :
                            currentTheme === 'adusa' ? 'adusa' :
                            currentTheme === 'alfaBeta' ? 'alfa-beta' :
                            'auto'
                          }
                          variant={
                            theme.brandAppBg === '#ffffff' ? 'auto' :
                            currentTheme === 'retailMedia' ? 'auto' : // Use original green logo for Gambit
                            'white'
                          }
                          alt={`${theme.name} logo`}
                          className="h-6 w-6"
                        />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(themes).map(([key, themeOption]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => handleThemeChange(key)}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="flex items-center justify-center rounded-lg w-10 h-10 p-2"
                          style={{ backgroundColor: themeOption.brandAppBg }}
                        >
                          <Logo
                            theme={
                              key === 'albertHeijn' ? 'albert-heijn' :
                              key === 'delhaize' ? 'delhaize' :
                              key === 'adusa' ? 'adusa' :
                              key === 'alfaBeta' ? 'alfa-beta' :
                              key === 'retailMedia' ? 'gambit' :
                              'auto'
                            }
                            variant={
                              themeOption.brandAppBg === '#ffffff' ? 'auto' :
                              key === 'retailMedia' ? 'auto' : // Use original green logo for Gambit
                              'white'
                            }
                            alt={`${themeOption.name} logo`}
                            className="h-6 w-6"
                          />
                        </div>
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
    loginLogo: '/ah-login-logo.svg', // Custom login page logo
    backgroundImage: '/ah-background.png',
    primaryColor: '#00A0E2',
    brandAppBg: '#00ADE6', // Brand app background color
    title: 'Jouw Zelf Service Platform bij Albert Heijn',
    subtitle: 'Retail Media Services',
  },
  retailMedia: {
    name: 'Retail Media Platform',
    logo: '/gambit-logo.svg',
    loginLogo: '/gambit-login-logo.svg', // Custom login page logo
    backgroundImage: '/gambit-background.svg',
    primaryColor: '#10B981',
    brandAppBg: '#1E5032', // Special green color for Gambit app icon (exception to standard brand app bg)
    title: 'Your retail media toolbox',
    subtitle: 'Maximize your retail advertising impact',
  },
  delhaize: {
    name: 'Delhaize',
    logo: '/delhaize-logo.svg',
    loginLogo: '/delhaize-login-logo.svg', // Custom login page logo
    backgroundImage: '/delhaize-background.svg',
    primaryColor: '#CE1230',
    brandAppBg: '#CE1230', // Brand app background color
    title: 'Reach your customers where they are!',
    subtitle: 'Retail Media Services',
  },
  adusa: {
    name: 'AD USA',
    logo: '/adusa-logo.svg',
    loginLogo: '/adusa-login-logo.svg', // Custom login page logo
    backgroundImage: '/adusa-background.png',
    primaryColor: '#00644C',
    brandAppBg: '#00644C', // Brand app background color
    title: 'Easy.\nActivation.\nWherever.',
    subtitle: 'Retail Media Services',
  },
  alfaBeta: {
    name: 'Alfa Beta',
    logo: '/alfabeta-logo.svg',
    loginLogo: '/alfabeta-login-logo.svg', // Custom login page logo
    backgroundImage: '/alfabeta-background.png',
    primaryColor: '#0066CC',
    brandAppBg: '#ffffff', // Brand app background color
    title: 'Καλώς ήρθατε στο Alfa Beta Retail Media',
    subtitle: 'Retail Media Services',
  },
};

// Stories
export const AlbertHeijn: Story = {
  parameters: {
    globals: { theme: 'albertHeijn' },
  },
  render: () => <LoginTemplate themes={themes} initialTheme="albertHeijn" />,
};

export const RetailMediaPlatform: Story = {
  parameters: {
    globals: { theme: 'retailMedia' },
  },
  render: () => <LoginTemplate themes={themes} initialTheme="retailMedia" />,
};

export const Delhaize: Story = {
  parameters: {
    globals: { theme: 'delhaize' },
  },
  render: () => <LoginTemplate themes={themes} initialTheme="delhaize" />,
};

export const ADUSA: Story = {
  parameters: {
    globals: { theme: 'adusa' },
  },
  render: () => <LoginTemplate themes={themes} initialTheme="adusa" />,
};

export const AlfaBeta: Story = {
  parameters: {
    globals: { theme: 'alfaBeta' },
  },
  render: () => <LoginTemplate themes={themes} initialTheme="alfaBeta" />,
};

