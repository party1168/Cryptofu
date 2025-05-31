import type { Metadata } from "next";
import localFont from "next/font/local";
import ThemeProvider from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/languageProvider";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/layout/client-layout";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cryptofu - 加密貨幣資產整合管理平台",
  description:
    "Cryptofu - 加密貨幣整合管理平台，使用Cryptofu管理您的加密貨幣資產。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  font-sans antialiased`}
      >
        <div className="flex flex-col min-h-screen bg-gradient-custom relative ">
          <Toaster position="bottom-right" />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <ClientLayout>{children}</ClientLayout>
            </LanguageProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
