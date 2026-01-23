"use client";

import type { Metadata } from "next";
import { Poppins, Lora, Fira_Code } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSignOutUser } from "./layout.hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fontPoppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const fontLora = Lora({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-lora",
});

const fontFiraCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { mutate: signOut, isPending } = useSignOutUser();

  return (
    <html lang="en" className={`${fontPoppins.variable} ${fontLora.variable} ${fontFiraCode.variable}`}>
      <body className="min-h-screen flex flex-col">
        <nav className="border-b px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl sm:text-2xl font-bold">
              beep.buzz
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/edit">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                disabled={isPending}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutContent>{children}</RootLayoutContent>
    </QueryClientProvider>
  );
}
