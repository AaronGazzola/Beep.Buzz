import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthInitializer } from "@/components/AuthInitializer";
import { Toaster } from "@/components/ui/sonner";

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
  title: "Beep.Buzz - Learn Morse Code",
  description:
    "Interactive Morse code learning platform with training, practice, and competitive modes",
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
      <body className="min-h-screen flex flex-col">
        <Providers>
          <AuthInitializer />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
