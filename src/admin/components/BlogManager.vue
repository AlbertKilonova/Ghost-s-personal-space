<template>
  <div class="blog-manager">
    <div class="toolbar">
      <h3>博客管理</h3>
      <div class="actions">
        <el-upload
          :action="uploadUrl"
          :headers="uploadHeaders"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          accept=".md"
          :show-file-list="false"
        >
          <el-button type="primary" :icon="Upload">上传MD文件</el-button>
        </el-upload>
      </div>
    </div>

    <el-skeleton v-if="loading" :rows="8" animated />
    
    <el-table v-else :data="posts" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column label="标签" width="180">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 5px;">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button :icon="View" size="small" @click="handlePreview(row)" />
            <el-button :icon="Delete" size="small" type="danger" @click="handleDelete(row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Delete, Upload } from '@element-plus/icons-vue'
import { loadAllPosts } from '@/utils/md-loader'
import GitHubAPI from '../utils/github-api'

const github = new GitHubAPI()

const posts = ref([])
const loading = ref(false)

// GitHub 上传配置
const uploadUrl = `https://api.github.com/repos/AlbertKilonova/Ghost-s-personal-space/contents/src/doc/`
const uploadHeaders = {
  Authorization: `token ${localStorage.getItem('github_token')}`,
  Accept: 'application/vnd.github.v3+json'
}

const loadPosts = async () => {
  loading.value = true
  try {
    posts.value = await loadAllPosts()
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleUpload = (content, filename) => {
  const filePath = `src/doc/${filename}`
  const message = `上传博客: ${filename}`
  
  return github.updateFile(filePath, content, message)
}

const beforeUpload = (file) => {
  const isMd = file.type === 'text/markdown' || file.name.endsWith('.md')
  if (!isMd) {
    ElMessage.error('只能上传 .md 文件！')
    return false
  }
  return true
}

const handleUploadSuccess = (response, file) => {
  ElMessage.success(`上传成功：${file.name}`)
  loadPosts()
}

const handleUploadError = (error) => {
  ElMessage.error('上传失败：' + error.message)
}

const handlePreview = (post) => {
  window.open(`/blog/${post.id}`, '_blank')
}

const handleDelete = async (post) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章 "${post.title}" 吗？`,
      '警告',
      { type: 'warning' }
    )
    
    const filePath = `src/doc/${post.id}.md`
    
    // 注意：需要实现获取文件SHA的逻辑
    ElMessage.info('博客删除功能需要进一步实现')
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.blog-manager {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar h3 {
  margin: 0;
}

:deep(.el-table) {
  --el-table-border-color: #f0f0f0;
}
</style>