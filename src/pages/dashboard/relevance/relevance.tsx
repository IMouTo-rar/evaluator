"use client";
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import classNames from 'classnames';
import { ToastContainer, Zoom, toast } from 'react-toastify';

import { Item as ItemType } from '@/pages/components/types/types';
import styles from './relevance.module.css';
import Filter from './filter/filter';
import { context } from '@/app/layout';
// import Header from '../header/header';

interface RelevanceProps {
  id: number;
  query: string;
  relList: ItemType[][];
}

export default function Relevance({ id, query, relList }: RelevanceProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [rels, setRels] = useState(relList);
  const [stored, setStored] = useState(true);
  const router = useRouter();

  const { setQuery } = useContext(context);

  const storedNotice = () => toast('保存成功');

  const handleSubmit = useCallback((
    notice: boolean = false,
  ) => {
    const data = {
      id: id,
      relList: rels[0],
      irrList: rels[1],
    };
    fetch('/api/submitRelevance', {
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
  }, [id, rels]);

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
    handleStateChange("verifying");
    return () => {
      setQuery("");
      handleSubmit();
    };
  }, [id, query, rels, setQuery, handleSubmit, handleStateChange]);

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
          const srcLevel = source.data.level as number;
          const srcIndex = source.data.index as number;
          const src = rels[srcLevel][srcIndex];
          const tar = location.current.dropTargets[0];
          const tarLevel = tar.data.level as number;

          const data = [...rels];
          data[srcLevel].splice(srcIndex, 1);
          data[tarLevel].push(src);
          setRels(data);
        }

        // 有具体位置信息
        if (location.current.dropTargets.length === 2) {
          const srcLevel = source.data.level as number;
          const srcIndex = source.data.index as number;
          const src = rels[srcLevel][srcIndex];
          const tar = location.current.dropTargets[0];
          const tarLevel = tar.data.level as number;
          const tarIndex = tar.data.index as number;

          const closestEdge = extractClosestEdge(tar.data);
          const adjustment = (closestEdge === 'left' ? 1 : 0) - (srcLevel === tarLevel ? 0 : 1);
          const tarIndexFinal = Math.max(tarIndex - adjustment, 0);

          const data = [...rels];
          data[srcLevel].splice(srcIndex, 1);
          data[tarLevel].splice(tarIndexFinal, 0, src);
          setRels(data);
        }

      },
    });
  }, [rels]);

  // 保存
  useEffect(() => {
    setStored(false);
  }, [rels]);

  function handleQuit() {
    handleSubmit();
    router.push(`/#${id}`);
  }

  function handleSave() {
    handleSubmit(true);
    handleStateChange("verified");
  }

  function handleNext() {
    handleSubmit();
    handleStateChange("verified");
    router.push(`/rerank/${id}`);
  }

  return (
    <div className={styles.page}>
      {/* <Header /> */}
      <div className={styles.relevance} ref={boardRef}>
        <div className={styles.board}>
          <div className={classNames(styles.boardHeader, styles.rel)}>
            相关
          </div>
          <Filter items={relList[0]} relevant={true} />
        </div>
        <div className={styles.board}>
          <div className={classNames(styles.boardHeader, styles.irr)}>
            不相关
          </div>
          <Filter items={relList[1]} relevant={false} />
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={handleQuit}>退出</button>
        <div className={styles.placeholder}></div>
        <button disabled>上一步</button>
        <button onClick={handleSave}>保存</button>
        <button onClick={handleNext}>下一步</button>
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
