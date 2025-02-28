"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './rerank-rank.module.css';
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import RerankItem, { Item } from '../item/rerank-item';
import classNames from 'classnames';

interface RerankRankProps {
  rank: number;
  items: Item[];
  isMid?: boolean;
}

export default function RerankRank({ rank, items, isMid=false }: RerankRankProps) {
  const rankRef = useRef<HTMLDivElement | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = rankRef.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({
        type: 'rank',
        rank: rank,
        isMid: isMid
      }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [rank, isMid]);

  const classes = classNames(
    styles.rank,
    {
      [styles.draggedOver]: isDraggedOver,
      [styles.mid]: isMid,
    }
  );

  return (
    <div
      className={classes}
      ref={rankRef}
    >
      <div className={styles.rankList}>
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            <RerankItem key={index} data={{ rank, index, item }} />
          </div>
        ))}
      </div>
    </div>
  );
}