<template>
  <div class="project-item">
    <!-- 主要内容 -->
    <div class="project-main">
      <h3 class="project-name">{{ project.name }}</h3>
      <p class="description">{{ project.description }}</p>
      
      <!-- 技术标签 -->
      <div class="tech-tags">
        <el-tag
          v-for="tech in project.tech"
          :key="tech"
          size="small"
          effect="plain"
          class="tech-tag"
        >
          {{ tech }}
        </el-tag>
      </div>
    </div>

    <!-- 操作链接 -->
    <div class="project-links">
      <el-button 
        type="primary" 
        size="small"
        @click="handleWatch"
        class="watch-btn"
      >
        <el-icon><VideoPlay /></el-icon>
        观看
      </el-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 单个作品卡片组件
 * 展示作品信息和操作按钮
 */

import { ElMessage } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.id && value.name && value.description && value.tech && value.demo
    }
  }
})

const emit = defineEmits(['watch'])

// 处理观看
const handleWatch = () => {
  if (props.project.demo) {
    window.open(props.project.demo, '_blank')
  } else {
    ElMessage.warning('暂无演示链接')
  }
}
</script>

<style scoped>
.project-item {
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 12px;  /* ✅ 统一圆角 */
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.project-item:hover {
  border-color: #409eff;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.project-main {
  flex: 1;
  margin-right: 20px;  /* 防止内容被按钮挤压 */
}

.project-name {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 500;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;  /* ✅ 限制两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  color: #409eff !important;
  background: #f0f7ff !important;
  border: none !important;
  border-radius: 12px !important;
}

.project-links {
  display: flex;
  gap: 10px;
  flex-shrink: 0;  /* 防止按钮被压缩 */
}

.watch-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .project-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .project-main {
    margin-right: 0;
  }
  
  .project-links {
    align-self: flex-start;
    width: 100%;
  }
  
  .watch-btn {
    width: 100%;
  }
}
</style>