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
  description:
    "Coinfolio is an open-source website designed for cryptocurrencies investor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#D6EAD6] flex justify-center items-center h-screen`}
      >
          <div className="flex rounded-lg justify-center h-[95%] w-4/5 border-black border-4 ">
            <Navbar></Navbar>
            <main className="flex-grow w-full h-full bg-yellow-100 overflow-auto">
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}
