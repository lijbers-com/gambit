import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
// PostHog is disabled for now — will be re-enabled later
// import { PostHogProvider } from '@/contexts/posthog-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { ToastProvider } from '@/components/ui/toast';
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
    // data-theme is rendered here *and* set by the script below. Rendering it
    // means the common case — the default theme — matches the DOM the script
    // produced, so there is nothing to reconcile. suppressHydrationWarning
    // covers the rest: a stored theme differs, the script has already changed
    // the attribute, and React would otherwise report a mismatch it cannot
    // patch. Intentional, one level deep — the case the flag exists for.
    <html lang="en" data-theme="retailMedia" suppressHydrationWarning>
      <head>
        {/*
          Set the theme before the browser paints.
          ThemeProvider applies data-theme in an effect, which is after the
          first paint — so every load flashed the unthemed default (white)
          and then repainted in the brand colour, side navigation included.
          This runs synchronously in <head>, so the very first frame already
          has the right variables. It mirrors ThemeProvider's name mapping;
          if the two ever diverge the effect corrects it a moment later.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m={'gambit':'retailMedia','albert-heijn':'albertHeijn','adusa':'adusa','delhaize':'delhaize','alfa-beta':'alfaBeta'};var t=localStorage.getItem('gambit-theme');var a=m[t]||'retailMedia';document.documentElement.setAttribute('data-theme',a);}catch(e){document.documentElement.setAttribute('data-theme','retailMedia');}})();`,
          }}
        />
      </head>
      <body>
        {/* EpicContext Widget — beforeInteractive places these in <head> */}
        <Script id="epiccontext-config" strategy="beforeInteractive">
          {`window.epicContext = { "token": "ecw_RWg43dMouUdLBPcpKLbPsPLR11RbG_22" };`}
        </Script>
        <Script
          src="https://epiccontext.com/widget.js"
          strategy="beforeInteractive"
        />

        {/* PostHog disabled for now — re-enable by uncommenting below and the import above */}
        {/* <PostHogProvider> */}
          <MenuContextProvider>
            <ThemeProvider>
              <ToastProvider>
                <NavigationWrapper>
                  <AppLayoutWrapper>
                    {children}
                  </AppLayoutWrapper>
                </NavigationWrapper>
              </ToastProvider>
            </ThemeProvider>
          </MenuContextProvider>
        {/* </PostHogProvider> */}
      </body>
    </html>
  );
}