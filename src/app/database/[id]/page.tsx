import { 
  serverGetQueryById,
} from '@/pages/actions/queries.impl';

export default async function DataPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const query = id == 2 ? await serverGetQueryById(id) : "error";
  
  return (
    <div>
      { query === "error" ? "error" : query?.query }
      {id}
    </div>
  );

}

