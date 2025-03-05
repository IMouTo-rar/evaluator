import { 
    getAllQueries, 
    getQueryById,
    updateQuery, 
} from "./mongodbService";
import { Query } from "@/pages/components/types/types";

export async function severGetAllQueries(collection: string) {
  const queries = await getAllQueries(collection);
  return queries.map(doc => ({
    id: doc.id,
    query: doc.query,
    state: doc.state,
    annotation: doc.annotation,
    modified: doc.modified,
    relevant: doc.relevant,
    irrelevant: doc.irrelevant,
    rerank: doc.rerank,
  } as Query));
}

export async function serverGetQueryById(id: number) {
    const query = await getQueryById("queries", id);
    return query ? {
        id: query.id,
        query: query.query,
        state: query.state,
        annotation: query.annotation,
        modified: query.modified,
        relevant: query.relevant,
        irrelevant: query.irrelevant,
        rerank: query.rerank,
    } as Query : null;
}

export async function severUpdateQuery(collection: string, id: number, _query: Query) {
    return await updateQuery(collection, id, _query);
}