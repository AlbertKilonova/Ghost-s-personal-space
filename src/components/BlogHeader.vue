<template>
  <div class="blog-header">
    <h1 class="title">{{ title }}</h1>
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
/**
 * 博客页面头部组件
 * 显示主标题和副标题
 * @props {string} title - 主标题
 * @props {string} subtitle - 副标题
 */

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.blog-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  border-radius: 16px;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}
</style>