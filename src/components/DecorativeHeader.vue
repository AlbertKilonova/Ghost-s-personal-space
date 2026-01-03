<template>
  <div id="title" class="decorative-title" ref="titleRef">
    <!-- 背景层 -->
    <div 
      class="background-layer" 
      ref="backgroundRef"
      :style="backgroundStyle"
    ></div>
    
    <!-- 标题文字 -->
    <div 
      class="title-content" 
      ref="titleContentRef"
      :style="contentStyle"
    >
      <div class="subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  subtitle: {
    type: String,
    default: '简介'
  }
})

// Refs
const titleRef = ref(null)
const backgroundRef = ref(null)
const titleContentRef = ref(null)

// 样式
const backgroundStyle = ref({
  transform: 'translateY(0px) scale(1)'
})

const contentStyle = ref({
  transform: 'translateY(0px)'
})

// 滚动监听
let ticking = false

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY
      const headerHeight = titleRef.value ? titleRef.value.offsetHeight : 280
      
      // 计算滚动比例 (0-1)
      const scrollRatio = Math.min(scrollY / (headerHeight * 0.5), 2)
      
      // 背景层效果：下移并轻微缩小
      const backgroundTranslateY = scrollRatio * 60 // 最大下移30px
      const backgroundScale = 1 - (scrollRatio * 0.1) // 最大缩小10%
      
      backgroundStyle.value = {
        transform: `translateY(${backgroundTranslateY}px) scale(${backgroundScale})`
      }
      
      // 文字效果：下移，但幅度比背景小，保持居中感
      const contentTranslateY = scrollRatio * 30 // 最大下移20px
      
      contentStyle.value = {
        transform: `translateY(${contentTranslateY}px)`
      }
      
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // 初始调用一次以设置正确的位置
  setTimeout(() => {
    handleScroll()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 标题容器 */
.decorative-title {
  position: relative;
  color: white;
  text-align: center;
  padding: 40px 20px;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 900; /* 低于导航栏的z-index */
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/background.jpg') no-repeat center center;
  background-size: cover;
  z-index: 1;
  transform-origin: center top;
  will-change: transform;
  transition: transform 0.2s ease-out;
}

/* 标题内容 */
.title-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
  mix-blend-mode: difference; /* 或 overlay/difference */
  will-change: transform;
  transition: transform 0.2s ease-out;
}

.title-content h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.title-content .subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .decorative-title {
    padding: 30px 15px;
    min-height: 180px;
  }
  
  .title-content h1 {
    font-size: 2.2rem;
  }
  
  .title-content .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .title-content h1 {
    font-size: 1.8rem;
  }
}
</style>