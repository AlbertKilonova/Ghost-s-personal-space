<template>
  <SectionCard title="时间线">
    <el-timeline>
      <el-timeline-item
        v-for="(exp, index) in experiences"
        :key="index"
        :timestamp="exp.time"
        :type="index === 0 ? 'primary' : ''"
        placement="top"
      >
        <TimelineContent :experience="exp" />
      </el-timeline-item>
    </el-timeline>
  </SectionCard>
</template>

<script setup>
/**
 * 时间线区块组件
 * 展示个人经历的时间线（倒序排列，最新的在上面）
 * @props {Array} experiences - 经历数组（会自动反转顺序显示）
 */
 
import SectionCard from '@/components/SectionCard.vue'
import TimelineContent from '@/components/TimelineContent.vue'

defineProps({
  experiences: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.el-timeline {
  padding-left: 10px;
}
</style>
