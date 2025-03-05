"use client";
import Link from "next/link";
import styles from "./header.module.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {

  const pathname = usePathname();
  const pathSegments = pathname ? pathname.split('/').filter(Boolean) : "";

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        Evaluator
      </div>
      <div className={styles.links}>
        <Link href="/">/Home</Link>
        {(pathname && pathname !== "/") && <span>/{pathSegments[0]}</span>}
      </div>
    </header>
  );
}