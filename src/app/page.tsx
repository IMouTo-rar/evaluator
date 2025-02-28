import styles from "./page.module.css";
import Main from "@/pages/main/main";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Main />
      </main>
    </div>
  );
}
