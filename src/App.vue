<script setup lang="ts">
import TagInput from './components/TagInput.vue'
</script>

<template>
  <main class="page">
    <h1>Tag Input</h1>
    <TagInput />
  </main>
</template>

<style scoped>
.page {
  width: min(680px, 100%);
  margin: 3rem auto;
  padding: 1rem;
}

h1 {
  margin: 0 0 1rem;
  font-size: 1.75rem;
  letter-spacing: 0.02em;
}
</style>
