import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import { cookies } from 'next/headers'

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export function getUsername(): any
{
  if (cookies().get('username'))
  {
     clearInterval(timer)
     return cookies().get('username')
  }
   
}

let timer = setInterval(getUsername, 5000)


export const metadata: Metadata = {
  title: "SmartCite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {getUsername() ? <Navbar username={getUsername()}/> : <Navbar username={null} />}
        {children}
        </body>
    </html>
  );
}
