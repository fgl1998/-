const http = require('../common/http')

function createUserApi(client) {
  const request = client.request

  return {
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
