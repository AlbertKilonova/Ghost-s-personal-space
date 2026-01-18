<template>
  <div class="home">
    <WelcomeCard />
    
    <RecentSection 
      v-if="recentBlogs.length > 0"
      title="最新文章" 
      :items="recentBlogs"
      @item-click="handleBlogClick"
    />
    
    <el-skeleton v-if="isLoading" :rows="3" animated style="margin-top: 30px;" />
    
    <el-empty 
      v-if="!isLoading && recentBlogs.length === 0" 
      description="暂无文章"
      style="margin-top: 30px;"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/posts' // ✅ 使用 Store
import WelcomeCard from '@/components/WelcomeCard.vue'
import RecentSection from '@/components/RecentSection.vue'

const router = useRouter()
const postStore = usePostStore()

// 使用 computed 自动响应 store 数据变化
const isLoading = computed(() => postStore.isLoading)

const recentBlogs = computed(() => {
  // 从 Store 获取前 3 篇
  const posts = postStore.recentPosts(3)
  return posts.map(post => ({
    icon: 'Notebook',
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.id}`,
    clickable: true
  }))
})

onMounted(() => {
  // ✅ 触发 Store 加载 (有缓存机制)
  postStore.fetchPosts()
})

const handleBlogClick = (item) => {
  if (item.path) router.push(item.path)
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>