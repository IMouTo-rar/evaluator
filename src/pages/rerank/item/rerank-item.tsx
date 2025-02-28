"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './rerank-item.module.css';
import invariant from 'tiny-invariant';
import classNames from 'classnames';

import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

export type Item = {
  id?: string;
  file_name: string;
  query: string;
  score?: number;
  timestamp?: string;
  tag?: string;
}

interface RerankItemProps {
  data: {
    rank: number;
    index: number;
    item: Item;
  }
}

export default function RerankItem({ data }: RerankItemProps) {
  const { rank, index, item } = data;

  const itemRef = useRef(null);
  const [state, setState] = useState<'idle' | 'dragging' | 'dragOver'>('idle');
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = itemRef.current;
    invariant(el);

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({
          type: 'item',
          rank: rank,
          index: index,
        }),
        onDragStart: () => setState('dragging'),
        onDrop: () => setState('idle'),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => {
          return source.data.type === 'item' && state !== 'dragging';
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            type: 'item',
            rank: rank,
            index: index,
            item: item,
          };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          });
        },
        onDragEnter: (args) => {
          setState('dragOver');
          if (args.source.data.rank !== rank || args.source.data.index !== index) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.rank !== rank || args.source.data.index !== index) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          if (state === 'dragOver') {
            setState('idle');
          }
          setClosestEdge(null);
        },
        onDrop: () => {
          setState('idle');
          setClosestEdge(null);
        },
      }),
    );
  }, [rank, index, item, state]);

  const classes = classNames(
    styles.item,
    {
      [styles.dragging]: state === 'dragging',
      [styles.dragOver]: state === 'dragOver',
    }
  )

  return (
    <div
      className={classes}
      ref={itemRef}
    >
      <div className={styles.image}>
        {item.file_name}<br />
        {item.score}
        
      </div>
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </div>

  );
}