<template>
  <div class="projects">
    <div class="projects-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>我的作品</h1>
        <p class="subtitle">做的小动画</p>
      </div>

      <!-- 作品列表 -->
      <ProjectList :projects="projects" />
    </div>
  </div>
</template>

<script setup>
/**
 * 作品展示页面主视图
 * 负责数据管理和组装子组件
 */

import { ref } from 'vue'
import ProjectList from '@/components/ProjectList.vue'

// 作品数据
const projects = ref([
  {
    id: 1,
    name: '《基础练习》火柴人日常',
    description: '最早期的练习作品，让火柴人走路、跑步、跳跃的基础动作合集，现在看来很稚嫩但很有纪念意义。',
    tech: ['Pivot', '早期作品', '30秒'],
    demo: 'https://bilibili.com/video/BV1xxxxxx'
  },
  {
    id: 2,
    name: '火柴人校园打斗',
    description: '尝试的第一个打斗动画，火柴人在教室里对决，动作设计参考了喜欢的动画片段。',
    tech: ['Pivot', '打斗', '1分钟'],
    demo: 'https://bilibili.com/video/BV2xxxxxx'
  },
  {
    id: 3,
    name: '《转场尝试》多场景动画',
    description: '学习如何在不同场景间过渡，加入了简单的特效和镜头移动，还在摸索中。',
    tech: ['Flash', '转场', '45秒'],
    demo: 'https://bilibili.com/video/BV3xxxxxx'
  },
  {
    id: 4,
    name: '手绘逐帧实验',
    description: '第一次尝试完全手绘逐帧，用手机一帧帧拍，过程很痛苦但看到小人动起来很有成就感。',
    tech: ['手绘', '逐帧', '实验', '20秒'],
    demo: 'https://bilibili.com/video/BV4xxxxxx'
  }
])
</script>

<style scoped>
.projects {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: left;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .projects {
    padding: 20px 15px;
  }
}
</style>
