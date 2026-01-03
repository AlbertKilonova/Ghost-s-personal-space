<template>
  <el-card class="section-card" shadow="never">
    <template #header>
      <h2 class="section-title">{{ title }}</h2>
    </template>
    
    <!-- 内容插槽 -->
    <slot></slot>
  </el-card>
</template>

<script setup>
/**
 * 通用区块卡片组件
 * 用于包装各个内容区域，提供统一的标题样式
 * @props {string} title - 区块标题
 */

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.section-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}
</style>