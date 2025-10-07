import type { Metadata } from 'next';
import '@/styles/globals.css';
import { MenuContextProvider } from '@/contexts/menu-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { NavigationWrapper } from './components/navigation-wrapper';
import { AppLayoutWrapper } from './components/app-layout-wrapper';

export const metadata: Metadata = {
  title: 'Gambit - Retail Media Platform',
  description: 'Comprehensive retail media advertising platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MenuContextProvider>
          <ThemeProvider>
            <NavigationWrapper>
              <AppLayoutWrapper>
                {children}
              </AppLayoutWrapper>
            </NavigationWrapper>
          </ThemeProvider>
        </MenuContextProvider>
      </body>
    </html>
  );
}