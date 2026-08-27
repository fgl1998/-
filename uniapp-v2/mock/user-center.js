const followingUsers = [
  { id: 2, username: 'alice', bio: '专注 Node.js 与服务端工程。', image: '', following: true },
  { id: 3, username: 'bob', bio: '喜欢 Vue、uni-app 和产品设计。', image: '', following: true },
  { id: 4, username: 'carol', bio: '记录测试、重构与团队协作。', image: '', following: true },
]

const followerUsers = [
  { id: 5, username: 'dave', bio: '全栈开发者，正在学习 TypeScript。', image: '', following: false },
  { id: 6, username: 'emma', bio: '关注前端体验与小程序开发。', image: '', following: true },
]

const currentAuthor = {
  id: 1,
  username: 'me',
  bio: '这是我的演示主页。',
  image: '',
  following: false,
}

const myArticles = [
  {
    id: 101,
    slug: 'my-express-notes',
    title: 'Express 接口开发笔记',
    description: '从路由、校验到统一响应结构的实践记录。',
    body: '',
    author: currentAuthor,
    tags: ['Node.js', 'Express'],
    favorited: false,
    favoritesCount: 12,
    createdAt: '2026-08-25T08:00:00.000Z',
  },
  {
    id: 102,
    slug: 'my-uniapp-notes',
    title: 'uni-app 小程序页面搭建',
    description: '登录态、分页和详情页面的实现思路。',
    body: '',
    author: currentAuthor,
    tags: ['uni-app', 'Vue'],
    favorited: true,
    favoritesCount: 8,
    createdAt: '2026-08-23T08:00:00.000Z',
  },
  {
    id: 103,
    slug: 'my-interview-review',
    title: '项目面试复盘清单',
    description: '如何介绍项目结构、接口设计和错误处理。',
    body: '',
    author: currentAuthor,
    tags: ['面试', '工程化'],
    favorited: false,
    favoritesCount: 5,
    createdAt: '2026-08-20T08:00:00.000Z',
  },
]

const favoriteArticles = [
  {
    id: 201,
    slug: 'alice-node-practice',
    title: 'Node.js 服务稳定性实践',
    description: '从异常处理到日志追踪的完整思路。',
    body: '',
    author: followingUsers[0],
    tags: ['Node.js'],
    favorited: true,
    favoritesCount: 32,
    createdAt: '2026-08-24T08:00:00.000Z',
  },
  {
    id: 202,
    slug: 'bob-vue-state',
    title: 'Vue 页面状态管理避坑',
    description: '慢请求、重复提交和页面返回时的状态处理。',
    body: '',
    author: followingUsers[1],
    tags: ['Vue'],
    favorited: true,
    favoritesCount: 27,
    createdAt: '2026-08-22T08:00:00.000Z',
  },
  {
    id: 203,
    slug: 'emma-mini-program',
    title: '小程序交互体验细节',
    description: '列表、空状态和错误提示的设计建议。',
    body: '',
    author: followerUsers[1],
    tags: ['小程序', '体验'],
    favorited: true,
    favoritesCount: 19,
    createdAt: '2026-08-18T08:00:00.000Z',
  },
]

const currentUserStats = {
  followingCount: followingUsers.length,
  followersCount: followerUsers.length,
  articlesCount: myArticles.length,
  favoritesCount: favoriteArticles.length,
}

function getMockProfile(username) {
  const profiles = [currentAuthor, ...followingUsers, ...followerUsers]
  const found = profiles.find((profile) => profile.username === username)
  if (found) return { ...found }
  return {
    id: 0,
    username: username || 'unknown',
    bio: '这是一个用于页面联调的作者主页，接口接入后会显示真实资料。',
    image: '',
    following: false,
  }
}

function getMockMyArticles(user) {
  const author = {
    id: user && user.id ? user.id : currentAuthor.id,
    username: user && user.username ? user.username : currentAuthor.username,
    bio: user && typeof user.bio === 'string' ? user.bio : currentAuthor.bio,
    image: user && typeof user.image === 'string' ? user.image : currentAuthor.image,
    following: false,
  }
  return myArticles.map((article) => ({ ...article, author }))
}

module.exports = {
  currentUserStats,
  followingUsers,
  followerUsers,
  myArticles,
  favoriteArticles,
  getMockProfile,
  getMockMyArticles,
}
