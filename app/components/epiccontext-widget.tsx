'use client';

import * as React from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

/**
 * The EpicContext feedback widget — only when the app is the top-level page.
 *
 * Not on the component preview route, and not when the app runs inside ANY
 * iframe: the EpicContext book frames whole pages as live previews, and there
 * the floating button reads as part of the page being documented — while the
 * widget's call home fails inside the sandboxed frame and spills
 * "Failed to fetch" errors into the console. Framing is detected after mount
 * (window.top is a client fact), so the scripts simply load one tick later on
 * the real site.
 */
export function EpicContextWidget() {
  const pathname = usePathname();
  const [topLevel, setTopLevel] = React.useState(false);
  React.useEffect(() => {
    try {
      setTopLevel(window.self === window.top);
    } catch {
      // Cross-origin access throwing means we ARE framed.
      setTopLevel(false);
    }
  }, []);

  if (!topLevel) return null;
  if (pathname?.startsWith('/ec-preview') || pathname?.startsWith('/__ec')) return null;
  return (
    <>
      <Script id="epiccontext-config" strategy="afterInteractive">
        {`window.epicContext = { "token": "ecw_RWg43dMouUdLBPcpKLbPsPLR11RbG_22" };`}
      </Script>
      <Script src="https://epiccontext.com/widget.js" strategy="afterInteractive" />
    </>
  );
}
