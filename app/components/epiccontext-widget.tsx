'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

/**
 * The EpicContext feedback widget — everywhere EXCEPT the component preview
 * route. A preview frame shows one component on a bare stage; a floating
 * widget button on top of it reads as part of the component, and the
 * design-system chapter frames dozens of them.
 */
export function EpicContextWidget() {
  const pathname = usePathname();
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
