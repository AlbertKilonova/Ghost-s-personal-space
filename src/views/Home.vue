<template>
  <div class="home">
    <!-- 欢迎卡片 -->
    <WelcomeCard />
    
    <!-- 最近动态（从博客加载） -->
    <RecentSection 
      v-if="!isLoading && recentBlogs.length > 0"
      title="最新文章" 
      :items="recentBlogs"
      @item-click="handleBlogClick"
    />
    
    <!-- 加载骨架屏 -->
    <el-skeleton v-if="isLoading" :rows="3" animated style="margin-top: 30px;" />
    
    <!-- 空状态 -->
    <el-empty 
      v-if="!isLoading && recentBlogs.length === 0" 
      description="暂无文章"
      style="margin-top: 30px;"
    />
  </div>
</template>

<script setup>
/**
 * 主页视图组件
 * 动态加载最近3篇博客并展示
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loadAllPosts } from '@/utils/md-loader'
import WelcomeCard from '@/components/WelcomeCard.vue'
import RecentSection from '@/components/RecentSection.vue'

const router = useRouter()
const recentBlogs = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const allPosts = await loadAllPosts()
    
    // 取最近3篇，格式化为 RecentItem 需要的数据
    recentBlogs.value = allPosts
      .slice(0, 3)
      .map(post => ({
        icon: 'Notebook',
        title: post.title,
        description: post.excerpt.length > 60 
          ? post.excerpt.substring(0, 60) + '...' 
          : post.excerpt,
        path: `/blog/${post.id}`,
        clickable: true
      }))
  } catch (error) {
    console.error('加载最近文章失败:', error)
    ElMessage.error('加载失败')
  } finally {
    isLoading.value = false
  }
})

// 点击跳转到博客详情
const handleBlogClick = (item) => {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
