export const DEMO_AUTHOR = {
  username: 'agent_demo_author',
  email: 'agent_demo_author@example.test',
  password: 'AgentDemo123!',
  bio: '用于演示文章分析 Agent 的测试作者',
} as const

export const DEMO_READERS = Array.from({ length: 8 }, (_, index) => ({
  username: `agent_demo_reader_${index + 1}`,
  email: `agent_demo_reader_${index + 1}@example.test`,
  password: 'AgentDemo123!',
  bio: `文章分析演示读者 ${index + 1}`,
}))

export const DEMO_TAGS = [
  'Vue',
  'JavaScript',
  'TypeScript',
  'Performance',
] as const

type DemoTag = (typeof DEMO_TAGS)[number]

export interface DemoComment {
  readerIndex: number
  body: string
  createdDaysAgo: number
}

export interface DemoArticle {
  slug: string
  title: string
  description: string
  body: string
  createdDaysAgo: number
  tags: readonly DemoTag[]
  favoriteReaderIndexes: readonly number[]
  comments: readonly DemoComment[]
}

export const DEMO_ARTICLES: readonly DemoArticle[] = [
  {
    slug: 'agent-demo-vue-reactivity-basics',
    title: 'Vue 响应式基础：从 ref 到 reactive',
    description: '通过完整示例理解 Vue 3 响应式数据、模板更新和常见使用边界。',
    body: `# Vue 响应式基础

Vue 3 提供 ref 和 reactive 两种常用的响应式 API。

## ref

ref 适合包装基本类型，也可以包装对象。在 JavaScript 中读取或修改时使用 value，在模板中会自动解包。

## reactive

reactive 适合创建对象的响应式代理。直接解构可能丢失响应式关联，可以使用 toRefs 保持引用。

## 示例

创建计数器并分别演示 ref、reactive、computed 和 watch 的配合方式。

## 总结

基本类型优先考虑 ref，对象状态可以根据团队习惯选择 ref 或 reactive。`,
    createdDaysAgo: 25,
    tags: ['Vue', 'JavaScript'],
    favoriteReaderIndexes: [0, 1, 2, 3, 4, 5, 6, 7],
    comments: [
      { readerIndex: 0, body: 'ref 和 reactive 的区别讲得很清楚。', createdDaysAgo: 23 },
      { readerIndex: 1, body: 'toRefs 的提醒很实用。', createdDaysAgo: 20 },
      { readerIndex: 2, body: '示例可以直接跟着练习，感谢分享。', createdDaysAgo: 16 },
      { readerIndex: 3, body: '希望后续补充 shallowRef 的使用场景。', createdDaysAgo: 10 },
    ],
  },
  {
    slug: 'agent-demo-vue-component-communication',
    title: 'Vue 组件通信的常用方式',
    description: '介绍 props、事件、插槽和 provide/inject 的适用场景。',
    body: `# Vue 组件通信

组件通信方式应当根据组件关系选择。

## 父子组件

父组件通过 props 传递数据，子组件通过 emit 发送事件。

## 跨层组件

provide 和 inject 可以减少逐层透传，但应避免隐藏过多依赖。

## 插槽

插槽适合让父组件控制一部分展示结构。

选择通信方式时，应优先保证数据流向清晰。`,
    createdDaysAgo: 21,
    tags: ['Vue', 'TypeScript'],
    favoriteReaderIndexes: [0, 1, 2, 3, 4],
    comments: [
      { readerIndex: 1, body: '各种方式的适用关系总结得不错。', createdDaysAgo: 19 },
      { readerIndex: 4, body: '能否再讲一下 defineModel？', createdDaysAgo: 14 },
      { readerIndex: 5, body: '希望增加 TypeScript 类型示例。', createdDaysAgo: 8 },
    ],
  },
  {
    slug: 'agent-demo-vue-router-guide',
    title: 'Vue Router 入门与路由守卫',
    description: '快速介绍路由配置、动态参数以及全局路由守卫。',
    body: `# Vue Router 入门

Vue Router 用来管理单页应用中的页面切换。

## 创建路由

先定义 routes，再通过 createRouter 创建路由实例。

## 动态参数

使用 /users/:id 定义动态路径，通过 useRoute 读取参数。

## 路由守卫

beforeEach 可以在进入页面前检查登录状态。

实际项目还应处理 404 页面和异步路由加载。`,
    createdDaysAgo: 17,
    tags: ['Vue', 'JavaScript'],
    favoriteReaderIndexes: [0, 2, 4],
    comments: [
      { readerIndex: 2, body: '入门结构清楚，但希望增加完整路由配置代码。', createdDaysAgo: 12 },
      { readerIndex: 6, body: '路由守卫部分可以补充 next 的兼容写法。', createdDaysAgo: 7 },
    ],
  },
  {
    slug: 'agent-demo-vue-performance',
    title: 'Vue 页面性能优化方法',
    description: '整理 Vue 页面性能优化中常见的几个方向。',
    body: `# Vue 性能优化

Vue 页面性能优化可以从组件、资源和网络请求入手。

## 减少组件更新

避免没有必要的数据变化。

## 使用懒加载

页面和图片可以使用懒加载。

## 缓存

合理使用缓存可以提升速度。

性能优化需要结合项目实际情况。`,
    createdDaysAgo: 13,
    tags: ['Vue', 'Performance'],
    favoriteReaderIndexes: [7],
    comments: [
      { readerIndex: 0, body: '内容比较笼统，没有说明怎么定位性能瓶颈。', createdDaysAgo: 10 },
      { readerIndex: 3, body: '希望补充 DevTools 和性能指标的实际示例。', createdDaysAgo: 6 },
      { readerIndex: 7, body: '懒加载示例不完整，照着文章无法直接运行。', createdDaysAgo: 3 },
    ],
  },
  {
    slug: 'agent-demo-vue-composition-api',
    title: 'Vue Composition API 简单介绍',
    description: '简单说明 Composition API 的基本概念。',
    body: `# Composition API

Composition API 是 Vue 3 提供的一种代码组织方式。

它可以把相关逻辑放在一起，也可以使用 ref 定义数据。

setup 是使用 Composition API 的入口。`,
    createdDaysAgo: 9,
    tags: ['Vue'],
    favoriteReaderIndexes: [],
    comments: [
      { readerIndex: 5, body: '只有概念，没有完整代码，也没有说明它比 Options API 好在哪里。', createdDaysAgo: 4 },
    ],
  },
]

