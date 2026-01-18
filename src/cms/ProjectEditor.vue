<template>
  <div class="project-editor">
    <div class="header">
      <div class="title">
        <el-icon><VideoCamera /></el-icon> 作品编辑
      </div>
      <el-button type="primary" size="large" :loading="saving" @click="save">
        <el-icon style="margin-right:5px"><Check /></el-icon> 保存发布
      </el-button>
    </div>

    <div class="form-wrapper">
      <el-form :model="form" label-position="top" size="large" class="project-form">
        
        <el-alert v-if="filePath" type="info" :title="`正在编辑: ${filePath}`" :closable="false" style="margin-bottom:20px" />

        <!-- 顶部基础信息 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作品类型">
              <el-radio-group v-model="form.type" fill="#409eff">
                <el-radio-button label="video">动画视频</el-radio-button>
                <el-radio-button label="art">插画/图片</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布日期">
               <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="作品标题" required>
          <el-input v-model="form.name" placeholder="给作品起个名字" />
        </el-form-item>

        <!-- ✅✅✅ 核心修改：支持拖拽上传的封面区 ✅✅✅ -->
        <el-form-item label="封面图片 (拖拽图片到此处，或点击上传)" required>
          <div 
            class="upload-area" 
            :class="{ 'is-dragging': isDraggingCover }"
            @click="triggerUpload('cover')"
            @dragover.prevent="isDraggingCover = true"
            @dragleave.prevent="isDraggingCover = false"
            @drop.prevent="(e) => handleDrop(e, 'cover')"
          >
            <img v-if="form.cover" :src="form.cover" class="cover-preview" />
            <div v-else class="upload-placeholder">
              <el-icon class="icon"><Plus /></el-icon>
              <span>{{ isDraggingCover ? '松开鼠标上传' : '点击或拖拽图片到这里' }}</span>
            </div>
          </div>
        </el-form-item>

        <!-- 动画专属 -->
        <template v-if="form.type === 'video'">
          <el-form-item label="B站 BV号">
            <el-input v-model="form.bilibiliId" placeholder="例如: BV1GJ411x7h7">
              <template #prepend>BV</template>
            </el-input>
            <div class="tip">填写BV号可直接在弹窗播放。</div>
          </el-form-item>
          
          <el-form-item label="或 外部链接">
            <el-input v-model="form.link" placeholder="如果不是B站，填跳转链接" />
          </el-form-item>
        </template>

        <!-- 插画专属 -->
        <template v-else>
          <el-form-item label="作品图集 (支持拖拽上传)">
            <div class="gallery-upload-list">
              <div v-for="(img, index) in form.images" :key="index" class="gallery-item">
                <img :src="img" />
                <div class="del-mask" @click="removeImage(index)">
                  <el-icon><Delete /></el-icon>
                </div>
              </div>
              
              <!-- 图集上传按钮，同样支持拖拽 -->
              <div 
                class="gallery-add-btn" 
                :class="{ 'is-dragging': isDraggingGallery }"
                @click="triggerUpload('gallery')"
                @dragover.prevent="isDraggingGallery = true"
                @dragleave.prevent="isDraggingGallery = false"
                @drop.prevent="(e) => handleDrop(e, 'gallery')"
              >
                <el-icon><Plus /></el-icon>
                <span>{{ isDraggingGallery ? '松手' : '添加' }}</span>
              </div>
            </div>
          </el-form-item>
        </template>

        <el-form-item label="创作工具">
          <el-select
            v-model="form.tech"
            multiple
            allow-create
            filterable
            default-first-option
            placeholder="Flash, CSP, AE..."
            style="width: 100%"
          >
            <el-option v-for="t in techOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>

      </el-form>
    </div>

    <!-- 隐藏的文件输入框，用于点击上传 -->
    <input 
      type="file" 
      ref="fileInputRef" 
      style="display: none" 
      accept="image/*"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { VideoCamera, Plus, Delete, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps(['filePath'])
const emit = defineEmits(['refresh'])

// 状态
const saving = ref(false)
const fileInputRef = ref(null)
const uploadTarget = ref('') // 'cover' | 'gallery'
// 拖拽状态
const isDraggingCover = ref(false)
const isDraggingGallery = ref(false)

const techOptions = ['Flash/Animate', 'After Effects', 'Premiere', 'Clip Studio Paint', 'Photoshop', 'Sai']

const form = reactive({
  id: '',
  type: 'video',
  name: '',
  cover: '',
  bilibiliId: '',
  link: '',
  images: [],
  tech: [],
  date: new Date().toISOString().split('T')[0]
})

watch(() => props.filePath, (newPath) => {
  if (newPath) loadFile(newPath)
  else resetForm()
})

const resetForm = () => {
  form.id = ''
  form.type = 'video'
  form.name = ''
  form.cover = ''
  form.bilibiliId = ''
  form.link = ''
  form.images = []
  form.tech = []
  form.date = new Date().toISOString().split('T')[0]
}

// ==========================================
// 🚀 核心上传逻辑 (统一处理点击和拖拽)
// ==========================================

// 1. 点击触发
const triggerUpload = (target) => {
  uploadTarget.value = target
  fileInputRef.value.click()
}

// 2. 拖拽触发 (松开鼠标时)
const handleDrop = (e, target) => {
  // 重置样式状态
  isDraggingCover.value = false
  isDraggingGallery.value = false
  
  const files = e.dataTransfer.files
  if (files.length > 0) {
    uploadTarget.value = target
    // 调用统一上传函数，只取第一个文件（图集也可以扩展支持多选，这里先只取一个）
    processUpload(files[0])
  }
}

// 3. input change 触发
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) processUpload(file)
  e.target.value = '' // 清空以允许重复选择
}

