<template>
  <SectionCard title="会用的工具">
    <div class="skill-section">
      <div 
        v-for="(category, index) in skillData" 
        :key="index"
        class="skill-category"
      >
        <h3 class="category-title">{{ category.category }}</h3>
        
        <div class="skill-tags">
          <el-tag
            v-for="skill in category.skills"
            :key="skill"
            type="info"
            effect="light"
            round
            class="skill-tag"
          >
            {{ skill }}
          </el-tag>
        </div>
      </div>
    </div>
  </SectionCard>
</template>

<script setup>
/**
 * 技能展示区块组件
 * 展示按分类组织的技能标签
 * @props {Array} skillData - 技能数据数组，每项包含category和skills
 */
 
 import SectionCard from '@/components/SectionCard.vue'

defineProps({
  skillData: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.skill-category {
  margin-bottom: 20px;
}

.skill-category:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 10px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #f0f7ff !important;
  color: #409eff !important;
  border: none !important;
}
</style>