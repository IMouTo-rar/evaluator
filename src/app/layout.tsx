"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import "./globals.css";
import Header from "@/pages/dashboard/header/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface HeaderContextType {
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export const HeaderContext = createContext<HeaderContextType>({
  page: "",
  setPage: () => {},
  query: "",
  setQuery: () => {},
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [page, setPage] = useState("");
  const [query, setQuery] = useState("");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <HeaderContext.Provider value={{ page, setPage, query, setQuery}} >
          <Header />
          {children}
        </HeaderContext.Provider>
      </body>
    </html>
  );
}