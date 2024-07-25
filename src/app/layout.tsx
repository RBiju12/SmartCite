import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Slider from "./components/Slider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "SmartCite",
  authors: [{name: 'Rishan Biju'}]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Slider />
        {children} 
        </body>
    </html>
  );
}
