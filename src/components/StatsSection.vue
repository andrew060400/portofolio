<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({
  stats: Array
})

const statsTarget = ref(null)
const isVisible = ref(false)

useIntersectionObserver(statsTarget, ([{ isIntersecting }]) => {
  if (isIntersecting) isVisible.value = true
}, { threshold: 0.2 })
</script>

<template>
  <section class="stats-section" ref="statsTarget">
    <div 
        class="stats-header reveal-hidden"
        :class="{ 'reveal-visible': isVisible }"
    >
      <h2 class="section-title">STATS</h2>
    </div>

    <div class="stats-grid">
      <div 
        class="stat-item reveal-hidden" 
        v-for="(stat, index) in stats" 
        :key="index"
        :class="{ 'reveal-visible': isVisible }"
        :style="{ transitionDelay: `${index * 50}ms` }"
      >
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: start;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 4rem;
}

.section-title {
  font-size: clamp(3rem, 6vw, 4rem);
  text-transform: uppercase;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 2rem;
  column-gap: 4rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  line-height: 1.4;
  text-transform: uppercase;
}

@media (max-width: 900px) {
  .stats-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
