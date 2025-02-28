"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './rerank-table.module.css';
import invariant from 'tiny-invariant';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import RerankRank from '../rank/rerank-rank';

export default function RerankTable() {

  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const [rerankList, setRerankList] = useState([
    [
      { file_name: "file1", query: "query1", score: 0.1 },
      { file_name: "file2", query: "query2", score: 0.2 },
      { file_name: "file3", query: "query3", score: 0.3 },
    ],
    [
      { file_name: "file4", query: "query4", score: 0.4 },
      { file_name: "file5", query: "query5", score: 0.5 },
    ]
  ]);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) {
      throw new Error('ref not set correctly');
    }

    return dropTargetForElements({
      element: el,
      getData: () => ({
        type: 'table',
      }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop(args) {
        const { source, location } = args;
        
        

      },
    });
  }, []);

  const [instanceId] = useState(() => Symbol('instance-id'));

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },

      })
    );
  }, [rerankList, instanceId]);

  return (
    <div className={styles.table} ref={tableRef}>
      {rerankList.map((items, index) => (
        <RerankRank key={index} rank={index + 1} items={items} />
      ))}
    </div>
  );
}
