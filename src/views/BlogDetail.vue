<template>
  <div class="blog-detail">
    <el-button class="back-btn" link icon="ArrowLeft" @click="$router.back()">
      返回
    </el-button>

    <div class="post-header" v-if="post">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span class="date">{{ post.date }}</span>
        <el-tag size="small">{{ post.category }}</el-tag>
      </div>
    </div>

    <el-skeleton v-if="isLoading" :rows="10" animated />
    
    <!-- ✅ 安全渲染清洗后的内容 -->
    <div v-else-if="post" class="post-content markdown-body" v-html="post.content"></div>
    
    <el-empty v-else description="文章不存在" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/stores/posts'

const route = useRoute()
const postStore = usePostStore()
const post = ref(null)

const isLoading = computed(() => postStore.isLoading)

onMounted(async () => {
  const id = route.params.id
  
  // 确保数据已加载
  if (!postStore.isLoaded) {
    await postStore.fetchPosts()
  }
  
  post.value = postStore.getPostById(id)
})
</script>

<style scoped>
.blog-detail { max-width: 800px; margin: 0 auto; padding: 20px; }
.back-btn { margin-bottom: 20px; }
.post-header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.post-title { font-size: 2rem; margin-bottom: 15px; }
.post-meta { display: flex; gap: 15px; color: #888; font-size: 0.9rem; align-items: center; }

/* 样式优化：配合 markdown-body 类名或自定义 */
.post-content { line-height: 1.8; color: #333; }
.post-content :deep(img) { max-width: 100%; border-radius: 8px; }
</style>