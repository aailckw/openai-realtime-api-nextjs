import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { TranslationsProvider } from "@/components/translations-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talk with Animal Friends!",
  description: "A fun and friendly way for kids to talk with animated animal friends",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background font-sans antialiased",
          geistSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationsProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <main className="flex flex-1">
                {children}
              </main>
            </div>
            <Toaster />
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
