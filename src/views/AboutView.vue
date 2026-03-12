<script setup>
import { useHead } from '@unhead/vue'

useHead({
  title: 'About | Andrew Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Learn more about Andrew Irawan and this portfolio project built with Vue.js.'
    }
  ]
})
</script>

<template>
  <div class="about">
    <h1>About Me</h1>
    <p>This is the portfolio for showcasing my Vue.js projects using a neat MVC structure.</p>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
