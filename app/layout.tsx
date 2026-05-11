import type { Metadata } from "next";
import "./globals.css";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lima e Lima",
  description: "Revenda Intelbras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Header />

        <main className="main">{children}</main>

        <Footer />

        <Toaster />

        <GoogleAnalytics gaId="G-3CYH2XHY6X" />

 <script
  dangerouslySetInnerHTML={{
    __html: `
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);
          t.async=1;
          t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];
          y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "wph8dmwkjj");
    `,
  }}
/>
        <Script
  id="facebook-pixel"
  strategy="afterInteractive"
  src="https://connect.facebook.net/en_US/fbevents.js"
/>

<Script id="facebook-pixel-init" strategy="afterInteractive">
  {`
    window.fbq = window.fbq || function() {
      (window.fbq.q = window.fbq.q || []).push(arguments);
    };

    window._fbq = window.fbq;

    fbq('init', '751227857320626');
    fbq('track', 'PageView');
  `}
</Script>
      </body>
    </html>
  );
}