const test = require('node:test')
const assert = require('node:assert/strict')

const { markdownToHtml } = require('../common/markdown')

test('markdownToHtml renders the structures used by Agent answers', () => {
  const html = markdownToHtml(`# 分析结果

这篇文章的 **收藏数较低**，可以补充 \`代码示例\`。

- 收藏数：0
- 评论数：1

> 当前数据量较少

| 文章 | 收藏 |
| --- | ---: |
| Composition API | 0 |

\`\`\`js
const answer = '<safe>'
\`\`\``)

  assert.match(html, /<h1>分析结果<\/h1>/)
  assert.match(html, /<strong>收藏数较低<\/strong>/)
  assert.match(html, /<code>代码示例<\/code>/)
  assert.match(html, /<ul><li>收藏数：0<\/li><li>评论数：1<\/li><\/ul>/)
  assert.match(html, /<blockquote>当前数据量较少<\/blockquote>/)
  assert.match(html, /<table>/)
  assert.match(html, /<th>文章<\/th>/)
  assert.match(html, /<td>Composition API<\/td>/)
  assert.match(html, /<pre><code class="language-js">/)
  assert.match(html, /&lt;safe&gt;/)
})

test('markdownToHtml escapes raw HTML and blocks unsafe links', () => {
  const html = markdownToHtml(
    '<script>alert(1)</script> [危险链接](javascript:alert(1)) [官网](https://example.com)',
  )

  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.doesNotMatch(html, /href="javascript:/)
  assert.match(html, /危险链接/)
  assert.match(html, /href="https:\/\/example\.com"/)
})

test('markdownToHtml handles plain text and incomplete code fences', () => {
  assert.equal(markdownToHtml('第一行\n第二行'), '<p>第一行<br>第二行</p>')
  assert.equal(markdownToHtml(''), '')
  assert.match(markdownToHtml('```ts\nconst value = 1'), /<pre><code class="language-ts">/)
})
