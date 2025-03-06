import Relevance from '@/pages/dashboard/relevance/relevance';
import {
  serverGetQueryById,
} from '@/server/queries.impl';
import { notFound } from 'next/navigation';

export default async function RelevancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id, 10);
  const query = await serverGetQueryById(id);
  if (!query) { notFound(); }

  const queryStr = query.query;
  const relList = [query.relevant, query.irrelevant];

  return (
    <Relevance id={id} query={queryStr} relList={relList} />
  );
}