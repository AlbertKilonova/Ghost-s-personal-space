<template>
  <div class="contact-methods">
    <div 
      v-for="(method, index) in methods" 
      :key="index"
      class="method"
    >
      <span class="label">{{ method.label }}</span>
      
      <!-- 链接类型 -->
      <a 
        v-if="method.type === 'link'" 
        :href="method.href" 
        target="_blank" 
        class="value link"
      >
        {{ method.value }}
      </a>
      
      <!-- 文本类型 -->
      <span v-else class="value">{{ method.value }}</span>
    </div>
  </div>
</template>

<script setup>
// ✅ 修复：移除 validator，简化 defineProps
defineProps({
  methods: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.contact-methods {
  margin-bottom: 30px;
}

.method {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.method:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #555;
}

.value {
  color: #409eff;
  margin-left: 10px;
}

.link {
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
