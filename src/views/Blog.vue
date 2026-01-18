<template>
  <div class="blog-view">
    <BlogHeader title="Blog" subtitle="日常摸鱼笔记" />

    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文章..."
        clearable
        prefix-icon="Search"
        @input="handleSearch"
      />
    </div>

    <el-skeleton v-if="isLoading" :rows="5" animated />
    
    <!-- 搜索结果 -->
    <div v-else-if="searchQuery" class="blog-list">
      <p v-if="searchResults.length === 0" class="no-result">未找到相关文章</p>
      <BlogPostCard 
        v-for="post in searchResults" 
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- 正常列表 -->
    <div v-else-if="displayedPosts.length > 0" class="blog-list">
      <BlogPostCard 
        v-for="post in displayedPosts" 
        :key="post.id"
        :post="post"
      />
      
      <LoadMoreButton 
        :loading="loadingMore"
        :has-more="hasMore"
        @load="loadMore"
      />
    </div>

    <el-empty v-else description="还没有文章哦" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/posts'
import BlogHeader from '@/components/BlogHeader.vue'
import BlogPostCard from '@/components/BlogPostCard.vue'
import LoadMoreButton from '@/components/LoadMoreButton.vue'

const postStore = usePostStore()

const searchQuery = ref('')
const searchResults = ref([])
const page = ref(1)
const pageSize = 5
const loadingMore = ref(false)

const isLoading = computed(() => postStore.isLoading)
const allPosts = computed(() => postStore.posts)

// 分页逻辑
const displayedPosts = computed(() => {
  return allPosts.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => {
  return displayedPosts.value.length < allPosts.value.length
})

onMounted(() => {
  postStore.fetchPosts()
})

const handleSearch = (val) => {
  if (!val || val.trim().length < 2) {
    searchResults.value = []
    return
  }
  // ✅ 使用 Store 搜索
  searchResults.value = postStore.search(val)
}

const loadMore = () => {
  loadingMore.value = true
  setTimeout(() => {
    page.value++
    loadingMore.value = false
  }, 500)
}
</script>

<style scoped>
.blog-view { max-width: 800px; margin: 0 auto; padding: 20px; }
.search-section { margin: 30px 0; }
.blog-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px; }
.no-result { text-align: center; color: #999; margin-top: 20px; }
</style>