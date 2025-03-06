"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import "./globals.css";
import styles from "./layout.module.css";
import Header from "@/pages/dashboard/header/header";
import { Item } from "@/pages/components/types/types";
import Info from "@/pages/dashboard/info/info";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface ContextType {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;

  info: boolean;
  setInfo: Dispatch<SetStateAction<boolean>>;

  item: Item;
  setItem: Dispatch<SetStateAction<Item>>;
}

export const context = createContext<ContextType>({
  query: "",
  setQuery: () => { },

  info: false,
  setInfo: () => { },

  item: {
    id: 0,
    filename: "",
    appScore: 0.0,
    domain: "",
    tag: "",
    ocr: "",
    timestamp: "",
  },
  setItem: () => { },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState(false);
  const [item, setItem] = useState<Item>({
    id: 0,
    filename: "",
    appScore: 0.0,
    domain: "",
    tag: "",
    ocr: "",
    timestamp: "",
  });

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <context.Provider
          value={{
            query,
            setQuery,
            info,
            setInfo,
            item,
            setItem,
          }}
        >
          <Header />
          <Info />
          <div className={styles.pageArea}>
            {children}
          </div>
        </context.Provider>
      </body>
    </html>
  );
}