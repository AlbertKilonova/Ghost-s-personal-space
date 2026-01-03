<template>
  <div class="blog-view">
    <BlogHeader title="Blog" subtitle="日常摸鱼笔记" />

    <!-- 🔍 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文章（标题、标签、内容）"
        clearable
        prefix-icon="Search"
        @input="handleSearch"
      />
      <el-tag v-if="searchResults.length > 0" class="search-tip">
        找到 {{ searchResults.length }} 篇相关文章
      </el-tag>
    </div>

    <!-- 加载状态 -->
    <el-skeleton v-if="isLoading" :rows="5" animated />
    
    <!-- 搜索结果 -->
    <div v-else-if="searchQuery && searchResults.length > 0" class="blog-list">
      <BlogPostCard 
        v-for="post in searchResults" 
        :key="'search-' + post.id"
        :post="allPosts.find(p => p.id === post.id)"
        @click="handlePostClick"
      />
    </div>

    <!-- 普通列表 -->
    <div v-else-if="allPosts.length > 0" class="blog-list">
      <BlogPostCard 
        v-for="post in displayedPosts" 
        :key="post.id"
        :post="post"
        @click="handlePostClick"
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="还没有文章哦">
      <el-button type="primary" @click="loadPosts">重新加载</el-button>
    </el-empty>

    <!-- 加载更多 -->
    <LoadMoreButton 
      v-if="allPosts.length > 0 && !searchQuery"
      :loading="loadingMore"
      :has-more="hasMore"
      @load="loadMore"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { initSearch, searchPosts, loadAllPosts } from '@/utils/md-loader'
import BlogHeader from '@/components/BlogHeader.vue'
import BlogPostCard from '@/components/BlogPostCard.vue'
import LoadMoreButton from '@/components/LoadMoreButton.vue'

const allPosts = ref([])
const displayedPosts = ref([])
const searchResults = ref([])
const searchQuery = ref('')
const isLoading = ref(true)
const loadingMore = ref(false)
const pageSize = 2

const hasMore = computed(() => displayedPosts.value.length < allPosts.value.length)

onMounted(async () => {
  await loadPosts()
  await initSearch(allPosts.value)
})

async function loadPosts() {
  try {
    isLoading.value = true
    allPosts.value = await loadAllPosts()
    displayedPosts.value = allPosts.value.slice(0, pageSize)
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    isLoading.value = false
  }
}

function handleSearch(query) {
  if (!query || query.trim().length < 2) {
    searchResults.value = []
    return
  }
  searchResults.value = searchPosts(query)
}

function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  
  setTimeout(() => {
    const currentLength = displayedPosts.value.length
    const newPosts = allPosts.value.slice(currentLength, currentLength + pageSize)
    displayedPosts.value.push(...newPosts)
    loadingMore.value = false
  }, 600)
}

function handlePostClick(post) {
  ElMessage.info(`点击了: ${post.title}`)
}
</script>

<style scoped>
.blog-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-section {
  margin: 30px 0;
}

.search-tip {
  margin-top: 10px;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px 0;
}
</style>
