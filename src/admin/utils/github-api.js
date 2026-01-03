/**
 * GitHub API 工具类
 * 直接操作仓库文件（增删改查）
 */

const GITHUB_TOKEN = localStorage.getItem('github_token')
const REPO_OWNER = 'AlbertKilonova'
const REPO_NAME = 'Ghost-s-personal-space'
const API_BASE = 'https://api.github.com/repos'

class GitHubAPI {
  constructor() {
    this.headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  }

  /**
   * 获取文件内容
   * @param {string} path - 文件路径（例如：src/projects/project-1.json）
   * @returns {Promise<Object>} 文件内容
   */
  async getFile(path) {
    try {
      const response = await fetch(
        `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
        { headers: this.headers }
      )
      
      if (!response.ok) {
        if (response.status === 404) return null // 文件不存在
        throw new Error(`获取失败: ${response.status}`)
      }
      
      const data = await response.json()
      // Base64 解码
      const content = atob(data.content)
      return {
        content: JSON.parse(content),
        sha: data.sha // 用于更新文件
      }
    } catch (error) {
      console.error('GitHub API 错误:', error)
      throw error
    }
  }

  /**
   * 创建/更新文件
   * @param {string} path - 文件路径
   * @param {string} content - 文件内容（字符串）
   * @param {string} message - 提交信息
   * @param {string} sha - 文件SHA（更新时需要）
   * @returns {Promise<Object>} 结果
   */
  async updateFile(path, content, message, sha = null) {
    try {
      const body = {
        message,
        content: btoa(content), // Base64 编码
        committer: {
          name: 'Admin',
          email: 'admin@example.com'
        }
      }
      
      if (sha) {
        body.sha = sha // 更新时需要提供 sha
      }
      
      const response = await fetch(
        `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(body)
        }
      )
      
      if (!response.ok) {
        throw new Error(`提交失败: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('GitHub API 错误:', error)
      throw error
    }
  }

  /**
   * 删除文件
   * @param {string} path - 文件路径
   * @param {string} sha - 文件SHA
   * @param {string} message - 提交信息
   * @returns {Promise<Object>} 结果
   */
  async deleteFile(path, sha, message) {
    try {
      const response = await fetch(
        `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
        {
          method: 'DELETE',
          headers: this.headers,
          body: JSON.stringify({
            message,
            sha,
            committer: {
              name: 'Admin',
              email: 'admin@example.com'
            }
          })
        }
      )
      
      if (!response.ok) {
        throw new Error(`删除失败: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('GitHub API 错误:', error)
      throw error
    }
  }

  /**
   * 获取目录下所有文件
   * @param {string} dir - 目录路径（例如：src/projects/）
   * @returns {Promise<Array>} 文件列表
   */
  async getDirectoryFiles(dir) {
    try {
      const response = await fetch(
        `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${dir}`,
        { headers: this.headers }
      )
      
      if (!response.ok) {
        throw new Error(`获取目录失败: ${response.status}`)
      }
      
      const files = await response.json()
      return files.filter(file => file.type === 'file')
    } catch (error) {
      console.error('GitHub API 错误:', error)
      throw error
    }
  }
}

export default GitHubAPI