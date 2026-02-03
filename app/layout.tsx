import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fontPlusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const fontLora = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lora",
});

const fontIbmPlex = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "Beep.Buzz",
  description: "Event management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontPlusJakarta.variable} ${fontLora.variable} ${fontIbmPlex.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
