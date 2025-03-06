import { 
    getAllQueries, 
    getQueryById,
    updateQuery,
    updateQueryRelevant,
    updateQueryRerank,
} from "./queries.database";
import { Item, Query } from "@/pages/components/types/types";

export async function severGetAllQueries() {
  const queries = await getAllQueries("queries");
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

export async function severUpdateQuery(id: number, _query: Query) {
    return await updateQuery("queries", id, _query);
}

export async function severUpdateRelevant(id: number, rel: Item[], irr: Item[], state: string) {
    return await updateQueryRelevant("queries", id, rel, irr, state);
}

export async function severUpdateRerank(id: number, rerank: Item[][], state: string) {
    return await updateQueryRerank("queries", id, rerank, state);
}
