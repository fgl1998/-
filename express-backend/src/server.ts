import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`服务器启动成功：http://localhost:${port}`)
})