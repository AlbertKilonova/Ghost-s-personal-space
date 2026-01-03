import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import Fuse from 'fuse.js'

const md = new MarkdownIt()

// 全局搜索实例
let fuseInstance = null
let searchDataCache = null

/**
 * 加载所有markdown文章
 * @returns {Promise<Array>} 文章数组
 */
export async function loadAllPosts() {
  console.log('🔍 [md-loader] 开始扫描 .md 文件...')
  
  // 动态导入所有md文件
  const modules = import.meta.glob('@/doc/*.md', { 
    as: 'raw',
    eager: false
  })
  
  console.log('📂 [md-loader] 扫描到的文件:', Object.keys(modules))
  
  if (Object.keys(modules).length === 0) {
    console.warn('⚠️ [md-loader] 未找到任何.md文件，请检查src/doc/目录是否存在')
    ElMessage.error('未找到任何文章')
  }

  const posts = []

  for (const path in modules) {
    try {
      console.log(`⏳ [md-loader] 加载: ${path}`)
      const content = await modules[path]()
      
      const parsed = fm(content)
      console.log(`✅ [md-loader] Frontmatter:`, parsed.attributes)
      
      // 验证必要字段
      if (!parsed.attributes.title) {
        console.warn(`⚠️ [md-loader] ${path} 缺少 title`)
        continue
      }
      
      // 生成ID（优先使用frontmatter中的id或slug）
      const id = generateId(path, parsed.attributes)
      
      const post = {
        id: id,
        title: parsed.attributes.title,
        date: parsed.attributes.date || '2024-01-01',
        category: parsed.attributes.category || '未分类',
        tags: Array.isArray(parsed.attributes.tags) ? parsed.attributes.tags : [],
        excerpt: parsed.attributes.excerpt || generateExcerpt(parsed.body),
        content: md.render(parsed.body), // HTML内容
        rawContent: parsed.body,         // 原始Markdown内容，用于搜索
        path: path
      }
      
      posts.push(post)
      
    } catch (error) {
      console.error(`❌ [md-loader] 加载失败: ${path}`, error)
    }
  }

  // 按日期倒序排列
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  console.log(`📊 [md-loader] 最终加载 ${sortedPosts.length} 篇文章`)
  
  return sortedPosts
}

/**
 * 生成文章ID（优化版）
 * @param {string} path - 文件路径
 * @param {Object} frontmatter - frontmatter数据
 * @returns {string|number} 唯一ID
 */
function generateId(path, frontmatter = {}) {
  // 1. 优先使用frontmatter中的自定义id
  if (frontmatter.id) {
    return String(frontmatter.id)
  }
  
  // 2. 其次使用frontmatter中的slug（URL友好的别名）
  if (frontmatter.slug) {
    return frontmatter.slug
  }
  
  // 3. 回退到文件名哈希（保持兼容）
  const filename = path.split('/').pop().replace('.md', '')
  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    hash = ((hash << 5) - hash) + filename.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash).toString(16) // 改为16进制，更短
}


/**
 * 生成摘要
 */
function generateExcerpt(content) {
  const text = content.replace(/[#*`>\[\]\(\)]/g, '')
  return text.substring(0, 120) + '...' // 增加到120字
}

// ===================================================================
// 新增：搜索功能
// ===================================================================

/**
 * 初始化搜索索引
 * @param {Array} posts - 文章数组（可选，不传则自动加载）
 * @returns {Promise<Fuse>} Fuse实例
 */
export async function initSearch(posts = null) {
  if (fuseInstance) {
    console.log('🔍 [md-loader] 搜索已初始化，复用实例')
    return fuseInstance
  }
  
  const postsData = posts || await loadAllPosts()
  
  // 准备搜索数据（包含所有可搜索字段）
  searchDataCache = postsData.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.rawContent, // 使用原始内容搜索更准确
    category: post.category,
    tags: post.tags.join(' '), // 标签拼接成字符串
    date: post.date
  }))
  
  console.log('🔍 [md-loader] 创建搜索索引，共', searchDataCache.length, '篇文章')
  
  // Fuse.js配置
  const options = {
    keys: [
      { name: 'title', weight: 0.6 },      // 标题权重最高
      { name: 'tags', weight: 0.3 },       // 标签次之
      { name: 'content', weight: 0.2 },    // 内容权重较低
      { name: 'category', weight: 0.1 }    // 分类权重最低
    ],
    threshold: 0.4,  // 模糊匹配程度（0.0=精确匹配，1.0=完全不匹配）
    includeScore: true,  // 包含匹配分数
    minMatchCharLength: 2,  // 最小匹配字符数
    shouldSort: true,  // 按分数排序
    findAllMatches: true  // 查找所有匹配项
  }
  
  fuseInstance = new Fuse(searchDataCache, options)
  return fuseInstance
}

/**
 * 搜索文章
 * @param {string} query - 搜索关键词
 * @param {Object} options - 搜索选项
 * @returns {Array} 搜索结果数组
 */
export function searchPosts(query, options = {}) {
  if (!fuseInstance) {
    console.warn('⚠️ [md-loader] 搜索未初始化，请先调用 initSearch()')
    return []
  }
  
  if (!query || query.trim().length < 2) {
    return []
  }
  
  // Fuse.js搜索
  const results = fuseInstance.search(query, {
    limit: options.limit || 10  // 限制返回数量
  })
  
  // 格式化结果
  return results.map(result => ({
    id: result.item.id,
    title: result.item.title,
    excerpt: result.item.excerpt,
    category: result.item.category,
    tags: result.item.tags.split(' ').filter(Boolean),
    date: result.item.date,
    score: result.score,  // 匹配分数（越低越匹配）
    matches: result.matches  // 匹配详情
  }))
}

/**
 * 根据ID获取单篇文章
 * @param {string|number} id - 文章ID
 * @returns {Promise<Object|null>} 文章对象或null
 */
export async function getPostById(id) {
  const posts = await loadAllPosts()
  return posts.find(p => p.id == id) || null
}

/**
 * 根据路径获取单篇文章
 * @param {string} path - 文件路径
 * @returns {Promise<Object|null>} 文章对象或null
 */
export async function getPostByPath(path) {
  const posts = await loadAllPosts()
  return posts.find(p => p.path === path) || null
}
