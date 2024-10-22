import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "./components/navbar";
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
  title: "Coinfolio",
  description: "Coinfolio is an open-source website designed for cryptocurrencies investor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex antialiased`}
      >
        <Navbar></Navbar>
        <main className="w-full h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
