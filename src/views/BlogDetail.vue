<template>
  <div class="blog-detail">
    <!-- 返回按钮 -->
    <el-button 
      class="back-btn" 
      link 
      :icon="ArrowLeft" 
      @click="$router.back()"
    >
      返回列表
    </el-button>

    <!-- 文章头部 -->
    <div class="post-header" v-if="post">
      <h1 class="post-title">{{ post.title }}</h1>
      
      <div class="post-meta">
        <span class="date">{{ post.date }}</span>
        <el-tag size="small" type="info">{{ post.category }}</el-tag>
      </div>
      
      <div class="post-tags">
        <el-tag
          v-for="tag in post.tags"
          :key="tag"
          size="small"
          effect="plain"
          class="tag-item"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <!-- 文章内容 -->
    <el-skeleton v-if="isLoading" :rows="10" animated />
    
    <div v-else-if="post" class="post-content" v-html="post.content"></div>
    
    <el-empty v-else description="文章不存在" />
  </div>
</template>

<script setup>
/**
 * 博客详情页组件
 * 根据路由参数显示单篇文章
 */

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { loadAllPosts } from '@/utils/md-loader'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  const postId = route.params.id
  console.log('📖 [BlogDetail] 加载文章ID:', postId)
  
  try {
    const posts = await loadAllPosts()
    post.value = posts.find(p => p.id == postId)
    
    if (!post.value) {
      ElMessage.error('文章不存在')
      router.replace('/blog')
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载失败')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.blog-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  margin-bottom: 20px;
  color: #409eff;
}

.post-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.post-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.date {
  color: #888;
  font-size: 0.9rem;
}

.post-tags {
  display: flex;
  gap: 8px;
}

.tag-item {
  border-radius: 12px !important;
}

.post-content {
  line-height: 1.8;
  color: #333;
  font-size: 1rem;
}

/* 美化markdown生成的内容 */
.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3) {
  margin-top: 30px;
  margin-bottom: 15px;
}

.post-content :deep(p) {
  margin-bottom: 15px;
}

.post-content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.post-content :deep(pre) {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
}
</style>