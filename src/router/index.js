import { createRouter, createWebHistory } from 'vue-router'

// 路由组件懒加载
const Home = () => import('@/views/Home.vue')
const Blog = () => import('@/views/Blog.vue')
const BlogDetail = () => import('@/views/BlogDetail.vue')
const Projects = () => import('@/views/Projects.vue')
const Contact = () => import('@/views/Contact.vue')
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFond.vue')

// 基础路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: Blog,
    meta: { title: '博客' }
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: { title: '作品' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { title: '联系' }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { title: '关于' }
  },
  // 404 捕获
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: '页面未找到' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// ✨ CMS 路由注入 (仅开发环境) ✨
// 这里利用 Vite 的环境变量判断
if (import.meta.env.DEV) {
  router.addRoute({
    path: '/cms',
    name: 'CmsLayout',
    // 确保这里的路径对应你创建的 CMS 主布局文件
    component: () => import('@/cms/CmsLayout.vue'), 
    meta: { 
      title: 'CMS 控制台'
    }
  })
  
  console.log('[Router] CMS 路由已启用: /cms')
}

// 全局前置守卫：设置页面标题
router.beforeEach((to, from, next) => {
  // 可以从环境变量读取站点名称，也可以写死
  const siteTitle = import.meta.env.VITE_SITE_TITLE || 'Ghost的个人空间'
  
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${siteTitle}`
  } else {
    document.title = siteTitle
  }
  
  next()
})

export default router