<template>
  <div class="projects-page">
    <div class="page-header">
      <h1>作品集</h1>
      <p class="subtitle">不知道写啥，反正这里挺空的</p>
      
      <!-- 分类筛选 -->
      <div class="filter-tabs">
        <span 
          v-for="tab in tabs" 
          :key="tab.key" 
          class="tab-item"
          :class="{ active: currentTab === tab.key }"
          @click="currentTab = tab.key"
        >
          {{ tab.label }}
        </span>
      </div>
    </div>

    <el-skeleton v-if="loading" :rows="3" animated />
    
    <!-- 作品网格 -->
    <div v-else class="gallery-grid">
      <div 
        v-for="item in filteredProjects" 
        :key="item.id" 
        class="gallery-item"
        @click="openProject(item)"
      >
        <div class="cover-wrapper">
          <img :src="item.cover" :alt="item.name" loading="lazy" />
          <div class="overlay">
            <el-icon class="play-icon" v-if="item.type === 'video'"><VideoPlay /></el-icon>
            <el-icon class="view-icon" v-else><Picture /></el-icon>
          </div>
          <div class="item-type-tag">{{ item.type === 'video' ? '动画' : '插画' }}</div>
        </div>
        <div class="item-info">
          <h3 class="item-title">{{ item.name }}</h3>
          <div class="item-meta">
            <span class="date">{{ item.date }}</span>
            <div class="tech-tags">
               <span v-for="t in item.tech.slice(0, 2)" :key="t">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="null"
      width="80%"
      :before-close="handleClose"
      class="project-dialog"
      destroy-on-close
    >
      <div v-if="currentItem" class="dialog-content">
        <!-- 头部信息 -->
        <div class="dialog-header">
          <h2>{{ currentItem.name }}</h2>
          <div class="tags">
            <el-tag v-for="t in currentItem.tech" :key="t" size="small" effect="plain">{{ t }}</el-tag>
          </div>
        </div>

        <!-- 视频播放器 -->
        <div v-if="currentItem.type === 'video'" class="video-container">
          <!-- B站播放器 -->
          <iframe 
            v-if="currentItem.bilibiliId"
            :src="`//player.bilibili.com/player.html?bvid=${currentItem.bilibiliId}&page=1&high_quality=1`" 
            scrolling="no" 
            border="0" 
            frameborder="no" 
            framespacing="0" 
            allowfullscreen="true"
          ></iframe>
          <!-- 外部链接提示 -->
          <div v-else class="external-link-box">
             <p>此视频需跳转观看</p>
             <el-button type="primary" round @click="openExternal(currentItem.link)">
               前往观看 <el-icon class="el-icon--right"><TopRight /></el-icon>
             </el-button>
          </div>
        </div>

        <!-- 插画画廊 -->
        <div v-else class="art-gallery">
          <el-image 
            v-for="(img, idx) in currentItem.images" 
            :key="idx"
            :src="img" 
            :preview-src-list="currentItem.images"
            :initial-index="idx"
            fit="contain"
            class="art-image"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { VideoPlay, Picture, TopRight } from '@element-plus/icons-vue'
import { loadAllProjects } from '@/utils/project-loader'

const projects = ref([])
const loading = ref(true)
const currentTab = ref('all')
const dialogVisible = ref(false)
const currentItem = ref(null)

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'video', label: '动画' },
  { key: 'art', label: '插画' }
]

onMounted(async () => {
  projects.value = await loadAllProjects()
  loading.value = false
})

const filteredProjects = computed(() => {
  if (currentTab.value === 'all') return projects.value
  return projects.value.filter(p => p.type === currentTab.value)
})

const openProject = (item) => {
  currentItem.value = item
  dialogVisible.value = true
}

const handleClose = (done) => {
  // 关闭时清空，停止视频播放
  currentItem.value = null
  done()
}

const openExternal = (url) => {
  if(url) window.open(url, '_blank')
}
</script>

<style scoped>
.projects-page { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.page-header { text-align: center; margin-bottom: 50px; }
.page-header h1 { font-size: 2.5rem; margin-bottom: 10px; color: #333; }
.subtitle { color: #666; font-size: 1.1rem; }

/* 筛选 Tab */
.filter-tabs { display: flex; justify-content: center; gap: 30px; margin-top: 30px; }
.tab-item { cursor: pointer; padding: 8px 16px; font-weight: 500; color: #666; position: relative; transition: all 0.3s; }
.tab-item.active { color: #409eff; font-weight: bold; }
.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 20px; height: 3px; background: #409eff; border-radius: 2px; }

/* 网格布局 */
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
.gallery-item { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
.gallery-item:hover { transform: translateY(-5px); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }

.cover-wrapper { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; background: #f5f7fa; }
.cover-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.gallery-item:hover .cover-wrapper img { transform: scale(1.05); }

.overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); opacity: 0; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s; }
.gallery-item:hover .overlay { opacity: 1; }
.play-icon, .view-icon { font-size: 48px; color: white; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); }

.item-type-tag { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; backdrop-filter: blur(4px); }

.item-info { padding: 15px; }
.item-title { margin: 0 0 10px 0; font-size: 1.1rem; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-meta { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #999; }
.tech-tags span { background: #f0f2f5; padding: 2px 6px; border-radius: 4px; margin-left: 5px; }

/* 弹窗样式 */
.dialog-content { padding: 0 10px; }
.dialog-header { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
.dialog-header h2 { margin: 0 0 10px 0; font-size: 1.8rem; }
.tags { display: flex; gap: 8px; }

.video-container { width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
.video-container iframe { width: 100%; height: 100%; }

.external-link-box { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; gap: 15px; }

.art-gallery { display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; }
.art-image { width: 100%; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }

.project-desc { line-height: 1.8; color: #555; font-size: 1rem; white-space: pre-wrap; }

/* 响应式 */
@media (max-width: 768px) {
  .page-header h1 { font-size: 2rem; }
  .gallery-grid { grid-template-columns: 1fr; }
  .video-container { aspect-ratio: 4/3; }
}

/* 覆盖 Element Plus Dialog 样式使其更沉浸 */
:deep(.el-dialog) { border-radius: 16px; overflow: hidden; }
:deep(.el-dialog__header) { padding: 0; }
:deep(.el-dialog__body) { padding: 30px; max-height: 85vh; overflow-y: auto; }
</style>