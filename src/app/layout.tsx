import type { Metadata } from "next";
import { DM_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { MobileWarning } from "@/components/ui/MobileWarning";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "English Learning Platform",
  description: "Personal English learning companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${pressStart2P.variable} antialiased`}
        suppressHydrationWarning
      >
        <MobileWarning />
        {children}
      </body>
    </html>
  );
}
