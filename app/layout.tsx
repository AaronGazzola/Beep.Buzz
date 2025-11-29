import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beep.Buzz - Interactive Live Streaming Platform",
  description:
    "Create engaging, customizable pages that let your audience participate in polls, contribute to goals, make donations, and join interactive mini-games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                Beep.Buzz
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
