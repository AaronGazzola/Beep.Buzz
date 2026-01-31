import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

const fontLibre_Baskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});

export const metadata: Metadata = {
  title: "Beep.Buzz",
  description: "Learn Morse Code Through Competition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontLibre_Baskerville.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </div>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
