"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './rerank-rank.module.css';
import invariant from 'tiny-invariant';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  attachClosestEdge,
  extractClosestEdge,
  Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import RerankItem, { Item } from '../item/rerank-item';

interface RerankRankProps {
  rank: number;
  items: Item[];
}

export default function RerankRank({ rank, items }: RerankRankProps) {
  const rankRef = useRef<HTMLDivElement | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = rankRef.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        const data = {
          type: 'rank',
          rank: rank,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['top', 'bottom'],
        });
      },
      onDragEnter: () => {
        setIsDraggedOver(true)
      },
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: (args) => {
        setIsDraggedOver(false);
        extractClosestEdge(args.self.data);
      },
    });
  }, [rank]);

  return (
    <div
      className={`${styles.rank} ${isDraggedOver ? styles.draggedOver : ''}`}
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