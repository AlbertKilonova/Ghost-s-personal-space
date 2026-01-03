<template>
  <div class="simple-404">
    <div class="error-content">
      <h1>404</h1>
      <p>页面不存在</p>
      <el-button type="primary" @click="goHome" style="margin-top: 20px;">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.simple-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.error-content {
  text-align: center;
}

.error-content h1 {
  font-size: 5rem;
  color: #667eea;
  margin-bottom: 10px;
}

.error-content p {
  font-size: 1.2rem;
  color: #666;
}
</style>