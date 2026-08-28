const http = require('../common/http')

function createProfileApi(client) {
  const request = client.request

  return {
    followingList(userId) {
      return request('/api/profiles/followingList', { userId })
    },
    followedList(userId) {
      return request('/api/profiles/followedList', { userId })
    },
    get(username) {
      return request('/api/profiles/get', { username })
    },
    follow(followingId) {
      return request('/api/profiles/follow', { followingId })
    },
    unfollow(followingId) {
      return request('/api/profiles/unfollow', { followingId })
    },
  }
}

const profileApi = createProfileApi(http)

module.exports = {
  createProfileApi,
  ...profileApi,
}
