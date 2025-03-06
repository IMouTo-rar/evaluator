import { severGetAllQueries } from "@/server/queries.impl";
import type { Metadata } from "next";
import styles from "./page.module.css";
import Main from "@/pages/dashboard/main/main";

export const metadata: Metadata = {
  title: "Evaluator",
  description: "evaluate relevance and rank",
};

export default async function Home() {

  const queries = await severGetAllQueries();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Main queryList={ queries }/>
      </main>
    </div>
  );
}
