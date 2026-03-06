<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({
  projects: Array
})

const headerTarget = ref(null)
const isHeaderVisible = ref(false)

useIntersectionObserver(headerTarget, ([{ isIntersecting }]) => {
  if (isIntersecting) isHeaderVisible.value = true
}, { threshold: 0.3 })

// For list items, we can handle them individually but for simplicity we rely on native CSS loops or a single wrapper observer
// Using a separate observer array simplifies things slightly without external wrapper libraries
const projectTargets = ref([])
const visibleProjects = ref([])

const setProjectRef = (el, index) => {
  if (el) {
    projectTargets.value[index] = el
    useIntersectionObserver(el, ([{ isIntersecting }]) => {
        if (isIntersecting && !visibleProjects.value.includes(index)) {
            visibleProjects.value.push(index)
        }
    }, { threshold: 0.2 })
  }
}
</script>

<template>
  <section class="portfolio-section">
    <div 
        class="header-split reveal-hidden" 
        ref="headerTarget"
        :class="{ 'reveal-visible': isHeaderVisible }"
    >
      <h2 class="section-title">FEATURED<br/>WORK</h2>
      <div class="line-decorator"></div>
    </div>

    <div class="projects-list">
      <div 
        class="project-item" 
        v-for="(project, index) in projects" 
        :key="project.id"
        :ref="(el) => setProjectRef(el, index)"
      >
        <div 
            class="project-info reveal-hidden"
            :class="{ 'reveal-visible': visibleProjects.includes(index) }"
        >
          <h3>{{ project.title }}</h3>
          <p>{{ project.subtitle }}</p>
          <div class="arrow-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 7L17 17M17 17V7M17 17H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div 
            class="project-image reveal-scale-hidden delay-200"
            :class="{ 'reveal-scale-visible': visibleProjects.includes(index) }"
        >
          <img :src="project.image" :alt="project.title" class="img-rounded" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.header-split {
  display: flex;
  align-items: center;
  gap: 4rem;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(3rem, 8vw, 5rem);
  text-transform: uppercase;
  margin: 0;
  line-height: 1;
}

.line-decorator {
  flex: 1;
  height: 2px;
  background-color: var(--text-primary);
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

.project-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
}

.project-info {
  position: sticky;
  top: 100px;
}

.project-info h3 {
  font-size: 1.5rem;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
}

.project-info p {
  color: var(--text-secondary);
  text-transform: uppercase;
  font-size: 1rem;
  margin: 0 0 2rem 0;
}

.arrow-icon {
  font-size: 2rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.3s ease;
}

/* Hover loop for info block to move the arrow */
.project-info:hover .arrow-icon {
  transform: translate(5px, 5px);
}

.project-image img {
  width: 100%;
  height: 700px;
}

@media (max-width: 900px) {
  .project-item {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .project-info {
    position: relative;
    top: 0;
  }
  .project-image img {
    height: 400px;
  }
}
</style>
