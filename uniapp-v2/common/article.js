function pick(source, keys, fallback) {
  const input = source || {}
  for (const key of keys) {
    if (input[key] !== undefined) {
      return input[key]
    }
  }
  return fallback
}

function normalizeAuthor(source) {
  const nestedAuthor = source && typeof source.author === 'object' && source.author ? source.author : {}

  return {
    id: pick(nestedAuthor, ['id', 'userId', 'user_id', 'author_id'], pick(source, ['authorId', 'author_id'], null)),
    username: pick(nestedAuthor, ['username'], pick(source, ['authorUsername', 'author_username'], '')),
    bio: pick(nestedAuthor, ['bio'], pick(source, ['authorBio', 'author_bio'], '')),
    image: pick(nestedAuthor, ['image'], pick(source, ['authorImage', 'author_image'], '')),
  }
}

function normalizeTags(value) {
  const tags = Array.isArray(value) ? value : [value]

  return tags
    .map((tag) => {
      if (typeof tag === 'string') {
        return tag
      }
      if (tag && typeof tag === 'object') {
        return pick(tag, ['tag_name', 'tagName', 'name'], '')
      }
      return tag === undefined || tag === null ? '' : String(tag)
    })
    .filter((tag) => typeof tag === 'string' && tag.length > 0)
}

function toBoolean(value) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }
  return Boolean(value)
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function normalizeArticle(article) {
  const source = article || {}

  return {
    id: pick(source, ['id', 'articleId', 'article_id'], null),
    slug: pick(source, ['slug'], ''),
    title: pick(source, ['title'], ''),
    description: pick(source, ['description'], ''),
    body: pick(source, ['body'], ''),
    author: normalizeAuthor(source),
    tags: normalizeTags(pick(source, ['tags', 'tagList', 'tag_list'], [])),
    favorited: toBoolean(pick(source, ['favorited'], false)),
    favoritesCount: toNumber(pick(source, ['favoritesCount', 'favorites_count'], 0)),
    createdAt: pick(source, ['createdAt', 'created_at'], ''),
    updatedAt: pick(source, ['updatedAt', 'updated_at'], ''),
  }
}

function normalizeComment(comment) {
  const source = comment || {}

  return {
    id: pick(source, ['id', 'commentId', 'comment_id'], null),
    articleId: pick(source, ['articleId', 'article_id'], null),
    body: pick(source, ['body'], ''),
    author: normalizeAuthor(source),
    createdAt: pick(source, ['createdAt', 'created_at'], ''),
    updatedAt: pick(source, ['updatedAt', 'updated_at'], ''),
  }
}

module.exports = {
  normalizeArticle,
  normalizeComment,
}
