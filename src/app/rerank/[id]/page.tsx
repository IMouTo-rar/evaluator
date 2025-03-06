import Rerank from "@/pages/dashboard/rerank/rerank";

import {
  serverGetQueryById,
} from "@/server/queries.impl";
import { notFound } from "next/navigation";

export default async function RerankPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id, 10);
  const query = await serverGetQueryById(id);

  if (!query) {
    notFound();
  }

  const rankList = Array.isArray(query.rerank) && query.rerank.length > 0
    ? query.rerank
    : createRankList(query.relevant.slice(0, 20), 5);
  const queryStr = query.query;

  return (
    <Rerank id={id} query={queryStr} rankList={rankList}/>
  );
}

function createRankList<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
