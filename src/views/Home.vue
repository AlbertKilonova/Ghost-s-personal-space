<template>
  <div class="home">
    <!-- 欢迎卡片 -->
    <div class="welcome-card">
      <h1>火柴人动画爱好者</h1>
      <p class="subtitle">用最简单的线条，做最喜欢的动画</p>
      
      <div class="intro">
        <p>业余动画爱好者 | 火柴人动画创作者 | 自学摸索中</p>
        <p>没有专业背景，纯粹因为喜欢而坚持</p>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="number">5+</span>
          <span class="label">年爱好</span>
        </div>
        <div class="stat-item">
          <span class="number">20+</span>
          <span class="label">作品</span>
        </div>
        <div class="stat-item">
          <span class="number">0</span>
          <span class="label">商业项目</span>
        </div>
      </div>
      
      <el-divider />
      
      <div class="quick-actions">
        <el-button type="primary" @click="$router.push({ name: 'projects' })">
          看我的动画
        </el-button>
        <el-button @click="$router.push({ name: 'blog' })">
          读我的笔记
        </el-button>
        <el-button @click="$router.push({ name: 'contact' })">
          交流讨论
        </el-button>
      </div>
    </div>
    
    <!-- 最新内容 -->
    <div class="recent-section">
      <h3>最近动态</h3>
      
      <div class="recent-items">
        <div class="recent-item">
          <el-icon><VideoCamera /></el-icon>
          <div>
            <h4>新动画发布</h4>
            <p>手绘逐帧实验动画上传B站</p>
          </div>
        </div>
        
        <div class="recent-item">
          <el-icon><Notebook /></el-icon>
          <div>
            <h4>笔记更新</h4>
            <p>写了篇Pivot转Flash的心得</p>
          </div>
        </div>
        
        <div class="recent-item">
          <el-icon><ChatDotRound /></el-icon>
          <div>
            <h4>社区互动</h4>
            <p>在贴吧回答了新人的问题</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { VideoCamera, Notebook, ChatDotRound } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.welcome-card h1 {
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

.stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 30px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.number {
  font-size: 2rem;
  font-weight: bold;
  color: #409eff;
}

.label {
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.recent-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.recent-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.recent-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.recent-item:hover {
  background: #f0f7ff;
  transform: translateX(5px);
}

.recent-item .el-icon {
  color: #409eff;
  font-size: 1.5rem;
}

.recent-item h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 1rem;
}

.recent-item p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 25px;
  }
  
  .stats {
    gap: 20px;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-actions .el-button {
    width: 100%;
  }
}
</style>