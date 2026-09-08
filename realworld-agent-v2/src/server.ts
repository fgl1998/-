import 'dotenv/config'

import { app } from './app.js'
import { loadEnv } from './config/env.js'
import { agentCheckpointer } from './config/agent-checkpointer.js'

const env = loadEnv(process.env)

try {
  await agentCheckpointer.setup()
  console.log('Agent checkpointer setup done.');
} catch (error) {
  throw error
}

const server = app.listen(env.PORT, () => {
  console.log(
    `RealWorld Agent is running at http://localhost:${env.PORT}`,
  )
})

export { server }