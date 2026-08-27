const http = require('../common/http')

function createTagApi(client) {
  const request = client.request

  return {
    list() {
      return request('/api/tags/list', {})
    },
  }
}

const tagApi = createTagApi(http)

module.exports = {
  createTagApi,
  ...tagApi,
}
