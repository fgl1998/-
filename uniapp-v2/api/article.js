const http = require('../common/http')

function createArticleApi(client) {
  const request = client.request

  return {
    create(input) {
      return request('/api/articles/create', {
        title: input.title,
        description: input.description,
        body: input.body,
        tags: input.tags,
      })
    },
    list({ page, pageSize } = {}) {
      return request('/api/articles/list', { page, pageSize })
    },
    detail(slug) {
      return request('/api/articles/detail', { slug })
    },
    favorite(articleId) {
      return request('/api/articles/favorite', { articleId })
    },
    unfavorite(articleId) {
      return request('/api/articles/unfavorite', { articleId })
    },
    listComments(articleId) {
      return request('/api/articles/comment/list', { articleId })
    },
    createComment(articleId, body) {
      return request('/api/articles/comment/create', { articleId, body })
    },
    deleteComment(commentId) {
      return request('/api/articles/comment/delete', { commentId })
    },
    deleteArticle(articleId) {
      return request('/api/articles/deleteByArticleId', { articleId })
    },
    getArticleListByUserId(userId) {
      return request('/api/articles/getArticleListByUserId', { userId })
    },
    getFavoriteArticleListByUserId(userId) {
      return request('/api/articles/getFavoriteArticleListByUserId', { userId })
    },
  }
}

const articleApi = createArticleApi(http)

module.exports = {
  createArticleApi,
  ...articleApi,
}
