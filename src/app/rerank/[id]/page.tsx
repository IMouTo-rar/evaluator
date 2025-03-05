import Rerank from "@/pages/rerank/rerank";

import { 
  serverGetQueryById,
  severUpdateQuery
} from "@/pages/api/impl.queries";
import { notFound } from "next/navigation";
import { Item } from "@/pages/components/types/types";

export default async function RerankPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  
  const id = (await params).id;
  const query = await serverGetQueryById(id);

  if (!query) {
    notFound();
  }

  function updateRerank(_rerank: Item[][], _state: string = "") {
      if (!query) { return; }
      query.rerank = _rerank;
      query.state = _state === "" ? query.state : _state;
      severUpdateQuery("queries", id, query);
    }

  const rankList = createRankList(query.relevant, 5);
  const queryStr = query.query;

  return (
    <Rerank query={queryStr} rankList={rankList} onSave={updateRerank}/>
  );
}

function createRankList<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}