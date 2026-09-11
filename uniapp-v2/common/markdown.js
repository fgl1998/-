function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeHref(value) {
  const href = String(value).trim()
  if (/^(https?:\/\/|mailto:|\/[^/]|#)/i.test(href)) return href
  return ''
}

function renderInline(value) {
  const codeTokens = []
  let content = escapeHtml(value)

  content = content.replace(/`([^`\n]+)`/g, (_, code) => {
    const index = codeTokens.push(`<code>${code}</code>`) - 1
    return `\u0001CODE${index}\u0002`
  })

  content = content.replace(/\[([^\]\n]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, label, href) => {
    const allowedHref = safeHref(href)
    if (!allowedHref) return label
    return `<a href="${allowedHref}">${label}</a>`
  })

  content = content
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
    .replace(/~~([^~\n]+)~~/g, '<del>$1</del>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')

  return content.replace(/\u0001CODE(\d+)\u0002/g, (_, index) => codeTokens[Number(index)] || '')
}

function splitTableRow(line) {
  let normalized = line.trim()
  if (normalized.startsWith('|')) normalized = normalized.slice(1)
  if (normalized.endsWith('|')) normalized = normalized.slice(0, -1)
  return normalized.split('|').map(cell => cell.trim())
}

function isTableDivider(line) {
  const cells = splitTableRow(line)
  return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell))
}

function markdownToHtml(markdown) {
  const source = typeof markdown === 'string' ? markdown : String(markdown || '')
  if (!source.trim()) return ''

  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const html = []
  let paragraph = []
  let listType = ''
  let inCodeFence = false
  let codeLanguage = ''
  let codeLines = []

  function flushParagraph() {
    if (!paragraph.length) return
    html.push(`<p>${paragraph.map(renderInline).join('<br>')}</p>`)
    paragraph = []
  }

  function closeList() {
    if (!listType) return
    html.push(`</${listType}>`)
    listType = ''
  }

  function flushCodeFence() {
    const languageClass = codeLanguage
      ? ` class="language-${escapeHtml(codeLanguage)}"`
      : ''
    html.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`)
    codeLanguage = ''
    codeLines = []
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    if (inCodeFence) {
      if (/^\s*```\s*$/.test(line)) {
        flushCodeFence()
        inCodeFence = false
      } else {
        codeLines.push(line)
      }
      continue
    }

    const fence = line.match(/^\s*```\s*([a-z0-9_-]*)\s*$/i)
    if (fence) {
      flushParagraph()
      closeList()
      inCodeFence = true
      codeLanguage = fence[1] || ''
      continue
    }

    if (!line.trim()) {
      flushParagraph()
      closeList()
      continue
    }

    const nextLine = lines[index + 1]
    if (line.includes('|') && nextLine && isTableDivider(nextLine)) {
      flushParagraph()
      closeList()
      const headers = splitTableRow(line)
      const rows = []
      index += 2
      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        rows.push(splitTableRow(lines[index]))
        index += 1
      }
      index -= 1

      html.push('<table><thead><tr>')
      for (const header of headers) html.push(`<th>${renderInline(header)}</th>`)
      html.push('</tr></thead><tbody>')
      for (const row of rows) {
        html.push('<tr>')
        for (let column = 0; column < headers.length; column += 1) {
          html.push(`<td>${renderInline(row[column] || '')}</td>`)
        }
        html.push('</tr>')
      }
      html.push('</tbody></table>')
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      closeList()
      const level = heading[1].length
      html.push(`<h${level}>${renderInline(heading[2].trim())}</h${level}>`)
      continue
    }

    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushParagraph()
      closeList()
      html.push('<hr>')
      continue
    }

    const unorderedItem = line.match(/^\s*[-+*]\s+(.+)$/)
    const orderedItem = line.match(/^\s*\d+[.)]\s+(.+)$/)
    if (unorderedItem || orderedItem) {
      flushParagraph()
      const nextListType = unorderedItem ? 'ul' : 'ol'
      if (listType !== nextListType) {
        closeList()
        listType = nextListType
        html.push(`<${listType}>`)
      }
      html.push(`<li>${renderInline((unorderedItem || orderedItem)[1])}</li>`)
      continue
    }

    const quote = line.match(/^\s*>\s?(.*)$/)
    if (quote) {
      flushParagraph()
      closeList()
      html.push(`<blockquote>${renderInline(quote[1])}</blockquote>`)
      continue
    }

    closeList()
    paragraph.push(line.trim())
  }

  flushParagraph()
  closeList()
  if (inCodeFence) flushCodeFence()

  return html.join('')
}

module.exports = {
  markdownToHtml,
}
