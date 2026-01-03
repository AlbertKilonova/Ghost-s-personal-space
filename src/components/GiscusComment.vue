<template>
  <div class="giscus-container">
    <Giscus
      id="comments"
      repo="AlbertKilonova/Ghost-s-personal-space"
      repoId="R_kgDOQzNBdA"
      category="Announcements"
      categoryId="DIC_kwDOQzNBdM4C0id6"
      mapping="title"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      theme="https://giscus.app/themes/custom_example.css"
      lang="zh-CN"
      loading="lazy"
      crossorigin="anonymous"
    />
  </div>
</template>

<script setup>
import Giscus from '@giscus/vue'
</script>

<style scoped>
.giscus-container {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
}
</style>
