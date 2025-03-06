import { useContext, useEffect } from "react";
import { context } from "@/app/layout";
import styles from "./info.module.css";
import classNames from "classnames";
import Image from "next/image";

export default function Info() {
  const { query } = useContext(context);

  const { info, setInfo, item } = useContext(context);

  function getFilePath(filename: string) {
    return `/photos/${filename}`;
  }

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { 
        setInfo(false);
      }
    };
    window.addEventListener('keydown', handleEsc); 

    return () => window.removeEventListener('keydown', handleEsc);
  }, [setInfo]);

  const classes = classNames(
    styles.infoPage,
    {
      [styles.hidden]: !info,
    });

  return (
    <div className={classes}>
      <div className={styles.infoBlock}>
        <button className={styles.close} onClick={() => setInfo(false)}>X</button>
        <div className={styles.media}>
          {(item.domain === "image" || item.domain === "picture") &&
            <Image
              className={styles.image}
              src={getFilePath(item.filename)}
              alt="image"
              sizes="100vw, 100vw"
              priority
              fill
            />}
          {item.domain === "video" &&
            <video
              className={styles.video}
              src={getFilePath(item.filename)}
              controls
            />}
        </div>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>Query</td>
              <td>{query}</td>
            </tr>
            <tr>
              <td>Filename</td>
              <td>{item.filename}</td>
            </tr>
            <tr>
              <td>AppScore</td>
              <td>{item.appScore}</td>
            </tr>
            <tr>
              <td>Domain</td>
              <td>{item.domain}</td>
            </tr>
            <tr>
              <td>Tag</td>
              <td>{item.tag}</td>
            </tr>
            <tr>
              <td>OCR</td>
              <td>{item.ocr}</td>
            </tr>
            <tr>
              <td>Timestamp</td>
              <td>{item.timestamp}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}