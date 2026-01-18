<template>
  <div class="post-editor">
    <!-- 顶部工具栏 -->
    <div class="editor-header">
      <div class="header-left">
        <el-tag v-if="form.draft" type="warning" effect="dark">草稿</el-tag>
        <span class="file-path">{{ filePath || '新文章 (未保存)' }}</span>
      </div>
      <div class="header-actions">
        <el-button @click="autoGenerateExcerpt" size="small">生成摘要</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存文章</el-button>
      </div>
    </div>

    <!-- 元数据配置区域 (折叠面板) -->
    <el-collapse v-model="activeCollapse" class="meta-collapse">
      <el-collapse-item name="meta">
        <template #title>
          <div class="collapse-title">
            <el-icon><Setting /></el-icon> 属性设置 (标题、标签、分类)
          </div>
        </template>
        
        <el-form :model="form" label-width="70px" class="meta-form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="标题">
                <el-input v-model="form.title" placeholder="文章标题" @blur="handleTitleBlur" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件名">
                <el-input v-model="form.filename" placeholder="自动生成" :disabled="!!filePath">
                  <template #append>.md</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="日期">
                <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分类">
                <el-select 
                  v-model="form.category" 
                  allow-create 
                  filterable 
                  default-first-option
                  placeholder="选择或输入"
                  style="width: 100%"
                >
                  <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
               <el-form-item label="状态">
                 <el-switch v-model="form.draft" active-text="草稿" inactive-text="发布" />
               </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="标签">
            <el-select 
              v-model="form.tags" 
              multiple 
              allow-create 
              filterable 
              default-first-option
              placeholder="添加标签"
              style="width: 100%"
            >
              <el-option v-for="t in commonTags" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item>

          <el-form-item label="摘要">
            <el-input 
              v-model="form.excerpt" 
              type="textarea" 
              :rows="2" 
              placeholder="如果不填，保存时会自动从正文截取" 
            />
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- Vditor 编辑器容器 -->
    <div id="vditor" class="vditor-wrapper"></div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { parsePostContent, generateFilename, stripMarkdown } from './utils'

const props = defineProps(['filePath'])
const emit = defineEmits(['refresh'])

const activeCollapse = ref(['meta'])
const saving = ref(false)
const vditor = ref(null)

// 预设建议 (你可以随时添加)
const categories = ['技术笔记', '动画创作', '生活随笔', '开发日志']
const commonTags = ['Vue3', 'ElementPlus', '动画', 'Flash', 'Vite']

const form = reactive({
  title: '',
  filename: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  tags: [],
  excerpt: '',
  draft: false
})

// 初始化 Vditor
onMounted(() => {
  vditor.value = new Vditor('vditor', {
    height: 'calc(100vh - 280px)', // 减去头部和折叠面板的高度
    width: '100%',
    mode: 'wysiwyg', // 所见即所得模式
    placeholder: '在此处开始输入正文...',
    toolbarConfig: { pin: true },
    cache: { enable: false },
    preview: {
      hljs: { style: 'github' }
    },
    after: () => {
      // 如果组件加载时已经传入了 filePath，加载它
      if (props.filePath) loadFile(props.filePath)
    }
  })
})

// 监听文件切换
watch(() => props.filePath, (newPath) => {
  if (newPath) {
    loadFile(newPath)
  } else {
    resetForm()
  }
})

// 加载文件逻辑
const loadFile = async (path) => {
  try {
    const res = await fetch(`/__cms/read?path=${path}`)
    if (!res.ok) throw new Error('Load failed')
    
    const { content } = await res.json()
    const { attributes, body } = parsePostContent(content)

    // 填充表单
    form.title = attributes.title || ''
    form.date = attributes.date || new Date().toISOString().split('T')[0]
    form.category = attributes.category || ''
    form.tags = attributes.tags || []
    form.excerpt = attributes.excerpt || ''
    form.draft = !!attributes.draft
    form.filename = path.split('/').pop().replace('.md', '')
    
    // 填充编辑器
    vditor.value.setValue(body)
    
  } catch (e) {
    ElMessage.error('加载文件失败')
  }
}

// 重置逻辑
const resetForm = () => {
  form.title = ''
  form.filename = ''
  form.category = ''
  form.tags = []
  form.excerpt = ''
  form.draft = false
  if (vditor.value) vditor.value.setValue('')
}

// 自动生成文件名
const handleTitleBlur = () => {
  if (form.title && !form.filename && !props.filePath) {
    form.filename = generateFilename(form.date)
  }
}

// 自动生成摘要
const autoGenerateExcerpt = () => {
  if (!vditor.value) return
  const text = stripMarkdown(vditor.value.getValue())
  form.excerpt = text.substring(0, 120) + (text.length > 120 ? '...' : '')
  ElMessage.success('摘要已生成')
}

// 保存逻辑
const save = async () => {
  if (!form.title) return ElMessage.warning('标题不能为空')
  
  saving.value = true
  
  // 1. 如果没有摘要，自动生成
  if (!form.excerpt) autoGenerateExcerpt()
  // 2. 如果没有文件名，自动生成
  if (!form.filename) form.filename = generateFilename(form.date)

  // 3. 构建 Frontmatter + Body
  const tagsStr = form.tags.length ? `\ntags:\n${form.tags.map(t => `  - ${t}`).join('\n')}` : ''
  const mdContent = vditor.value.getValue()
  
  const fileContent = [
    '---',
    `title: ${form.title}`,
    `date: ${form.date}`,
    `category: ${form.category}`,
    tagsStr,
    `excerpt: ${form.excerpt}`,
    `draft: ${form.draft}`, // 写入 draft 字段
    '---',
    '',
    mdContent
  ].join('\n')

  const targetPath = `src/doc/${form.filename}.md`

  try {
    await fetch('/__cms/save', {
      method: 'POST',
      body: JSON.stringify({ filePath: targetPath, content: fileContent })
    })
    
    ElMessage.success('保存成功')
    emit('refresh') // 通知父组件刷新列表
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.post-editor { height: 100%; display: flex; flex-direction: column; }
.editor-header { padding: 12px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: white; }
.header-left { display: flex; align-items: center; gap: 10px; }
.file-path { color: #909399; font-family: monospace; font-size: 0.9rem; }
.collapse-title { display: flex; align-items: center; gap: 5px; font-weight: 500; }
.meta-collapse { border-bottom: 1px solid #eee; }
/* Vditor 样式覆盖 */
:deep(.vditor) { border: none; }
:deep(.vditor-toolbar) { background-color: #f9f9f9; border-bottom: 1px solid #eee; }
:deep(.vditor-content) { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
</style>