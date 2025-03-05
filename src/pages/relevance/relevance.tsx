"use client";
import { useEffect, useRef, useState } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import classNames from 'classnames';

import { Item as ItemType } from '@/pages/components/types/types';
import styles from './relevance.module.css';
import Filter from './filter/filter';

interface RelevanceProps {
  query: string;
  relList: ItemType[][];
  onSave: (_relevant: ItemType[], _irrelevant: ItemType[], state?: string) => void;
}

export default function Relevance({ query, relList, onSave }: RelevanceProps) {

  const boardRef = useRef<HTMLDivElement | null>(null);
  const [rels, setRels] = useState(relList);
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
    onSave(rels[0], rels[1], "verifying");
    return () => {
      onSave(rels[0], rels[1]);
    };
  }, [rels, onSave]);

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
          const srcLevel = source.data.level as number;
          const srcIndex = source.data.index as number;
          const src = rels[srcLevel][srcIndex];
          const tar = location.current.dropTargets[0];
          const tarLevel = tar.data.level as number;

          const data = [...rels];
          data[srcLevel].splice(srcIndex, 1);
          data[tarLevel].push(src);
          setRels(data);
        }

        // 有具体位置信息
        if (location.current.dropTargets.length === 2) {
          const srcLevel = source.data.level as number;
          const srcIndex = source.data.index as number;
          const src = rels[srcLevel][srcIndex];
          const tar = location.current.dropTargets[0];
          const tarLevel = tar.data.level as number;
          const tarIndex = tar.data.index as number;

          const closestEdge = extractClosestEdge(tar.data);
          const adjustment = (closestEdge === 'left' ? 1 : 0) - (srcLevel === tarLevel ? 0 : 1);
          const tarIndexFinal = Math.max(tarIndex - adjustment, 0);

          const data = [...rels];
          data[srcLevel].splice(srcIndex, 1);
          data[tarLevel].splice(tarIndexFinal, 0, src);
          setRels(data);
        }

      },
    });
  }, [rels]);

  // 保存
  useEffect(() => {
    setStored(false);
  }, [rels]);

  function handleSave() {
    setStored(true);
    onSave(rels[0], rels[1]);
  }

  function handleDone() {
    setStored(true);
    onSave(rels[0], rels[1], "verified");
  }

  return (
    <div>
      <div className={styles.query}>
        {query}
      </div>
      <div className={styles.relevance} ref={boardRef}>
        <div className={styles.board}>
          <div className={classNames(styles.boardHeader, styles.rel)}>
            相关
          </div>
          <Filter items={relList[0]} relevant={true} />
        </div>
        <div className={styles.board}>
          <div className={classNames(styles.boardHeader, styles.irr)}>
            不相关
          </div>
          <Filter items={relList[1]} relevant={false} />
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={handleSave}>暂存</button>
        <button onClick={handleDone}>完成</button>
      </div>
    </div>
  );
}