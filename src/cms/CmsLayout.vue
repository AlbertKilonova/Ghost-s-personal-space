<template>
  <div class="cms-layout">
    <!-- 左侧侧边栏 -->
    <div class="sidebar">
      <div class="logo">
        <span>GHOST CMS</span>
        <el-tag size="small" type="danger" effect="dark">DEV</el-tag>
      </div>
      
      <!-- 模式切换 -->
      <div class="mode-switch">
        <el-radio-group v-model="currentMode" fill="#409eff" style="width: 100%">
          <el-radio-button label="posts" style="width: 50%">文章</el-radio-button>
          <el-radio-button label="projects" style="width: 50%">作品</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 文件列表 -->
      <div class="list-header">
        <span>{{ files.length }} 个文件</span>
        <el-button link type="primary" @click="createNew">
          <el-icon><Plus /></el-icon> 新建
        </el-button>
      </div>

      <div class="file-list-container">
        <el-scrollbar>
          <el-empty v-if="files.length === 0" description="暂无文件" image-size="60" />
          
          <div 
            v-for="file in files" 
            :key="file.path"
            class="file-item"
            :class="{ active: currentFile === file.path }"
            @click="selectFile(file)"
          >
            <div class="file-info">
              <div class="file-name">{{ file.filename }}</div>
              <!-- 如果文件名包含 draft 或 临时标记，显示小点 -->
              <div class="file-time">{{ new Date(file.updatedAt).toLocaleString() }}</div>
            </div>
            
            <el-button 
              class="del-btn" 
              link 
              type="danger" 
              icon="Delete" 
              @click.stop="deleteFile(file)"
            />
          </div>
        </el-scrollbar>
      </div>

      <div class="exit-bar">
        <el-button type="info" plain block @click="$router.push('/')">返回博客首页</el-button>
      </div>
    </div>

    <!-- 右侧编辑区 -->
    <div class="main-content">
      <PostEditor 
        v-if="currentMode === 'posts'" 
        :file-path="currentFile"
        @refresh="fetchList"
      />
      <ProjectEditor 
        v-else 
        :file-path="currentFile"
        @refresh="fetchList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import PostEditor from './PostEditor.vue'
import ProjectEditor from './ProjectEditor.vue'

const currentMode = ref('posts') // 'posts' | 'projects'
const files = ref([])
const currentFile = ref(null)

// 1. 获取文件列表
const fetchList = async () => {
  try {
    const res = await fetch(`/__cms/list?type=${currentMode.value}`)
    files.value = await res.json()
  } catch (e) {
    ElMessage.error('无法连接到开发服务器')
  }
}

// 2. 监听模式切换
watch(currentMode, () => {
  currentFile.value = null // 切换模式时重置选中
  fetchList()
})

// 3. 选中文件
const selectFile = (file) => {
  currentFile.value = file.path
}

// 4. 新建文件
const createNew = () => {
  currentFile.value = null // null 代表新建状态
  ElMessage.info('已切换到新建模式，请在右侧填写内容并保存')
}

// 5. 删除文件
const deleteFile = async (file) => {
  try {
    await ElMessageBox.confirm(
      `确定要永久删除 ${file.filename} 吗？`,
      '高危操作',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    )
    
    await fetch('/__cms/delete', {
      method: 'POST',
      body: JSON.stringify({ filePath: file.path })
    })
    
    ElMessage.success('已删除')
    if (currentFile.value === file.path) currentFile.value = null
    fetchList()
  } catch (e) {
    // Cancelled
  }
}

onMounted(fetchList)
</script>

<style scoped>
.cms-layout { display: flex; height: 100vh; background: #f5f7fa; width: 100vw; overflow: hidden; }
.sidebar { width: 300px; background: white; border-right: 1px solid #e4e7ed; display: flex; flex-direction: column; flex-shrink: 0; }
.logo { height: 60px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: #303133; gap: 8px; border-bottom: 1px solid #f0f0f0; }
.mode-switch { padding: 15px; border-bottom: 1px solid #f0f0f0; }
.list-header { padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #909399; background: #fafafa; }
.file-list-container { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.file-item { padding: 12px 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f7fa; transition: all 0.2s; }
.file-item:hover { background: #ecf5ff; }
.file-item.active { background: #e6f7ff; border-right: 3px solid #409eff; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 0.95rem; color: #606266; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-time { font-size: 0.75rem; color: #c0c4cc; }
.del-btn { opacity: 0; transition: opacity 0.2s; }
.file-item:hover .del-btn { opacity: 1; }
.exit-bar { padding: 15px; border-top: 1px solid #eee; background: #fff; }
.main-content { flex: 1; height: 100%; overflow: hidden; background: white; display: flex; flex-direction: column; }
</style>