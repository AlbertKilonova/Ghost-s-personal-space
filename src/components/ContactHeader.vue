<template>
  <div class="contact-header">
    <h2 class="title">{{ title }}</h2>
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
/**
 * 联系页面头部组件
 * 显示标题和副标题
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
.contact-header {
  margin-bottom: 30px;
}

.title {
  margin-bottom: 10px;
  color: #333;
  font-size: 1.8rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}
</style>