const URL = 'http://localhost:3000/users/create'

const BODY = {
  name: 'Tom',
  email: 'test123@qq.com',
  password: '123456'
}

const concurrency = 100

async function sendRequest(index: number) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(BODY)
    })

    const data = await response.json()

    return {
      index,
      status: response.status,
      data
    }
  } catch (error) {
    return {
      index,
      status: 'ERROR',
      error
    }
  }
}

async function main() {
  const requests = []

  for (let i = 0; i < concurrency; i++) {
    requests.push(sendRequest(i))
  }

  // 关键：同时等待100个请求
  const results = await Promise.all(requests)

  for (const result of results) {
    console.log(result)
  }

  const success = results.filter(r => r.status === 201)
  const conflict = results.filter(r => r.status === 409)
  const serverError = results.filter(r => r.status === 500)

  console.log('========================')
  console.log('总请求:', results.length)
  console.log('创建成功:', success.length)
  console.log('邮箱冲突:', conflict.length)
  console.log('服务器错误:', serverError.length)
}

main()