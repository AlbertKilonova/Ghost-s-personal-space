/**
 * src/utils/project-loader.js
 */
export async function loadAllProjects() {
  const modules = import.meta.glob('@/projects/*.json', { 
    eager: true,
    import: 'default'
  })
  
  const projects = []
  
  for (const path in modules) {
    try {
      const project = modules[path]
      // 这里的 id 直接使用 json 文件里的 id
      projects.push(project)
    } catch (error) {
      console.error(`[project-loader] 加载失败: ${path}`, error)
    }
  }
  
  // ✅ 修改：按 date 字段倒序排列 (最新的在前面)
  return projects.sort((a, b) => {
    const dateA = new Date(a.date || 0)
    const dateB = new Date(b.date || 0)
    return dateB - dateA
  })
}