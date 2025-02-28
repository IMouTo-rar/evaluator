import RerankTable from "../rerank/table/rerank-table";
import Header from "./header/header";
import styles from "./main.module.css";

export default function Main() {
  return (
    <div className={styles.main}>
      <Header />
      <RerankTable />
    </div>
  );
}