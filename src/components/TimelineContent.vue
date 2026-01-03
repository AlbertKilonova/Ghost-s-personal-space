<template>
  <el-card class="timeline-content-card" shadow="hover">
    <div class="experience-header">
      <h3 class="experience-title">{{ experience.title }}</h3>
      <el-tag size="small" type="info">{{ experience.company }}</el-tag>
    </div>
    <p class="description">{{ experience.description }}</p>
  </el-card>
</template>

<script setup>
/**
 * 时间线内容卡片组件
 * 展示单个经历的详细内容
 * @props {Object} experience - 经历对象，包含title/company/description
 */

defineProps({
  experience: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.timeline-content-card {
  border-radius: 8px;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.experience-title {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.description {
  color: #777;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .experience-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 最新一项的样式 */
:deep(.el-timeline-item:last-child .el-timeline-item__tail) {
  display: none; /* 最后一条隐藏尾巴 */
}
</style>