<template>
  <div class="contact-form">
    <h3 class="form-title">留言交流</h3>
    <p class="form-note">关于火柴人动画的问题、建议，或者只是想聊聊动画相关的话题</p>
    
    <el-input 
      v-model="message" 
      placeholder="可以聊的话题：&#10;1. 你用什么软件做动画？&#10;2. 有没有推荐的教程？&#10;3. 想合作做个小动画吗？&#10;4. 纯粹打招呼也行～" 
      type="textarea" 
      :rows="6" 
    />
    
    <el-button 
      type="primary" 
      @click="sendMessage" 
      class="submit-btn"
    >
      发送留言
    </el-button>
  </div>
</template>

<script setup>
/**
 * 留言表单组件
 * 处理用户留言输入和提交
 */

import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const message = ref('')

const sendMessage = () => {
  if (!message.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  ElMessage.success('留言已发送！我会找时间回复')
  message.value = ''
}
</script>

<style scoped>
.contact-form .form-title {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
}

.form-note {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.submit-btn {
  margin-top: 20px;
  width: 100%;
}
</style>