import { severGetAllQueries } from "@/pages/api/impl.queries";
import styles from "./page.module.css";
import Main from "@/pages/main/main";

export default async function Home() {

  const queries = await severGetAllQueries("queries");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Main queryList={ queries }/>
      </main>
    </div>
  );
}
