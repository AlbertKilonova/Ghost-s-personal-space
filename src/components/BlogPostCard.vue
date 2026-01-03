<template>
  <el-card class="blog-post-card" shadow="hover">
    <!-- 点击卡片跳转详情页 -->
    <div @click="goToDetail" class="card-content">
      <div class="post-header">
        <h3 class="post-title">{{ post.title }}</h3>
        <span class="post-date">{{ post.date }}</span>
      </div>

      <p class="post-excerpt">{{ post.excerpt }}</p>

      <div class="post-footer">
        <el-tag size="small" type="" class="category-tag">
          {{ post.category }}
        </el-tag>

        <div class="tags-group">
          <el-tag
            v-for="tag in post.tags"
            :key="tag"
            size="small"
            type="info"
            effect="plain"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 接收文章数据
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 跳转到详情页
const goToDetail = () => {
  router.push(`/blog/${props.post.id}`)
}
</script>

<style scoped>
.card-content {
  cursor: pointer;
}

/* 原有的样式保持不变... */
.post-title {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  flex: 1;
  font-weight: 500;
}

.post-date {
  color: #888;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: 15px;
}

.post-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-tag {
  background: #f0f7ff !important;
  color: #409eff !important;
  border: none !important;
}

.tags-group {
  display: flex;
  gap: 8px;
}

.tag-item {
  border-radius: 12px !important;
}

@media (max-width: 768px) {
  .post-header {
    flex-direction: column;
  }
  
  .post-date {
    margin-left: 0;
    margin-top: 5px;
  }
  
  .post-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
