<template>
  <div class="admin-container" :class="{ 'admin-dark': isDark }">
    <!-- 登录界面 -->
    <div v-if="!loggedIn" class="login-screen">
      <div class="login-card">
        <h2>🔐 管理后台登录</h2>
        <p class="login-tip">需要 GitHub Personal Access Token</p>
        
        <el-input
          v-model="token"
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          show-password
          size="large"
          class="token-input"
        />
        
        <el-alert 
          title="Token 仅存储在本地浏览器，不会上传到服务器" 
          type="info" 
          :closable="false"
          show-icon
          class="token-hint"
        />
        
        <el-button 
          type="primary" 
          size="large" 
          @click="handleLogin"
          :loading="loggingIn"
          class="login-btn"
        >
          登录
        </el-button>
        
        <div class="token-guide">
          <h4>如何获取 Token？</h4>
          <ol>
            <li>登录 GitHub</li>
            <li>Settings → Developer settings → Personal access tokens</li>
            <li>点击 "Generate new token (classic)"</li>
            <li>权限勾选: repo, workflow</li>
            <li>点击 "Generate token"</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 后台界面 -->
    <div v-else class="admin-dashboard">
      <!-- 顶部导航 -->
      <div class="admin-header">
        <div class="logo">🎬 管理后台</div>
        <div class="user-info">
          <span>仓库: AlbertKilonova/Ghost-s-personal-space</span>
          <el-button type="text" @click="handleLogout">退出登录</el-button>
        </div>
      </div>

      <!-- 侧边菜单 -->
      <div class="admin-sidebar">
        <el-menu :default-active="activeTab" @select="handleTabChange">
          <el-menu-item index="projects">
            <el-icon><Film /></el-icon>
            <span>作品管理</span>
          </el-menu-item>
          <el-menu-item index="blog">
            <el-icon><Document /></el-icon>
            <span>博客管理</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <span>网站设置</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 内容区域 -->
      <div class="admin-content">
        <!-- 作品管理 -->
        <div v-show="activeTab === 'projects'">
          <ProjectManager />
        </div>

        <!-- 博客管理 -->
        <div v-show="activeTab === 'blog'">
          <BlogManager />
        </div>

        <!-- 网站设置 -->
        <div v-show="activeTab === 'settings'">
          <Settings />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Film, Document, Setting } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'
import ProjectManager from './components/ProjectManager.vue'
import BlogManager from './components/BlogManager.vue'
import Settings from './components/Settings.vue'

const isDark = useDark()
const loggedIn = ref(false)
const token = ref('')
const loggingIn = ref(false)
const activeTab = ref('projects')

// 检查是否已登录
const checkLogin = () => {
  const savedToken = localStorage.getItem('github_token')
  if (savedToken) {
    token.value = savedToken
    loggedIn.value = true
  }
}

// 登录
const handleLogin = () => {
  if (!token.value.trim()) {
    ElMessage.warning('请输入 GitHub Token')
    return
  }
  
  loggingIn.value = true
  
  // 验证 Token
  fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${token.value}`
    }
  })
  .then(res => {
    if (res.ok) {
      localStorage.setItem('github_token', token.value)
      loggedIn.value = true
      ElMessage.success('登录成功！')
    } else {
      throw new Error('Token 无效')
    }
  })
  .catch(err => {
    ElMessage.error('登录失败：' + err.message)
  })
  .finally(() => {
    loggingIn.value = false
  })
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('github_token')
  loggedIn.value = false
  token.value = ''
  ElMessage.success('已退出登录')
}

// 切换标签
const handleTabChange = (tab) => {
  activeTab.value = tab
}

// 初始化
checkLogin()
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 登录界面 */
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.login-card h2 {
  margin: 0 0 10px 0;
  color: #333;
  text-align: center;
}

.login-tip {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

.token-input {
  margin-bottom: 20px;
}

.token-hint {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
}

.token-guide {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.token-guide h4 {
  margin-bottom: 10px;
  color: #333;
}

.token-guide ol {
  margin: 0;
  padding-left: 20px;
}

.token-guide li {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

/* 后台界面 */
.admin-dashboard {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
}

.admin-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  z-index: 100;
}

.logo {
  font-size: 1.2rem;
  font-weight: 600;
  color: #409eff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #666;
}

/* 侧边栏 */
.admin-sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 200px;
  background: white;
  border-right: 1px solid #f0f0f0;
  padding-top: 20px;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin-bottom: 5px;
}

:deep(.el-menu-item.is-active) {
  background: #ecf5ff;
  color: #409eff;
  border-right: 3px solid #409eff;
}

/* 内容区域 */
.admin-content {
  flex: 1;
  margin-left: 200px;
  margin-top: 60px;
  padding: 20px;
  overflow-y: auto;
}

/* 深色模式 */
.admin-dark {
  background: #15202b;
}

.admin-dark .login-card {
  background: #192734;
}

.admin-dark .login-card h2,
.admin-dark .login-tip {
  color: #e5eaf3;
}

.admin-dark .admin-header,
.admin-dark .admin-sidebar {
  background: #192734;
  border-color: #3d4e60;
}

.admin-dark .user-info {
  color: #a3a6ad;
}

.admin-dark :deep(.el-menu) {
  background: #192734;
}

.admin-dark :deep(.el-menu-item) {
  color: #e5eaf3;
}

.admin-dark :deep(.el-menu-item.is-active) {
  background: #28384d;
  color: #409eff;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 180px;
  }
  
  .admin-content {
    margin-left: 180px;
  }
}
</style>