export function parseSeedAuthorId(value: string | undefined): number | undefined {
  if (value === undefined) return undefined

  const normalized = value.trim()
  if (!/^[1-9]\d*$/.test(normalized)) {
    throw new Error('SEED_AUTHOR_ID must be a positive integer')
  }

  const authorId = Number(normalized)
  if (!Number.isSafeInteger(authorId)) {
    throw new Error('SEED_AUTHOR_ID must be a positive integer')
  }

  return authorId
}

export function assertSeedEnvironment(
  nodeEnv: string | undefined,
  allowDemoSeed: string | undefined,
): void {
  if (nodeEnv === 'production' && allowDemoSeed !== 'true') {
    throw new Error(
      'Refusing to seed production. Set ALLOW_DEMO_SEED=true to continue.',
    )
  }
}

export function validateDemoDataset(): void {
  if (DEMO_ARTICLES.length !== 5) {
    throw new Error('Demo dataset must contain exactly five articles')
  }

  if (DEMO_READERS.length !== 8) {
    throw new Error('Demo dataset must contain exactly eight readers')
  }

  const slugs = new Set<string>()
  const tagNames = new Set<string>(DEMO_TAGS)

  for (const article of DEMO_ARTICLES) {
    if (!article.slug.startsWith('agent-demo-') || slugs.has(article.slug)) {
      throw new Error(`Invalid or duplicate demo article slug: ${article.slug}`)
    }
    slugs.add(article.slug)

    for (const tag of article.tags) {
      if (!tagNames.has(tag)) {
        throw new Error(`Unknown demo tag: ${tag}`)
      }
    }

    const readerIndexes = [
      ...article.favoriteReaderIndexes,
      ...article.comments.map(comment => comment.readerIndex),
    ]

    if (readerIndexes.some(index => index < 0 || index >= DEMO_READERS.length)) {
      throw new Error(`Invalid reader index in article: ${article.slug}`)
    }
  }
}
