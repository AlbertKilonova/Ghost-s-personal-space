<template>
  <div class="settings">
    <h3>网站设置</h3>
    
    <el-tabs v-model="activeTab" class="settings-tabs">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="settings" label-width="120px">
          <el-form-item label="网站标题">
            <el-input v-model="settings.title" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="settings.subtitle" />
          </el-form-item>
          <el-form-item label="头像URL">
            <el-input v-model="settings.avatar" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSettings">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="联系方式" name="contact">
        <el-form :model="settings.contact" label-width="120px">
          <el-form-item label="B站链接">
            <el-input v-model="settings.contact.bilibili" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="settings.contact.email" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSettings">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import GitHubAPI from '../utils/github-api'
import { loadAllPosts } from '@/utils/md-loader'

const github = new GitHubAPI()

const activeTab = ref('basic')
const settings = ref({
  title: '火柴人动画爱好者',
  subtitle: '用最简单的线条，做最喜欢的动画',
  avatar: '/avatar.jpg',
  contact: {
    bilibili: 'https://bilibili.com/uid/xxxxx',
    email: 'email@example.com'
  }
})

const loadSettings = async () => {
  try {
    const result = await github.getFile('src/config/settings.json')
    if (result) {
      settings.value = result.content
    }
  } catch (error) {
    ElMessage.warning('加载设置失败，使用默认值')
  }
}

const saveSettings = async () => {
  try {
    const content = JSON.stringify(settings.value, null, 2)
    const filePath = 'src/config/settings.json'
    
    const existingFile = await github.getFile(filePath)
    const sha = existingFile?.sha
    
    await github.updateFile(
      filePath,
      content,
      '更新网站设置',
      sha
    )
    
    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  }
}

loadSettings()
</script>

<style scoped>
.settings {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.settings h3 {
  margin-bottom: 20px;
  color: #333;
}

.settings-tabs {
  margin-top: 20px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
}
</style>