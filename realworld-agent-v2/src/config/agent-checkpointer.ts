import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres'

const POSTGRES_URL = process.env.POSTGRES_URL

if (!POSTGRES_URL) {
  throw new Error('POSTGRES_URL is required')
}

export const agentCheckpointer =
  PostgresSaver.fromConnString(POSTGRES_URL)