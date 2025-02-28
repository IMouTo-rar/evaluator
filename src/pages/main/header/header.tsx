import styles from "./header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        Evaluator
      </div>
    </div>
  );
}