// 4. 真正执行上传
const processUpload = (file) => {
  // 检查是否是图片
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件')
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  
  reader.onload = async () => {
    const base64Content = reader.result
    
    try {
      // 发送到 Vite 后端 (后端会自动重命名并保存到 public/uploads)
      const res = await fetch('/__cms/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          content: base64Content
        })
      })
      
      const result = await res.json()
      
      if (result.success) {
        // ✅ 自动回填
        if (uploadTarget.value === 'cover') {
          form.cover = result.url
        } else if (uploadTarget.value === 'gallery') {
          form.images.push(result.url)
        }
        ElMessage.success('图片已自动处理并上传')
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      ElMessage.error('上传出错了')
      console.error(err)
    }
  }
}

// ==========================================

const removeImage = (index) => form.images.splice(index, 1)

const loadFile = async (path) => {
  try {
    const res = await fetch(`/__cms/read?path=${path}`)
    const { content } = await res.json()
    const data = JSON.parse(content)
    
    form.id = path.split('/').pop().replace('.json', '')
    Object.assign(form, data)
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

const save = async () => {
  if (!form.name) return ElMessage.warning('请填写作品标题')
  if (!form.cover) return ElMessage.warning('封面图呢？快拖一张进来！')
  
  saving.value = true
  
  // 自动生成 ID (如果不存在)
  if (!form.id) {
    form.id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  }
  
  const targetPath = `src/projects/${form.id}.json`
  
  const saveData = {
    id: form.id,
    type: form.type,
    name: form.name,
    cover: form.cover,
    tech: form.tech,
    date: form.date,
    ...(form.type === 'video' ? { bilibiliId: form.bilibiliId, link: form.link } : { images: form.images })
  }

  try {
    await fetch('/__cms/save', {
      method: 'POST',
      body: JSON.stringify({ filePath: targetPath, content: JSON.stringify(saveData, null, 2) })
    })
    ElMessage.success('发布成功！')
    emit('refresh')
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (props.filePath) loadFile(props.filePath)
  else resetForm()
})
</script>

<style scoped>
.project-editor { height: 100%; display: flex; flex-direction: column; background: white; }
.header { padding: 15px 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 1.1rem; font-weight: bold; display: flex; gap: 10px; align-items: center; }
.form-wrapper { flex: 1; padding: 40px; overflow-y: auto; background: #f8f9fa; }
.project-form { max-width: 650px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }

/* 上传区域样式 */
.upload-area { 
  width: 100%; 
  aspect-ratio: 16/9; 
  background: #fafafa; 
  border: 2px dashed #dde0e6; 
  border-radius: 8px; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
  transition: all 0.2s; 
}
/* 拖拽激活样式 */
.upload-area.is-dragging {
  border-color: #409eff;
  background-color: #ecf5ff;
  transform: scale(1.02);
}
.upload-area:hover { border-color: #409eff; }

.upload-placeholder { display: flex; flex-direction: column; align-items: center; color: #909399; pointer-events: none; }
.upload-placeholder .icon { font-size: 32px; margin-bottom: 8px; }
.cover-preview { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }

/* 图集样式 */
.gallery-upload-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
.gallery-item { position: relative; aspect-ratio: 1; border-radius: 6px; overflow: hidden; border: 1px solid #eee; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.del-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; cursor: pointer; color: white; }
.gallery-item:hover .del-mask { opacity: 1; }

.gallery-add-btn { aspect-ratio: 1; border: 1px dashed #dcdfe6; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: #909399; transition: all 0.2s; }
.gallery-add-btn:hover { border-color: #409eff; color: #409eff; }
.gallery-add-btn.is-dragging { border-color: #409eff; background: #ecf5ff; transform: scale(1.05); }

.tip { font-size: 12px; color: #999; margin-top: 5px; }
</style>