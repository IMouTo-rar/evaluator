import RerankTable from "@/pages/rerank/table/rerank-table";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <RerankTable />
      </main>
    </div>
  );
}
