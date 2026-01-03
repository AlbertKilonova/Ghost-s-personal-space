<template>
  <div 
    class="recent-item" 
    :class="{ clickable }"
    @click="$emit('click')"
  >
    <el-icon class="item-icon">
      <component :is="iconComponent" />
    </el-icon>
    
    <div class="item-content">
      <h4 class="title">{{ title }}</h4>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
/**
 * 单个动态项组件
 * 支持点击跳转，修复文本溢出
 */

import { computed } from 'vue'
import { VideoCamera, Notebook, ChatDotRound } from '@element-plus/icons-vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const iconComponent = computed(() => {
  const iconMap = {
    VideoCamera,
    Notebook,
    ChatDotRound
  }
  return iconMap[props.icon]
})
</script>

<style scoped>
.recent-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 60px;
  width: 100%;
  overflow: hidden;  /* 防止溢出 */
}

.recent-item.clickable {
  cursor: pointer;
}

.recent-item.clickable:hover {
  background: #f0f7ff;
  transform: translateX(5px);
}

.item-icon {
  color: #409eff;
  font-size: 1.5rem;
  flex-shrink: 0;  /* 防止图标被压缩 */
}

.item-content {
  flex: 1;
  min-width: 0;    /* 允许内容收缩 */
  overflow: hidden;
}

.title {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;          /* 不换行 */
  overflow: hidden;             /* 隐藏溢出 */
  text-overflow: ellipsis;      /* 显示省略号 */
}

.description {
  margin: 0;
  color: #666;
  font-size: 0.85rem;              /* 稍微缩小字体 */
  line-height: 1.4;
  /* ✅ 修复：两行组合拳 */
  white-space: nowrap;             /* 不换行 */
  overflow: hidden;                /* 隐藏溢出 */
  text-overflow: ellipsis;         /* 显示省略号 */
  max-width: 100%;                 /* 确保不超出容器 */
}
</style>
