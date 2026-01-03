<template>
  <div class="load-more-section">
    <el-button 
      class="load-btn"
      :loading="loading"
      :disabled="!hasMore"
      @click="handleClick"
    >
      <template #loading>
        <el-icon class="is-loading"><Loading /></el-icon>
        加载中...
      </template>
      
      <template v-if="!loading">
        {{ hasMore ? '加载更多' : '没有更多了' }}
      </template>
    </el-button>
  </div>
</template>

<script setup>
/**
 * 加载更多按钮组件
 * 处理文章列表的加载状态
 * @props {boolean} loading - 加载中状态
 * @props {boolean} hasMore - 是否还有更多数据
 * @emits {Function} load - 点击加载事件
 */

import { Loading } from '@element-plus/icons-vue'

// ✅ 正确：用 props 接收
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['load'])

// ✅ 正确：用 props.loading 和 props.hasMore 访问
const handleClick = () => {
  // 原来是 if (!loading.value && hasMore.value)
  if (!props.loading && props.hasMore) {
    emit('load')
  }
}
</script>

<style scoped>
.load-more-section {
  text-align: center;
  margin-top: 20px;
  padding: 20px 0;
}

.load-btn {
  min-width: 150px;
  border-radius: 8px;
}
</style>