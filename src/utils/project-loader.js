/**
 * 项目作品加载器
 * 自动扫描 src/projects/ 目录下的 .json 文件
 */

export async function loadAllProjects() {
  console.log('🔍 [project-loader] 开始扫描项目文件...')
  
  // 扫描所有 .json 文件
  const modules = import.meta.glob('@/projects/*.json', { 
    eager: true,
    import: 'default'
  })
  
  console.log('📂 扫描到的项目文件:', Object.keys(modules))
  
  if (Object.keys(modules).length === 0) {
    console.warn('⚠️ 未找到任何 .json 文件')
    return []
  }
  
  const projects = []
  
  for (const path in modules) {
    try {
      const project = modules[path]
      
      // 验证必要字段
      if (!project.name || !project.description || !project.tech || !project.demo) {
        console.warn(`⚠️ ${path} 缺少必要字段`)
        continue
      }
      
      // 从文件名生成ID
      const id = generateIdFromPath(path)
      
      projects.push({
        id,
        ...project
      })
      
    } catch (error) {
      console.error(`❌ 加载失败: ${path}`, error)
    }
  }
  
  // 按ID排序（或按日期，如果有date字段）
  return projects.sort((a, b) => a.id - b.id)
}

function generateIdFromPath(path) {
  const filename = path.split('/').pop().replace('.json', '')
  // 从文件名提取数字，或生成哈希
  const match = filename.match(/(\d+)/)
  if (match) {
    return parseInt(match[1])
  }
  
  // 回退到哈希
  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    hash = ((hash << 5) - hash) + filename.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}