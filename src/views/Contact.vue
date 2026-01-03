<template>
  <div class="simple-contact">
    <div class="contact-card">
      <!-- 头部 -->
      <ContactHeader 
        title="交流联系"
        subtitle="想交朋友吗？"
      />
      
      <!-- 联系方式 -->
      <ContactMethods :methods="contactMethods" />
      
      <!-- 📢 替换为 Giscus 评论 -->
      <h3 style="margin-bottom: 20px; color: #333;">留言交流</h3>
      <GiscusComment />
    </div>
  </div>
</template>

<script setup>
import ContactHeader from '@/components/ContactHeader.vue'
import ContactMethods from '@/components/ContactMethods.vue'
import GiscusComment from '@/components/GiscusComment.vue'

const contactMethods = [
  {
    label: 'B站：',
    type: 'link',
    value: 'bilibili id',
    href: 'https://bilibili.com/uid/xxxxx'
  },
  {
    label: 'QQ：',
    type: 'link',
    value: 'QQ id',
    href: 'https://tieba.baidu.com/home?un=xxxxx'
  },
  {
    label: '邮箱：',
    type: 'text',
    value: 'email'
  }
]
</script>

<style scoped>
.simple-contact {
  padding: 40px 20px;
  max-width: 800px; /* 稍微加宽，适配评论区 */
  margin: 0 auto;
}

.contact-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
