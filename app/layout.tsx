import type { Metadata } from "next";
import { Dm_Sans, Space_Mono } from 'next/font/google'
import "./globals.css";

const fontDm_Sans = Dm_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const fontSpace_Mono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: '400',
})

export const metadata: Metadata = {
  title: "Beep.Buzz",
  description: "Your Next.js app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDm_Sans.variable} ${fontSpace_Mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
