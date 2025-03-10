export type Item = {
  id: number;
  filename: string;
  appScore: number;
  tag: string;
  domain: string;
  timestamp: string;
  ocr: string;
}

export type Query = {
  id: number;
  query: string;
  keyword: string;
  state: string;
  annotation: string;
  modified: string;
  relevant: Item[];
  irrelevant: Item[];
  rerank: Item[][];
}