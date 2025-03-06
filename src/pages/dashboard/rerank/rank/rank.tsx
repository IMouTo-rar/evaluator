"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './rank.module.css';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import Item from '@/pages/components/item/item';
import { Item as ItemType } from '@/pages/components/types/types';

interface Rank {
  rank: number;
  items: ItemType[];
  isMid?: boolean;
  section?: "header" | "body" | "footer";
}

export default function Rank({ rank, items, isMid=false, section="body" }: Rank) {
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
      [styles.header]: section === "header",
      [styles.footer]: section === "footer",
    }
  );

  return (
    <div
      className={classes}
      ref={rankRef}
    >
      <div className={styles.rankList}>
        {items.map((item, index) => (
          <div key={index}>
            <Item key={index} data={{ level: rank, index, item }} />
          </div>
        ))}
      </div>
    </div>
  );
}