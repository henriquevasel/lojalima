import type { Metadata } from "next";
import "./globals.css";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Lima e Lima",
  description: "Revenda Intelbras",
 icons: {
  icon: [
    { url: "/favicon.ico" },
    { url: "/produtos/favicon.png", type: "image/png" },
  ],
}
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

        {/* 🔥 FALTAVA ISSO */}
        <Toaster />
      </body>
    </html>
  );
}