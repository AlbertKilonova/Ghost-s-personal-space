import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import Fuse from 'fuse.js'
import DOMPurify from 'dompurify'

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,       // 允许 HTML 标签
  linkify: true,    // 自动识别链接
  typographer: true // 优化排版
})

// 全局搜索实例缓存
let fuseInstance = null

/**
 * 加载所有 markdown 文章
 * 包含：解析、清洗、草稿过滤、排序
 */
export async function loadAllPosts() {
  console.log('[md-loader] 开始扫描 .md 文件...')
  
  // 动态导入所有 md 文件 (lazy load 模式)
  const modules = import.meta.glob('@/doc/*.md', { 
    as: 'raw',
    eager: false 
  })
  
  const posts = []

  for (const path in modules) {
    try {
      const content = await modules[path]()
      const parsed = fm(content)
      const attr = parsed.attributes
      
      // 1. 基础验证
      if (!attr.title) continue

      // 2. ✨ 草稿过滤逻辑 ✨
      // 如果是生产环境 (!DEV) 且文章标记为草稿，则跳过不加载
      if (!import.meta.env.DEV && attr.draft) {
        continue
      }

      // 3. 生成 ID
      const id = generateId(path, attr)
      
      // 4. 渲染并清洗 HTML (安全防护)
      const rawHtml = md.render(parsed.body)
      const sanitizedContent = DOMPurify.sanitize(rawHtml)
      
      posts.push({
        id: id,
        title: attr.title,
        date: attr.date || new Date().toISOString().split('T')[0],
        category: attr.category || '未分类',
        tags: Array.isArray(attr.tags) ? attr.tags : [],
        excerpt: attr.excerpt || generateExcerpt(parsed.body),
        content: sanitizedContent, // 用于展示 (HTML)
        rawContent: parsed.body,   // 用于搜索 (Markdown 源码)
        draft: !!attr.draft,       // 标记草稿状态 (供开发环境 UI 使用)
        path: path
      })
      
    } catch (error) {
      console.error(`[md-loader] 加载失败: ${path}`, error)
    }
  }

  // 按日期倒序排列
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * 生成文章ID
 */
function generateId(path, frontmatter = {}) {
  // 优先使用 frontmatter 中的 id 或 slug
  if (frontmatter.id) return String(frontmatter.id)
  if (frontmatter.slug) return frontmatter.slug
  
  // 回退到文件名哈希
  const filename = path.split('/').pop().replace('.md', '')
  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    hash = ((hash << 5) - hash) + filename.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

/**
 * 生成摘要 (去除 Markdown 符号)
 */
function generateExcerpt(content) {
  const text = content
    .replace(/^#+\s+/gm, '')       // 移除标题
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
    .replace(/!\[.*?\]\(.*?\)/g, '')    // 移除图片
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接
    .replace(/`{3}[\s\S]*?`{3}/g, '')   // 移除代码块
    .replace(/\n/g, ' ')                // 换行变空格
  return text.substring(0, 120) + '...'
}

// ===================================================================
// 搜索功能
// ===================================================================

/**
 * 初始化搜索索引
 */
export async function initSearch(posts = null) {
  if (fuseInstance) return fuseInstance
  
  const postsData = posts || await loadAllPosts()
  
  // 准备搜索数据
  const searchData = postsData.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.rawContent, // 使用源码搜索更精准
    tags: post.tags.join(' '),
    category: post.category
  }))
  
  // Fuse.js 配置
  const options = {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'tags', weight: 0.3 },
      { name: 'content', weight: 0.2 }, // 内容权重降低，防止噪音
      { name: 'category', weight: 0.1 }
    ],
    threshold: 0.4, // 模糊匹配程度
    includeScore: true
  }
  
  fuseInstance = new Fuse(searchData, options)
  return fuseInstance
}

/**
 * 搜索文章
 * 返回包含完整文章对象的结果列表
 */
export function searchPosts(query) {
  if (!fuseInstance || !query || query.trim().length < 2) {
    return []
  }
  
  const results = fuseInstance.search(query, { limit: 10 })
  
  // 返回结果格式化 (保留 id 和 score，具体的文章对象建议在 Store 中查找)
  return results.map(result => ({
    id: result.item.id,
    score: result.score
  }))
}