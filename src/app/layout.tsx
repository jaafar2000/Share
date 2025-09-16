import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { dark } from "@clerk/themes";
import { ImageKitProvider } from "@imagekit/next";

import Left from "./components/Left";
import Right from "./components/Right";
import { ClerkProvider } from "@clerk/nextjs";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Share",
  description: "A simple social media application inspired by X",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/phscexuyw">
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <div className="flex-col flex md:flex-row max-w-[1200px] h-screen mx-auto">
              <Left />
              <div className="flex-1 overflow-x-hidden flex">{children}</div>
              <Right />
            </div>
          </body>
        </html>
      </ImageKitProvider>
    </ClerkProvider>
  );
}
