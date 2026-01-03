import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/Home.vue')
const Blog = () => import('@/views/Blog.vue')
const BlogDetail = () => import('@/views/BlogDetail.vue')
const Projects = () => import('@/views/Projects.vue')
const Contact = () => import('@/views/Contact.vue')
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFond.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { 
      title: '首页'
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: Blog,
    meta: { 
      title: '博客'
    }
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
    meta: { 
      title: '项目'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { 
      title: '联系'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { 
      title: '关于'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { 
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { 
        top: 0,
        behavior: 'smooth'
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Ghost的个人空间` : 'Ghost的个人空间'
  next()
})

export default router