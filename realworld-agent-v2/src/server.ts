import 'dotenv/config'

import { app } from './app.js'
import { loadEnv } from './config/env.js'

const env = loadEnv(process.env)

const server = app.listen(env.PORT, () => {
  console.log(
    `RealWorld Agent is running at http://localhost:${env.PORT}`,
  )
})

export { server }