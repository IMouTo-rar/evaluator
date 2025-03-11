"use client";
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { ToastContainer, Zoom, toast } from 'react-toastify';

import styles from './rerank.module.css';

import Rank from './rank/rank';
import { Item as ItemType } from "@/pages/components/types/types";
import { context } from '@/app/layout';
// import Header from '../header/header';

interface RerankProps {
  id: number;
  query: string;
  rankList: ItemType[][];
}

export default function Rerank({ id, query, rankList }: RerankProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rerankList, setRerankList] = useState(rankList);
  const [stored, setStored] = useState(true);
  const router = useRouter();

  const { setQuery } = useContext(context);

  const storedNotice = () => toast('保存成功');

  const handleSubmit = useCallback((
    notice: boolean = false,
  ) => {
    const data = {
      id: id,
      rerankList: rerankList,
    };
    fetch('/api/submitRerank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setStored(true);
        if (notice) { storedNotice(); }
      })
      .catch(error => console.error('Error:', error));
  }, [id, rerankList]);

  const handleStateChange = useCallback((state: string) => {
    const data = {
      id: id,
      state: state,
    }
    fetch('/api/submitState', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, [id]);

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
    setQuery(query);
    handleStateChange('reranking');
    return () => {
      setQuery("");
      handleSubmit(false);
    };
  }, [id, query, rerankList, setQuery, handleSubmit, handleStateChange]);

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
          const data = [...rerankList];
          const srcRank = source.data.level as number;
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
          const srcRank = source.data.level as number;
          const srcIndex = source.data.index as number;
          const src = data[srcRank][srcIndex];

          const tar = location.current.dropTargets[0];
          const tarRank = tar.data.level as number;
          const tarIndex = tar.data.index as number;

          const closestEdge = extractClosestEdge(tar.data);
          const adjustment = (closestEdge === 'left' ? 1 : 0) - (srcRank === tarRank ? 0 : 1);
          const tarIndexFinal = Math.max(tarIndex - adjustment, 0);

          data[srcRank].splice(srcIndex, 1);
          data[tarRank].splice(tarIndexFinal, 0, src);

          setRerankList(data.filter((item) => item.length > 0));
        }

      },
    });
  }, [rerankList]);

  // 保存
  useEffect(() => {
    setStored(false);
  }, [rerankList]);

  async function handleQuit() {
    handleSubmit();
    router.push(`/#${id}`);
  }

  async function handleSave() {
    handleSubmit(true);
    handleStateChange('reranked');
  }

  async function handleBack() {
    handleSubmit();
    router.push(`/relevance/${id}`);
  }

  function handleDone() {
    handleSubmit();
    handleStateChange('reranked');
    router.push(`/#${id}`);
  }

  return (
    <div className={styles.page}>
      {/* <Header /> */}
      <div className={styles.rerank} ref={ref}>
        {rerankList.map((item, index) => (
          <div key={index}>
            {/* header */}
            {index === 0 && (
              <Rank rank={0} items={[]} isMid={true} section='header' />
            )}

            {/* body */}
            <Rank rank={index} items={item} />
            {index < rerankList.length - 1 && (
              <Rank rank={index + 1} items={[]} isMid={true} />
            )}

            {/* footer */}
            {index === rerankList.length - 1 && (
              <Rank rank={index + 1} items={[]} isMid={true} section='footer' />
            )}
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <button onClick={handleQuit}>退出</button>
        <button onClick={handleSave}>保存</button>
        <button onClick={handleBack}>上一步</button>
        <button onClick={handleDone}>完成</button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </div>
  );
}

