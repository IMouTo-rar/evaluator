export type Item = {
  id?: number;
  filename: string;
  score?: number;
  tag?: string;
  domain: string;
  timestamp?: string;
}

export type Query = {
  id: number;
    query: string;
    state: string;
    annotation: string;
    modified: string;
    relevant: Item[];
    irrelevant: Item[];
    rerank: Item[][];
}