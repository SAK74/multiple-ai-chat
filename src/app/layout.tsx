import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "../components/ui/sonner";
import { auth } from "../auth";
import { SessionProvider } from "next-auth/react";
import { authConfig } from "../auth.config";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "AI-chat",
  description: "Custom AI chatbot",
  icons: {
    icon: "/chat-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute={"class"} enableSystem defaultTheme="system">
          <SessionProvider session={session} basePath={authConfig.basePath}>
            {children}
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
