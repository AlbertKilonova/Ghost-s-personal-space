<template>
  <header class="navigation-header" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <!-- 左侧Logo和头像区域 -->
      <div class="logo-area">
        <!-- 文字版本（初始显示） -->
        <div 
          class="logo-text" 
          ref="logoTextRef"
        >
          <router-link to="/" class="site-title-link">
            <h1 class="site-title">{{ title }}</h1>
            <p class="site-subtitle">{{ subtitle }}</p>
          </router-link>
        </div>
        
        <!-- 头像版本（滚动后显示） -->
        <div 
          class="logo-avatar" 
          ref="logoAvatarRef"
        >
          <div 
            class="avatar-wrapper"
            @click="scrollToTop"
            :title="'滚动回顶部'"
            style="cursor: pointer;"
          >
            <img 
              :src="avatarUrl" 
              alt="GHOST" 
              class="avatar-image"
              @error="handleAvatarError"
            />
            <div 
              v-if="avatarLoadFailed" 
              class="avatar-fallback"
            >
              <span class="fallback-text">G</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：桌面端导航菜单 -->
      <nav class="desktop-nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          custom
          v-slot="{ navigate, isActive }"
        >
          <a
            class="nav-link"
            :class="{ 'active': isActive }"
            @click="navigate"
            @keypress.enter="navigate"
          >
            <el-icon class="nav-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="nav-text">{{ item.label }}</span>
          </a>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { House, Notebook, Promotion, Message, User } from '@element-plus/icons-vue'
import { animate } from 'animejs'

const props = defineProps({
  title: {
    type: String,
    default: 'GHOST'
  },
  subtitle: {
    type: String,
    default: '幽灵'
  }
})

const router = useRouter()
const route = useRoute()

// 1. 导航项配置 - 对应路由的name
const navItems = ref([
  { name: 'home', label: '首页', icon: House },
  { name: 'blog', label: '博客', icon: Notebook },
  { name: 'projects', label: '作品', icon: Promotion },
  { name: 'contact', label: '联系', icon: Message },
  { name: 'about', label: '关于', icon: User }
])

// 2. 响应式状态
const isScrolled = ref(false)
const showAvatar = ref(false)
const avatarLoadFailed = ref(false)

// 3. Refs
const logoTextRef = ref(null)
const logoAvatarRef = ref(null)

// 4. 动画实例
let logoAnimation = null
let avatarImageAnimation = null
let lastAnimationType = null

// 5. 头像配置
const avatarUrl = ref('/avatar.jpg')
const fallbackAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNmMGYyZjUiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+RzwvdGV4dD48L3N2Zz4='

// 6. 滚动监听
let lastScrollY = 0
let ticking = false

const handleScroll = () => {
  lastScrollY = window.scrollY
  
  if (!ticking) {
    requestAnimationFrame(() => {
      isScrolled.value = lastScrollY > 10
      
      const headerHeight = 220
      const shouldShowAvatar = lastScrollY > headerHeight * 0.8
      
      if (shouldShowAvatar !== showAvatar.value) {
        showAvatar.value = shouldShowAvatar
        animateLogoTransition(shouldShowAvatar)
      }
      
      ticking = false
    })
    ticking = true
  }
}

// 7. 动画切换函数 - 调整文字动画使其更自然
const animateLogoTransition = (showAvatarMode) => {
  nextTick(() => {
    if (!logoTextRef.value || !logoAvatarRef.value) return
    
    // 防止重复动画
    if (lastAnimationType === showAvatarMode) return
    lastAnimationType = showAvatarMode
    
    // 停止之前的动画
    if (logoAnimation) {
      logoAnimation.pause()
    }
    if (avatarImageAnimation) {
      avatarImageAnimation.pause()
    }
    
    if (showAvatarMode) {
      // 隐藏文字，显示头像（Q弹效果）
      console.log('显示头像，隐藏文字')
      
      // 文字消失动画 - 调小动画幅度
      logoAnimation = animate(logoTextRef.value, {
        opacity: [1, 0],
        scale: [1, 0.9],
        translateY: ['0%', '-5%'],
        duration: 300,
        easing: 'easeOutSine',
        complete: () => {
          logoTextRef.value.style.display = 'none'
        }
      })
      
      // 头像出现动画（适度Q弹效果）
      setTimeout(() => {
        logoAvatarRef.value.style.display = 'flex'
        logoAvatarRef.value.style.opacity = '0'
        logoAvatarRef.value.style.transform = 'translateY(-50%) scale(0.5)'
        
        logoAnimation = animate(logoAvatarRef.value, {
          opacity: [0, 1],
          scale: [0.5, 1.1, 0.98, 1], // 减少超调幅度
          translateY: ['-50%', '-50%'],
          duration: 500,
          easing: 'spring(1, 80, 10, 0)'
        })
        
        // 头像图像单独的弹性效果（减少幅度）
        const avatarImage = logoAvatarRef.value.querySelector('.avatar-image')
        if (avatarImage) {
          avatarImageAnimation = animate(avatarImage, {
            scale: [1, 1.08, 1],
            rotate: [0, 5, -2, 0], // 减少旋转幅度
            duration: 600,
            easing: 'spring(1.1, 80, 10, 0)',
            delay: 50
          })
        }
      }, 150)
    } else {
      // 隐藏头像，显示文字（减少动画幅度）
      console.log('显示文字，隐藏头像')
      
      // 头像消失动画
      logoAnimation = animate(logoAvatarRef.value, {
        opacity: [1, 0],
        scale: [1, 0.5],
        translateY: ['-50%', '-50%'],
        duration: 250,
        easing: 'easeOutSine',
        complete: () => {
          logoAvatarRef.value.style.display = 'none'
        }
      })
      
      // 文字出现动画（大幅减少弹跳效果）
      setTimeout(() => {
        logoTextRef.value.style.display = 'flex'
        logoTextRef.value.style.opacity = '0'
        logoTextRef.value.style.transform = 'scale(0.9)'
        
        logoAnimation = animate(logoTextRef.value, {
          opacity: [0, 1],
          scale: [0.9, 1.05, 1], // 大幅减少缩放幅度
          duration: 400,
          easing: 'spring(1.05, 100, 10, 0)' // 减少弹性强度
        })
      }, 100)
    }
  })
}

