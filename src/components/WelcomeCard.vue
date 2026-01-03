<template>
  <div class="welcome-card">
    <!-- 头部 -->
    <div class="card-header">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
    </div>

    <!-- 简介 -->
    <div class="intro">
      <p v-for="(text, index) in introduction" :key="index">{{ text }}</p>
    </div>

    <!-- ✅ 移除：统计卡片部分 -->

    <el-divider />

    <!-- ✅ 修复：按钮垂直排列，避免错位 -->
    <div class="quick-actions">
      <el-button 
        v-for="action in actions" 
        :key="action.route"
        :type="action.type"
        @click="$router.push({ name: action.route })"
        class="action-btn"
      >
        {{ action.label }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 欢迎卡片组件
 * 展示个人信息和操作按钮（无统计卡片）
 */

const title = "Ghost's space"
const subtitle = '幽灵猫的个人空间'
const introduction = [
  '简介1',
  '简介2'
]

const actions = [
  { label: '我的作品', type: 'primary', route: 'projects' },
  { label: '我的Blog', type: '', route: 'blog' },
  { label: '联系方式', type: '', route: 'contact' }
]
</script>

<style scoped>
.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 25px;
}

.intro {
  margin: 30px 0;
  color: #555;
  line-height: 1.8;
}

/* ✅ 修复：按钮垂直排列 */
.quick-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

/* ✅ 修复：统一按钮宽度 */
.action-btn {
  width: 220px;
  max-width: 100%;
  flex-shrink: 0;
}

/* ✅ 移除 Element Plus 默认 margin */
:deep(.el-button) {
  margin: 0 !important;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 25px;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
