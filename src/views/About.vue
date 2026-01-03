<template>
  <div class="about-page">
    <!-- 基本信息卡片 -->
    <ProfileCard 
      name="GHOST"
      title="再温柔一点，再坚强一点"
      location="-幽灵猫-"
      avatar="/avatar.jpg"
    />

    <el-space direction="vertical" :size="30" style="width: 100%; margin-top: 20px;">
      
      <!-- 关于我 -->
      <SectionCard title="关于我">
        <div class="content">
          <p>
            我是幽灵
          </p>
        </div>
      </SectionCard>

      <!-- 技能标签 -->
      <SkillSection :skill-data="skillData" />

      <!-- 时间线 -->
      <TimelineSection :experiences="experiences" />

    </el-space>
  </div>
</template>

<script setup>
/**
 * About视图组件 - 个人主页
 * 负责组装所有子组件，展示个人信息、技能和时间线
 */

import ProfileCard from '@/components/ProfileCard.vue'
import SectionCard from '@/components/SectionCard.vue'
import SkillSection from '@/components/SkillSection.vue'
import TimelineSection from '@/components/TimelineSection.vue'

// 技能数据 - 按分类组织
const skillData = [
  {
    category: '动画软件',
    skills: ['Flash/Animate', '咚动', 'Photoshop', '画世界', 'FC']
  },
  {
    category: '其他',
    skills: ['动作设计', '简易分镜', '基础音效', '社区互动', '自学摸索']
  }
]

// 时间线数据 - 按时间倒序排列
const experiences = [
  {
    title: '积累',
    time: 'xxxx-xxxx',
    company: '积累经验',
    description: '成为真正的大佬'
  },
  {
    title: '瓶颈',
    time: 'xxxx-xxxx',
    company: '瓶颈期',
    description: '小有名气的动画大蛇'
  },
  {
    title: '入门',
    time: 'xxxx-xxxx',
    company: '入门动画',
    description: '刚入门的小萌新'
  }
]
</script>

<style scoped>
.about-page {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
}
</style>
