import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUsers, login, resetDb, type DbUser } from '@/lib/db';
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
import React from 'react';
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
  const users = useUsers();

  // Use theme from context, fallback to initialTheme
  const currentTheme = storybookTheme || initialTheme;
  const theme = themes[currentTheme];

  // Handle theme change - update context
  const handleThemeChange = (newTheme: string) => {
    setStorybookTheme(newTheme);
  };

  // Selecting a user logs in and applies their role's branding: retailer-side
  // users get the Edge chrome; advertiser users get the retailer's branding.
  const handleSelectUser = (user: DbUser) => {
    login(user.id);
    if (typeof window !== 'undefined') window.location.href = '/home';
  };

  const retailerUsers = users.filter((u) => u.side === 'retailer');
  const advertiserUsers = users.filter((u) => u.side === 'advertiser');

  const initials = (name: string) =>
    name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const UserRow = ({ user }: { user: DbUser }) => (
    <button
      type="button"
      onClick={() => handleSelectUser(user)}
      className="flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
        {initials(user.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{user.role}</span>
      </span>
      <Badge variant={user.side === 'retailer' ? 'secondary' : 'outline'} className="shrink-0">
        {user.side === 'retailer' ? 'Edge' : 'Advertiser'}
      </Badge>
    </button>
  );

  return (
    <div className="flex h-screen">
      {/* Left side - Theme specific image */}
      {currentTheme === 'retailMedia' ? (
        <div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
          style={{
            backgroundImage: 'url(/edge-login.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'top left',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ) : (
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
                  <div className="flex items-start justify-start w-auto h-20">
                    <Image
                      src={theme.loginLogo}
                      alt={`${theme.name} logo`}
                      width={200}
                      height={80}
                      className="object-contain object-left"
                      style={{ maxHeight: '80px', width: 'auto' }}
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
                    className="w-auto h-20 !justify-start"
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
      )}

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-50 relative">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Sign in</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Choose a user — the platform adapts to their role and branding.
                </p>
              </div>

              <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Retailer team
                  </div>
                  {retailerUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Advertisers
                  </div>
                  {advertiserUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </div>
              </div>

              <div className="text-left">
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-neutral-600 underline hover:text-neutral-900"
                  onClick={() => {
                    resetDb();
                    alert('Demo data has been reset to the seed.');
                  }}
                >
                  Reset demo data
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Powered by edge.os badge — triggers theme switcher */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-0.5 pl-3 pr-2 py-1.5 rounded-full border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 hover:shadow-md transition-all duration-200">
                <span className="text-xs font-medium text-neutral-500">powered by</span>
                <Image
                  src="/edgeos-icon.svg"
                  alt="edge.os"
                  width={60}
                  height={16}
                  className="h-4 w-auto"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="w-56 mb-1">
              <DropdownMenuLabel>Switch theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(themes).map(([key, themeOption]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className="flex items-center gap-3"
                >
                  <div
                    className="flex items-center justify-center rounded-lg w-8 h-8 p-1 flex-shrink-0"
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
                        key === 'retailMedia' ? 'auto' :
                        'white'
                      }
                      alt={`${themeOption.name} logo`}
                      className="h-full w-full"
                    />
                  </div>
                  <span className="text-sm">{themeOption.name}</span>
                  {currentTheme === key && (
                    <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
    name: 'Edge',
    logo: '/edge-icon.svg',
    loginLogo: '/edge-login.svg', // Custom login page logo
    backgroundImage: '/gambit-background.svg',
    primaryColor: '#10B981',
    brandAppBg: '#c8f000', // Edge brand badge background color
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

