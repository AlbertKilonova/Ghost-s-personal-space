<template>
  <el-card class="profile-card" shadow="hover">
    <div class="profile-content">
      <!-- 头像 -->
      <el-avatar 
        :size="80" 
        :src="avatar" 
        class="profile-avatar"
      />
      
      <!-- 信息 -->
      <div class="profile-info">
        <h1 class="name">{{ name }}</h1>
        <p class="title">{{ title }}</p>
        <p class="location">{{ location }}</p>
      </div>
    </div>
  </el-card>
</template>

<script setup>
/**
 * 个人资料卡片组件
 * 展示头像、名称、标题和位置信息
 * @props {string} name - 用户名
 * @props {string} title - 个性签名
 * @props {string} location - 位置/身份标识
 * @props {string} avatar - 头像图片路径
 */

defineProps({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.profile-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.profile-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  border: 3px solid #f0f0f0;
}

.profile-info h1 {
  margin: 0 0 5px 0;
  font-size: 1.8rem;
  color: #333;
}

.title {
  color: #409eff;
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.location {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>