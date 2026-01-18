<script setup>
import DecorativeHeader from './components/DecorativeHeader.vue'
import FixedNavigation from './components/FixedNavigation.vue'
</script>

<template>
  <div id="app">
    <DecorativeHeader subtitle='内心深处是最美好的回忆' />
    <FixedNavigation title='GHOST' subtitle='再温柔一点，再坚强一点' />
    <main class="page-content">
      <router-view />
    </main>
  </div>
</template>
