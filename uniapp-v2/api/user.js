const http = require('../common/http')

function createUserApi(client) {
  const request = client.request

  return {
    register(username, email, password) {
      const input = typeof username === 'object' ? username : { username, email, password }
      return request('/api/users/create', {
        username: input.username,
        email: input.email,
        password: input.password,
      })
    },
    login(username, password) {
      const credentials = typeof username === 'object' ? username : { username, password }
      return request('/api/users/login', {
        username: credentials.username,
        password: credentials.password,
      })
    },
    getUser() {
      return request('/api/users/getUser', {})
    },
  }
}

const userApi = createUserApi(http)

module.exports = {
  createUserApi,
  ...userApi,
}
