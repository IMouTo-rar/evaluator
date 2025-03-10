import Rerank from "@/pages/dashboard/rerank/rerank";

import {
  serverGetQueryById,
} from "@/server/queries.impl";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Rerank",
  description: "evaluate relevance and rank",
};

export default async function RerankPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id, 10);
  const query = await serverGetQueryById(id);
  if (!query) { notFound(); }

  // 返回前 15 个和倒数 5 个
  const sorted = query.relevant.sort((a, b) => b.appScore - a.appScore);
  const items = sorted.length > 20
    ? [...sorted.slice(0, 15), ...sorted.slice(-5)]
    : sorted

  const rankList = query.rerank?.length > 0 && query.state !== "verified"
    ? query.rerank
    : createRankList(items, 5);
  const queryStr = query.query;

  return (
    <Rerank id={id} query={queryStr} rankList={rankList} />
  );
}

function createRankList<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
