import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
// PostHog is disabled for now — will be re-enabled later
// import { PostHogProvider } from '@/contexts/posthog-context';
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
        {/* EpicContext Widget */}
        <Script id="epiccontext-config" strategy="beforeInteractive">
          {`window.epicContext = { token: 'ecw_RWg43dMouUdLBPcpKLbPsPLR11RbG_22' };`}
        </Script>
        <Script
          src="https://epiccontext.com/widget.js"
          strategy="afterInteractive"
        />

        {/* PostHog disabled for now — re-enable by uncommenting below and the import above */}
        {/* <PostHogProvider> */}
          <MenuContextProvider>
            <ThemeProvider>
              <NavigationWrapper>
                <AppLayoutWrapper>
                  {children}
                </AppLayoutWrapper>
              </NavigationWrapper>
            </ThemeProvider>
          </MenuContextProvider>
        {/* </PostHogProvider> */}
      </body>
    </html>
  );
}