import type { NextApiRequest, NextApiResponse } from 'next';
import { updateQueryRelevant } from '../../server/queries.database';

export type Data = {
  message?: string;
  error?: string;
};

export default async function handlerRelevance(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("Received request body:", req.body); // 添加日志输出请求体

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, relList, irrList } = req.body;

  if (typeof id !== 'number' || !Array.isArray(relList) || !Array.isArray(irrList)) {
    // 添加日志输出无效类型
    console.error("Invalid types for fields:", { id, relList, irrList }); 
    return res.status(400).json({ error: 'Missing required fields or incorrect types' });
  }

  const sortedRel = relList.sort((a, b) => b.appScore - a.appScore);
  const sortedIrr = irrList.sort((a, b) => b.appScore - a.appScore);

  try {
    await updateQueryRelevant("queries", id, sortedRel, sortedIrr);
    return res.status(200).json({ message: 'rerank result updated successfully' });
  } catch (error) {
    // 添加日志输出更新时的错误
    console.error("Error updating query rerank:", error); 
    return res.status(500).json({ error: 'Failed to update relenvat result:' + error });
  }
}