"use client";
import Link from "next/link";
import styles from "./header.module.css";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { context } from "@/app/layout";

export default function Header() {

  const pathname = usePathname();
  const pathSegments = pathname ? pathname.split('/').filter(Boolean) : "";

  const { query } = useContext(context);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        Evaluator
      </div>
      <div className={styles.links}>
        <Link href="/">/Home</Link>
        {(pathname && pathname !== "/") && <span>/{pathSegments[0]}</span>}
      </div>
      {query && <div className={styles.query}>{query}</div>}
    </header>
  );
}