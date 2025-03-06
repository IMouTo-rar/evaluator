import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Query, Item } from '@/pages/components/types/types';

dotenv.config();
const DB_CONN_STRING = String(process.env.DB_CONN_STRING);
const DB_NAME = String(process.env.DB_NAME);
const COUNTER_COLL = "counters";

let client: MongoClient | null = null;

async function initializeClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(DB_CONN_STRING);
    await client.connect();
  }
  return client;
}

export async function getAllQueries(collection: string) {
  try {
    const client = await initializeClient();
    const _queries = await client.db(DB_NAME)
      .collection(collection)
      .find()
      .toArray();
    return _queries;
  } catch (error) {
    console.error('Error while getting all queries:', error);
    throw error;
  }
}

export async function getQueryById(collection: string, id: number) {
  try {
    const client = await initializeClient();
    const query = { id: id };
    const _query = await client.db(DB_NAME)
      .collection(collection)
      .findOne(query);
    return _query;
  } catch (error) {
    console.error('Error while getting query by id:', error);
    throw error;
  }
}

export async function updateQuery(collection: string, id: number, _query: Query) {
  try {
    const client = await initializeClient();
    const query = { id: id };
    const update = {
      $set: {
        // filename: _query.filename,
        // query: _query.query,
        state: _query.state,
        annotation: _query.annotation,
        modified: _query.modified,
        relevant: _query.relevant,
        irrelevant: _query.irrelevant,
        rerank: _query.rerank
      }
    };
    const result = await client.db(DB_NAME)
      .collection(collection)
      .updateOne(query, update);
    return result.acknowledged;
  } catch (error) {
    console.error('Error while updating query:', error);
    throw error;
  }
}

export async function updateQueryRelevant(
  collection: string,
  id: number,
  rel: Item[],
  irr: Item[],
  state: string
) {
  try {
    const client = await initializeClient();
    const query = { id: id };
    const update = state === ""
      ? {
        $set: {
          relevant: rel,
          irrelevant: irr,
        }
      }
      : {
        $set: {
          relevant: rel,
          irrelevant: irr,
          state: state,
        }
      };
    const result = await client.db(DB_NAME)
      .collection(collection)
      .updateOne(query, update);
    return result.acknowledged;
  } catch (error) {
    console.error('Error while updating query relevant:', error);
    throw error;
  }
}

export async function updateQueryRerank(
  collection: string,
  id: number,
  rerank: Item[][],
  state: string
) {
  try {
    const client = await initializeClient();
    const query = { id: id };
    const update = state === ""
      ? {
        $set: {
          rerank: rerank,
        }
      } : {
        $set: {
          rerank: rerank,
          state: state,
        }
      };
    const result = await client.db(DB_NAME)
      .collection(collection)
      .updateOne(query, update);
    return result.acknowledged;
  } catch (error) {
    console.error('Error while updating query rerank:', error);
    throw error;
  }
}

interface Counters {
  _id: string;
  seq: number;
}

export async function getNextSequenceValue(sequenceName: string) {
  const client = await initializeClient();
  const db = client.db(DB_NAME).collection<Counters>(COUNTER_COLL);
  try {
    const sequenceDocument = await db.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    if (sequenceDocument && sequenceDocument.seq !== undefined) {
      return sequenceDocument.seq;
    } else {
      throw new Error("Failed to get the sequence value.");
    }
  } catch (error) {
    console.error('Error while getting next sequence value:', error);
    throw error;
  }
}