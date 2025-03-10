import styles from './highlight.module.css';

interface HighlightProps {
  text: string,
  wordList: string[]
}

export default function Highlight({ text, wordList }: HighlightProps) {
  if (!wordList.length) return <span className={styles.query}>{text}</span>;

  // 构造匹配词表的正则表达式，\b 确保是完整单词
  const regex = new RegExp(`(${wordList.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <span className={styles.query}>
      {parts.map((part, index) =>
        wordList.some(word => word.toLowerCase() === part.toLowerCase()) ? (
          <span key={index} className={styles.highlight}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}