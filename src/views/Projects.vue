<template>
  <div class="projects">
    <div class="projects-container">
      <h1>我的作品</h1>
      <p class="subtitle">业余时间做的火柴人动画</p>
      
      <div class="project-list">
        <div class="project-item" v-for="project in projects" :key="project.id">
          <div class="project-main">
            <h3>{{ project.name }}</h3>
            <p class="description">{{ project.description }}</p>
            <div class="tech-tags">
              <span v-for="tech in project.tech" :key="tech">{{ tech }}</span>
            </div>
          </div>
          
          <div class="project-links">
            <a :href="project.demo" target="_blank" class="link demo">观看</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const projects = [
  {
    id: 1,
    name: '《基础练习》火柴人日常',
    description: '最早期的练习作品，让火柴人走路、跑步、跳跃的基础动作合集，现在看来很稚嫩但很有纪念意义。',
    tech: ['Pivot', '早期作品', '30秒'],
    demo: 'https://bilibili.com/video/BV1xxxxxx',
    comment: 'https://bilibili.com/video/BV1xxxxxx/#comment'
  },
  {
    id: 2,
    name: '火柴人校园打斗',
    description: '尝试的第一个打斗动画，火柴人在教室里对决，动作设计参考了喜欢的动画片段。',
    tech: ['Pivot', '打斗', '1分钟'],
    demo: 'https://bilibili.com/video/BV2xxxxxx',
    comment: 'https://bilibili.com/video/BV2xxxxxx/#comment'
  },
  {
    id: 3,
    name: '《转场尝试》多场景动画',
    description: '学习如何在不同场景间过渡，加入了简单的特效和镜头移动，还在摸索中。',
    tech: ['Flash', '转场', '45秒'],
    demo: 'https://bilibili.com/video/BV3xxxxxx',
    comment: null
  },
  {
    id: 4,
    name: '手绘逐帧实验',
    description: '第一次尝试完全手绘逐帧，用手机一帧帧拍，过程很痛苦但看到小人动起来很有成就感。',
    tech: ['手绘', '逐帧', '实验', '20秒'],
    demo: 'https://bilibili.com/video/BV4xxxxxx',
    comment: 'https://bilibili.com/video/BV4xxxxxx/#comment'
  }
]
</script>

<style scoped>
.projects {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.projects-container h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-item {
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: border-color 0.3s ease;
}

.project-item:hover {
  border-color: #409eff;
}

.project-main {
  flex: 1;
}

.project-main h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tags span {
  background: #f5f5f5;
  color: #666;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.project-links {
  display: flex;
  gap: 10px;
  margin-left: 20px;
}

.link {
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.demo {
  background: #409eff;
  color: white;
}

.demo:hover {
  background: #337ecc;
}

.github {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
}

.github:hover {
  background: #e8e8e8;
}

@media (max-width: 768px) {
  .project-item {
    flex-direction: column;
  }
  
  .project-links {
    margin-left: 0;
    margin-top: 15px;
    align-self: flex-start;
  }
}
</style>