import { defineStore } from 'pinia'
import { loadAllPosts, initSearch, searchPosts } from '@/utils/md-loader'

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [],
    isLoaded: false,
    isLoading: false,
    lastFetch: 0
  }),

  getters: {
    // 获取前N篇
    recentPosts: (state) => (limit = 3) => {
      return state.posts.slice(0, limit)
    },
    
    // 通过ID获取
    getPostById: (state) => (id) => {
      return state.posts.find(p => p.id == id)
    },

    // 检查是否需要刷新（比如缓存超过5分钟）
    shouldFetch: (state) => {
      return !state.isLoaded || (Date.now() - state.lastFetch > 5 * 60 * 1000)
    }
  },

  actions: {
    async fetchPosts(force = false) {
      if (this.isLoaded && !force && !this.shouldFetch) return

      this.isLoading = true
      try {
        console.log('[Pinia] Fetching posts...')
        const data = await loadAllPosts()
        this.posts = data
        
        // 同时初始化搜索索引
        await initSearch(data)
        
        this.isLoaded = true
        this.lastFetch = Date.now()
      } catch (error) {
        console.error('[Pinia] Failed to fetch posts', error)
      } finally {
        this.isLoading = false
      }
    },

    // 搜索动作
    search(query) {
      if (!query) return []
      const results = searchPosts(query)
      // 返回完整的文章对象列表
      return results.map(r => this.getPostById(r.id)).filter(Boolean)
    }
  }
})