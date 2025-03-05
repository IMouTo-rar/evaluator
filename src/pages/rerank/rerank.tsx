"use client";
import { useEffect, useRef, useState } from 'react';

import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import styles from './rerank.module.css';

import Rank from './rank/rank';
import { Item as ItemType } from "@/pages/components/types/types";

interface RerankProps {
  query: string;
  rankList: ItemType[][];
  onSave: (rankList: ItemType[][], state?: string) => void;
}

export default function Rerank({ query, rankList, onSave }: RerankProps) {

  const tableRef = useRef<HTMLDivElement | null>(null);
  const [rerankList, setRerankList] = useState(rankList);
  const [stored, setStored] = useState(true);

  // 监听 beforeunload 事件
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!stored) {
        event.preventDefault(); // 标准的方式
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // 清理事件监听器
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stored]);

  // 进入 / 退出
  useEffect(() => {
    onSave(rerankList, "reranking");
    return () => {
      onSave(rerankList);
    };
  }, [onSave, rerankList]);

  // 拖拽区
  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.type === 'item';
      },
      onDrop(args) {
        const { source, location } = args;

        // 无具体位置信息
        if (location.current.dropTargets.length === 1) {
          const data = [...rerankList];
          const srcRank = source.data.level as number;
          const srcIndex = source.data.index as number;
          const src = data[srcRank][srcIndex];

          const tar = location.current.dropTargets[0];
          const tarRank = tar.data.rank as number;

          data[srcRank].splice(srcIndex, 1);
          if (tar.data.isMid as boolean === true) {
            data.splice(tarRank, 0, [src]);
          }
          else {
            data[tarRank].push(src);
          }
          setRerankList(data.filter((item) => item.length > 0));
        }

        // 具体排序
        if (location.current.dropTargets.length === 2) {
          const data = [...rerankList];
          const srcRank = source.data.level as number;
          const srcIndex = source.data.index as number;
          const src = data[srcRank][srcIndex];

          const tar = location.current.dropTargets[0];
          const tarRank = tar.data.level as number;
          const tarIndex = tar.data.index as number;

          const closestEdge = extractClosestEdge(tar.data);
          const adjustment = (closestEdge === 'left' ? 1 : 0) - (srcRank === tarRank ? 0 : 1);
          const tarIndexFinal = Math.max(tarIndex - adjustment, 0);

          data[srcRank].splice(srcIndex, 1);
          data[tarRank].splice(tarIndexFinal, 0, src);

          setRerankList(data.filter((item) => item.length > 0));
        }

      },
    });
  }, [rerankList]);

  // 保存
  useEffect(() => {
    setStored(false);
  }, [rerankList]);

  function handleSave() {
    setStored(true);
    onSave(rerankList, "reranking");
  }

  function handleDone() {
    setStored(true);
    onSave(rerankList, "reranking");
  }

  return (
    <div className={styles.table} ref={tableRef}>
      <div className={styles.query}>
        {query}
      </div>
      {rerankList.map((item, index) => (
        <div key={index}>
          {/* header */}
          {index === 0 && (
            <Rank rank={0} items={[]} isMid={true} section='header' />
          )}

          {/* body */}
          <Rank rank={index} items={item} />
          {index < rerankList.length - 1 && (
            <Rank rank={index + 1} items={[]} isMid={true} />
          )}

          {/* footer */}
          {index === rerankList.length - 1 && (
            <Rank rank={index + 1} items={[]} isMid={true} section='footer' />
          )}
        </div>
      ))}
      <div className={styles.buttons}>
        <button onClick={handleSave}>暂存</button>
        <button onClick={handleDone}>完成</button>
      </div>
    </div>
  );
}