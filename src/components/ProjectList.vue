<template>
  <div class="project-list">
    <!-- 空状态 -->
    <el-empty 
      v-if="projects.length === 0" 
      description="还没有作品哦"
    >
      <el-button type="primary">添加第一个作品</el-button>
    </el-empty>

    <!-- 作品列表 -->
    <div v-else class="list-container">
      <ProjectItem 
        v-for="project in projects" 
        :key="project.id"
        :project="project"
        @watch="handleWatch"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * 作品列表组件
 * 渲染作品列表并处理空状态
 */

import ProjectItem from './ProjectItem.vue'

defineProps({
  projects: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['watch'])

// 处理观看事件
const handleWatch = (demoUrl) => {
  window.open(demoUrl, '_blank')
}
</script>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 空状态样式 */
:deep(.el-empty) {
  padding: 60px 0;
}

:deep(.el-empty__description) {
  color: #666;
}
</style>
