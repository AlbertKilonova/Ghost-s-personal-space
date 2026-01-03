<template>
  <div class="project-manager">
    <!-- 工具栏 -->
    <div class="toolbar">
      <h3>作品管理</h3>
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        添加作品
      </el-button>
    </div>

    <!-- 加载状态 -->
    <el-skeleton v-if="loading" :rows="8" animated />
    
    <!-- 作品列表 -->
    <div v-else class="project-list">
      <el-table :data="projects" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="作品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="tech" label="技术标签" width="200">
          <template #default="{ row }">
            <el-tag 
              v-for="tag in row.tech" 
              :key="tag"
              size="small"
              effect="plain"
              style="margin-right: 5px;"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button :icon="View" size="small" @click="handleWatch(row.demo)" />
              <el-button :icon="Edit" size="small" @click="handleEdit(row)" />
              <el-button :icon="Delete" size="small" type="danger" @click="handleDelete(row)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑/添加弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑作品' : '添加作品'"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="作品名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：火柴人校园打斗" />
        </el-form-item>
        
        <el-form-item label="作品描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3"
            placeholder="介绍创作背景和技术特点"
          />
        </el-form-item>
        
        <el-form-item label="技术标签" prop="tech">
          <el-select
            v-model="form.tech"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="输入标签后按回车"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="演示链接" prop="demo">
          <el-input v-model="form.demo" placeholder="https://bilibili.com/video/BVxxxxx" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 作品管理组件
 * 提供增删改查功能
 */

import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, View } from '@element-plus/icons-vue'
import GitHubAPI from '@/admin/utils/github-api'

const github = new GitHubAPI()

const projects = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref()

const form = reactive({
  id: null,
  name: '',
  description: '',
  tech: [],
  demo: ''
})

const rules = {
  name: [{ required: true, message: '请输入作品名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入作品描述', trigger: 'blur' }],
  tech: [{ required: true, message: '请添加技术标签', trigger: 'change' }],
  demo: [{ required: true, message: '请输入演示链接', trigger: 'blur' }]
}

// 加载所有作品
const loadProjects = async () => {
  loading.value = true
  try {
    const files = await github.getDirectoryFiles('src/projects')
    const loadedProjects = []
    
    for (const file of files) {
      const result = await github.getFile(file.path)
      if (result) {
        loadedProjects.push({
          id: result.content.id || generateIdFromPath(file.path),
          ...result.content
        })
      }
    }
    
    projects.value = loadedProjects.sort((a, b) => a.id - b.id)
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 生成ID
const generateIdFromPath = (path) => {
  const filename = path.split('/').pop().replace('.json', '')
  const match = filename.match(/(\d+)/)
  return match ? parseInt(match[1]) : Date.now()
}

// 添加
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除作品 "${row.name}" 吗？`,
      '警告',
      { type: 'warning' }
    )
    
    const filePath = `src/projects/project-${row.id}.json`
    const file = await github.getFile(filePath)
    
    if (!file) throw new Error('文件不存在')
    
    await github.deleteFile(
      filePath,
      file.sha,
      `删除作品: ${row.name}`
    )
    
    ElMessage.success('删除成功')
    await loadProjects()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

// 提交（新增/更新）
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const projectData = {
      id: form.id || Date.now(),
      name: form.name,
      description: form.description,
      tech: form.tech,
      demo: form.demo
    }
    
    const filePath = `src/projects/project-${projectData.id}.json`
    const content = JSON.stringify(projectData, null, 2)
    
    let sha = null
    if (isEdit.value) {
      const existingFile = await github.getFile(filePath)
      if (existingFile) sha = existingFile.sha
    }
    
    await github.updateFile(
      filePath,
      content,
      isEdit.value ? `更新作品: ${form.name}` : `添加作品: ${form.name}`,
      sha
    )
    
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    dialogVisible.value = false
    await loadProjects()
  } catch (error) {
    ElMessage.error('提交失败：' + error.message)
  } finally {
    submitting.value = false
  }
}

// 观看
const handleWatch = (demoUrl) => {
  if (demoUrl) {
    window.open(demoUrl, '_blank')
  } else {
    ElMessage.warning('暂无演示链接')
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    tech: [],
    demo: ''
  })
  formRef.value?.clearValidate()
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.project-manager {
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
  color: #333;
}

.project-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

:deep(.el-table) {
  --el-table-border-color: #f0f0f0;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #333;
  font-weight: 500;
}

:deep(.el-table td) {
  color: #666;
}
</style>