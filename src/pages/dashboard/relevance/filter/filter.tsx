"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './filter.module.css';
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import Item from '../../../components/item/item';
import { Item as ItemType } from '../../../components/types/types';
import classNames from 'classnames';

interface Filter {
  items: ItemType[];
  relevant?: boolean;
}

export default function Filter({ items, relevant=false }: Filter) {
  const rankRef = useRef<HTMLDivElement | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = rankRef.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({
        type: 'filter',
        level: relevant ? 0 : 1,
        relevant: relevant,
      }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [relevant]);

  const classes = classNames(
    styles.filter,
    {
      [styles.draggedOver]: isDraggedOver,
      [styles.rel]: relevant,
      [styles.irr]: !relevant,
    }
  );

  return (
    <div
      className={classes}
      ref={rankRef}
    >
      <div className={styles.filterBoard}>
        {items.map((item, index) => (
          <div key={index}>
            <Item key={index} data={{ level: relevant ? 0 : 1, index, item }} />
          </div>
        ))}
      </div>
    </div>
  );
}