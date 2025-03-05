import Relevance from '@/pages/relevance/relevance';

import { 
  serverGetQueryById,
  severUpdateQuery
} from '@/pages/api/impl.queries';
import { notFound } from 'next/navigation';
import { Item } from '@/pages/components/types/types';

export default async function RelevancePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const query = await serverGetQueryById(id);
  if (!query) { notFound(); }

  const queryStr = query.query;
  const relList = [query.relevant, query.irrelevant];

  function updateRel(_relevant: Item[], _irrelevant: Item[], _state: string = "") {
    if (!query) { return; }
    query.relevant = _relevant;
    query.irrelevant = _irrelevant;
    query.state = _state === "" ? query.state : _state;
    severUpdateQuery("queries", id, query);
  }

  return (
    <Relevance query={queryStr} relList={relList} onSave={updateRel}/>
  );

}

