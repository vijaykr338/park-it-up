// lib/GoogleAnalytics.tsx
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-VDVDMXCR6R";

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load the GA library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />

      {/* Initialise GA – runs after the library is loaded */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            // optional: enable page‑view tracking on route changes
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}