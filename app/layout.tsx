import type { Metadata } from 'next';
import '@/styles/globals.css';
import { MenuContextProvider } from '@/contexts/menu-context';
import { ThemeProvider } from '@/contexts/theme-context';

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
            {children}
          </ThemeProvider>
        </MenuContextProvider>
      </body>
    </html>
  );
}