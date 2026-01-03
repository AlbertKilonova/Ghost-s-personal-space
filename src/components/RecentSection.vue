<template>
  <div class="recent-section">
    <h3 class="section-title">{{ title }}</h3>
    
    <div class="recent-items">
      <RecentItem 
        v-for="(item, index) in items" 
        :key="index"
        :icon="item.icon"
        :title="item.title"
        :description="item.description"
        :clickable="item.clickable"
        @click="$emit('item-click', item)"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * 最近动态区域组件
 * 支持从博客动态加载
 */

import RecentItem from './RecentItem.vue'

defineProps({
  title: {
    type: String,
    default: '最近动态'
  },
  items: {
    type: Array,
    required: true
  }
})

defineEmits(['item-click'])
</script>

<style scoped>
.recent-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;  /* 防止子元素溢出 */
}

.section-title {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.recent-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  overflow: hidden;  /* 关键！防止溢出 */
}
</style>
