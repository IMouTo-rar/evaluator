"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './rerank-table.module.css';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import RerankRank from '../rank/rerank-rank';

export default function RerankTable() {

  const tableRef = useRef<HTMLDivElement | null>(null);

  const [rerankList, setRerankList] = useState([
    [
      { file_name: "file1", query: "query1", score: 0.1 },
      { file_name: "file2", query: "query2", score: 0.2 },
      { file_name: "file3", query: "query3", score: 0.3 },
    ],
    [
      { file_name: "file4", query: "query4", score: 0.4 },
      { file_name: "file5", query: "query5", score: 0.5 },
    ],
    [
      { file_name: "file6", query: "query1", score: 0.1 },
      { file_name: "file7", query: "query2", score: 0.2 },
      { file_name: "file8", query: "query3", score: 0.3 },
    ],
    [
      { file_name: "file9", query: "query1", score: 0.1 },
      { file_name: "file10", query: "query2", score: 0.2 },
      { file_name: "file11", query: "query3", score: 0.3 },
    ],
    [
      { file_name: "file12", query: "query1", score: 0.1 },
      { file_name: "file13", query: "query2", score: 0.2 },
      { file_name: "file14", query: "query3", score: 0.3 },
    ]
  ]);

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
          const srcRank = source.data.rank as number;
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
          const srcRank = source.data.rank as number;
          const srcIndex = source.data.index as number;
          const src = data[srcRank][srcIndex];

          const tar = location.current.dropTargets[0];
          const tarRank = tar.data.rank as number;
          const tarIndex = tar.data.index as number;

          console.log(tarIndex);

          const closestEdge = extractClosestEdge(tar.data);
          const adjustment = (closestEdge === 'left' ? 1 : 0) - (srcRank === tarRank ? 0 : 1);
          const tarIndexFinal = Math.max(tarIndex - adjustment, 0);

          data[srcRank].splice(srcIndex, 1);
          data[tarRank].splice(tarIndexFinal, 0, src);

          console.log(tarIndexFinal);

          setRerankList(data.filter((item) => item.length > 0));
        }

      },
    });
  }, [rerankList]);

  return (
    <div className={styles.table} ref={tableRef}>
      {rerankList.map((item, index) => (
        <div key={index}>
          {/* header */}
          {index === 0 && (
            <RerankRank rank={0} items={[]} isMid={true} section='header'/>
          )}

          {/* body */}
          <RerankRank rank={index} items={item} />
          {index < rerankList.length - 1 && (
            <RerankRank rank={index + 1} items={[]} isMid={true} />
          )}
          
          {/* footer */}
          {index === rerankList.length - 1 && (
            <RerankRank rank={index + 1} items={[]} isMid={true} section='footer'/>
          )}
        </div>
      ))}
    </div>
  );
}