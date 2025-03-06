import type { NextApiRequest, NextApiResponse } from 'next';
import { updateQueryRerank } from '../actions/queries.database';

export type Data = {
  message?: string;
  error?: string;
};

export default async function handlerRerank(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("Received request body:", req.body); // 添加日志输出请求体

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, rerankList, state } = req.body;

  if (typeof id !== 'number' || !Array.isArray(rerankList) || typeof state !== 'string') {
    // 添加日志输出无效类型
    console.error("Invalid types for fields:", { id, rerankList, state }); 
    return res.status(400).json({ error: 'Missing required fields or incorrect types' });
  }

  try {
    await updateQueryRerank("queries", id, rerankList, state);
    return res.status(200).json({ message: 'rerank result updated successfully' });
  } catch (error) {
    // 添加日志输出更新时的错误
    console.error("Error updating query rerank:", error);
    return res.status(500).json({ error: 'Failed to update rerank result:' + error });
  }
}