import RerankTable from "../rerank/table/rerank-table";
import styles from "./main.module.css";

export default function Main() {
  return (
    <div className={styles.main}>
      <RerankTable />
    </div>
  );
}