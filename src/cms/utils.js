// src/cms/utils.js
import fm from 'front-matter'

// 移除 Markdown 符号，提取纯文本用于摘要
export function stripMarkdown(md) {
  if (!md) return ''
  return md
    .replace(/^#+\s+/gm, '')       // 移除标题
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
    .replace(/(\*|_)(.*?)\1/g, '$2')    // 移除斜体
    .replace(/!\[.*?\]\(.*?\)/g, '')    // 移除图片
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接
    .replace(/`{3}[\s\S]*?`{3}/g, '')   // 移除代码块
    .replace(/`(.+?)`/g, '$1')          // 移除行内代码
    .replace(/\n/g, ' ')                // 换行变空格
    .trim()
}

// 自动生成文件名 (YYYY-MM-DD-Random)
export function generateFilename(date) {
  const d = date ? new Date(date) : new Date()
  const dateStr = d.toISOString().split('T')[0]
  // 生成6位随机字符，避免同天发布文章文件名冲突
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${dateStr}-${randomStr}`
}

// 解析已有文章内容 (分离 Frontmatter 和 正文)
export function parsePostContent(raw) {
  try {
    const parsed = fm(raw)
    return {
      attributes: parsed.attributes || {},
      body: parsed.body || ''
    }
  } catch (e) {
    console.error('Parse error', e)
    return { attributes: {}, body: raw }
  }
}