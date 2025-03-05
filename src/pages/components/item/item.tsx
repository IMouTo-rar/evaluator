"use client";
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './item.module.css';
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
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';

import Media from '@/pages/components/media/media';
import { Item as ItemType } from '@/pages/components/types/types';

interface ItemProps {
  data: {
    level: number;
    index: number;
    item: ItemType;
  }
}

export default function Item({ data }: ItemProps) {
  const { level, index, item } = data;

  const itemRef = useRef(null);
  const [state, setState] = useState<'idle' | 'dragging' | 'dragOver' | 'prewview'>('idle');
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = itemRef.current;
    invariant(el);

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({
          type: 'item',
          level: level,
          index: index,
        }),
        onDragStart: () => setState('dragging'),
        onGenerateDragPreview: ({ nativeSetDragImage, location, source }) => {
          setCustomNativeDragPreview({
            getOffset: preserveOffsetOnSource({
              element: source.element,
              input: location.current.input,
          }),
            render({ container }) {
              setState('prewview');
              setContainer(container);
              return () => setState('idle');
            },
            nativeSetDragImage,
          })
        },
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
            level: level,
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
          if (args.source.data.level !== level || args.source.data.index !== index) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.level !== level || args.source.data.index !== index) {
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
  }, [level, index, item, state]);

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
      <div className={styles.info}>
        ...
      </div>
      <div className={styles.image}>
        <Media name={item.filename} type={item.domain}/>
      </div>
      {state === 'prewview' && container && ReactDOM.createPortal(
        <div className={classNames(styles.image, styles.preview)}>
          <Media name={item.filename} type={item.domain}/>
        </div>,
        container)}
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </div>

  );
}