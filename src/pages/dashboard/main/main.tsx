"use client";
import classNames from 'classnames';
import Link from "next/link";
import { Query } from '@/pages/components/types/types';
import styles from "./main.module.css";
import { useEffect, useState } from 'react';
// import Header from '../header/header';

interface MainProps {
  queryList: Query[];
}

export default function Main({ queryList }: MainProps) {
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    setHash(window.location.hash.slice(1));
  }, []);

  const lineClasses = (index: number, state: string, id?: number) => {
    return classNames(
      styles.queryLine,
      {
        [styles.queryOdd]: index % 2 === 0,
        [styles.queryEven]: index % 2 === 1,
        [styles.highlight]: id && id === parseInt(hash),
        [styles.unprocessed]: state === "unprocessed",
        [styles.verifying]: state === "verifying",
        [styles.verified]: state === "verified",
        [styles.reranking]: state === "reranking",
        [styles.reranked]: state === "reranked",
      })
  };

  return (
    <div className={styles.page}>
      {/* <Header /> */}
      <div className={styles.main}>
        <div className={styles.queryList}>
          {queryList.map((query, index) => (
            <div
              id={query.id.toString()}
              key={index}
              className={lineClasses(index, query.state, query.id)}
            >
              <div className={styles.serial}>
                {index + 1}
              </div>
              <div className={styles.title}>
                {query.query}
              </div>
              <div className={styles.state}>
                {query.state === "unprocessed" && "未处理"}
                {query.state === "verifying" && "验证中"}
                {query.state === "verified" && "已验证"}
                {query.state === "reranking" && "排序中"}
                {query.state === "reranked" && "已完成"}
              </div>
              <div className={styles.rel}>
                <Link href={`/relevance/${query.id}`}>相关性验证</Link>
              </div>
              <div className={styles.irr}>
                <Link href={`/rerank/${query.id}`}>重排序</Link>
              </div>
              <div className={styles.autoHref}>

              </div>
            </div>
          ))}
        </div>
      </div >
    </div>
  );
}