// 8. 头像加载失败处理
const handleAvatarError = () => {
  console.log('头像加载失败，显示优雅占位符')
  avatarLoadFailed.value = true
  
  const img = new Image()
  img.onload = () => {
    avatarUrl.value = fallbackAvatar
    avatarLoadFailed.value = false
  }
  img.onerror = () => {
    avatarLoadFailed.value = true
  }
  img.src = fallbackAvatar
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollToTop = () => {
  const startPosition = window.pageYOffset
  const duration = 800
  
  const startTime = performance.now()
  
  const scrollAnimation = (currentTime) => {
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    
    const easeInOutCubic = t => t < 0.5 
      ? 4 * t * t * t 
      : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    
    window.scrollTo(0, startPosition * (1 - easeInOutCubic(progress)))
    
    if (progress < 1) {
      requestAnimationFrame(scrollAnimation)
    }
  }
  
  requestAnimationFrame(scrollAnimation)
}
</script>

<style scoped>
/* 【核心】固定导航栏的样式 */
.navigation-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navigation-header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo区域 */
.logo-area {
  position: relative;
  width: 180px;
  height: 64px;
  display: flex;
  align-items: center;
}

.site-title-link {
  text-decoration: none;
  color: inherit;
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  transform-origin: center;
  will-change: transform, opacity;
}

.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  line-height: 1.2;
  transition: color 0.3s ease;
  display: inline-block;
  transform-origin: left center;
  will-change: transform;
}

.site-title-link:hover .site-title {
  color: var(--primary-color-dark);
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.site-subtitle {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  transform-origin: left center;
  will-change: transform;
}

/* 头像区域 */
.logo-avatar {
  position: absolute;
  left: 0;
  top: 50%;
  display: none;
  opacity: 0;
  transform-origin: center center;
  will-change: transform, opacity;
}

.avatar-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  transform-origin: center;
  will-change: transform;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  transition: all 0.3s ease;
  transform-origin: center;
  will-change: transform;
}

.avatar-image:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
}

/* 优雅的加载失败占位符 */
.avatar-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform-origin: center;
  will-change: transform;
}

.fallback-text {
  font-size: 18px;
  font-weight: 600;
  color: #6c757d;
}

/* 导航菜单 */
.desktop-nav {
  display: flex;
  gap: 8px;
}

/* 导航链接 */
.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  background: transparent;
  border: none;
  transition: all 0.2s ease;
  transform-origin: center;
  will-change: transform;
}

.nav-link:hover {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  transform: scale(1.05);
}

.nav-link.active {
  color: var(--primary-color);
  font-weight: 600;
  background: rgba(64, 158, 255, 0.08);
}

.nav-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
  will-change: transform;
}

.nav-link.active .nav-icon {
  transform: translateY(-1px) scale(1.1);
}

.nav-text {
  font-size: 0.95rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    height: 56px;
    padding: 0 16px;
  }
  
  .logo-area {
    width: 140px;
    height: 56px;
  }
  
  .site-title {
    font-size: 1.3rem;
  }
  
  .site-subtitle {
    display: none;
  }
  
  .avatar-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-link {
    padding: 8px;
  }
  
  .nav-icon {
    font-size: 1.2rem;
  }
}
</style>