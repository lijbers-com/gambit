import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  // The theme decides WHO signs in here: the Edge theme is the retailer's own
  // workspace (retailer roles), while every retailer theme is that retailer's
  // self-service platform, used by advertisers and their media agencies.
  const isEdgeWorkspace = currentTheme === 'retailMedia';
  const signInUsers = users.filter((u) => (isEdgeWorkspace ? u.side === 'retailer' : u.side === 'advertiser'));

  // Storybook theme key → the app's theme value (applied on sign-in).
  const themeValueByKey: Record<string, string> = {
    retailMedia: 'gambit',
    albertHeijn: 'albert-heijn',
    delhaize: 'delhaize',
    adusa: 'adusa',
    alfaBeta: 'alfa-beta',
  };

  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [password, setPassword] = React.useState('demo');
  const selectedUser = signInUsers.find((u) => u.id === selectedUserId);

  const userOptions = signInUsers.map((u) => ({
    label: `${u.name} — ${u.role}`,
    value: u.id,
  }));

  // Clear the picked user when switching theme — the role list changes with it.
  React.useEffect(() => {
    setSelectedUserId('');
  }, [currentTheme]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    login(selectedUser.id, themeValueByKey[currentTheme] ?? 'gambit');
    if (typeof window !== 'undefined') window.location.href = '/home';
  };

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
                  {isEdgeWorkspace
                    ? 'Pick a member of the Edge team — the platform adapts to their role.'
                    : `Pick an advertiser user — this is the ${theme.name} self-service platform.`}
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-normal text-neutral-700">
                    Username
                  </Label>
                  <Input
                    dropdown
                    options={userOptions}
                    value={selectedUserId}
                    onChange={setSelectedUserId}
                    placeholder="Select a user"
                  />
                  {selectedUser && (
                    <p className="text-xs text-muted-foreground">{selectedUser.role}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-normal text-neutral-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="w-full h-11 bg-white border-neutral-300"
                  />
                </div>

                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={!selectedUser}>
                  Sign in
                </Button>
              </form>

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

