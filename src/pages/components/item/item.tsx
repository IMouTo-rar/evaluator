"use client";
import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { context } from '@/app/layout';

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { setInfo, setItem } = useContext(context);

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

  function showInfo() {
    setItem(item);
    setInfo(true);
  }

  function handleMouseEnter() { 
    timeoutRef.current = setTimeout(() => {
      setItem(item);
      setInfo(true);
    }, 500); // 悬浮 1 秒后触发
  }

  function handleMouseLeave() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

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
      <div
        className={styles.info}
        onClick={showInfo}
      >
        ...
      </div>
      <div
        className={styles.image}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Media name={item.filename} type={item.domain} />
      </div>
      {state === 'prewview' && container && ReactDOM.createPortal(
        <div className={classNames(styles.image, styles.preview)}>
          <Media name={item.filename} type={item.domain} />
        </div>,
        container)}
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </div>

  );
}