<template>
  <div class="projects">
    <div class="projects-container">
      <h1>我的作品</h1>
      <p class="subtitle">简单的小动画</p>
      
      <!-- 加载状态 -->
      <el-skeleton v-if="loading" :rows="5" animated />
      
      <!-- 作品列表 -->
      <ProjectList 
        v-else 
        :projects="projects" 
        @watch="handleWatch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { loadAllProjects } from '@/utils/project-loader'
import ProjectList from '@/components/ProjectList.vue'

const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    projects.value = await loadAllProjects()
  } catch (error) {
    console.error('加载作品失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
})

const handleWatch = (demoUrl) => {
  if (demoUrl) {
    window.open(demoUrl, '_blank')
  }
}
</script>

<style scoped>
.projects {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: left;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .projects {
    padding: 20px 15px;
  }
}
</style>
