<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({
  profile: Object
})

const target = ref(null)
const isVisible = ref(false)

useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) isVisible.value = true
  },
  { threshold: 0.1 }
)
</script>

<template>
  <section class="hero-section" ref="target">
    <div class="hero-text-content">
      <h1 class="hero-title">
        <span 
          class="first-name reveal-hidden delay-100"
          :class="{ 'reveal-visible': isVisible }"
        >
            {{ profile.name.split(' ')[0] }}
        </span>
        <span 
          class="last-name reveal-hidden delay-200"
          :class="{ 'reveal-visible': isVisible }"
        >
            {{ profile.name.split(' ')[1] }}
        </span>
      </h1>
      
      <div 
        class="subtitle-wrapper reveal-hidden delay-400"
        :class="{ 'reveal-visible': isVisible }"
      >
        <p class="hero-subtitle">{{ profile.role }}</p>
        <div class="arrow-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7L17 17M17 17V7M17 17H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <div 
        class="hero-image-wrapper reveal-scale-hidden delay-300"
        :class="{ 'reveal-scale-visible': isVisible }"
    >
      <img 
        src="/Foto1.jpeg" 
        alt="Andrew Irawan Portrait" 
        class="img-rounded hero-image" 
      />
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80vh;
  margin-top: 2rem;
}

.hero-text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hero-title {
  font-size: clamp(4rem, 10vw, 8rem);
  line-height: 0.9;
  letter-spacing: -2px;
  font-weight: 700;
  margin: 0;
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
}

.subtitle-wrapper {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 20%;
}

.hero-subtitle {
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
}

.arrow-icon {
  font-size: 2rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

/* Small micro animation on hover */
.subtitle-wrapper:hover .arrow-icon {
  transform: translate(5px, 5px);
}

.hero-image-wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.hero-image {
  max-width: 100%;
  width: 90%;
  height: 80vh;
}

@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    gap: 4rem;
  }
  .hero-image-wrapper {
    justify-content: center;
  }
  .hero-image {
    width: 100%;
    height: 60vh;
  }
  .subtitle-wrapper {
    margin-left: 0;
    margin-top: 2rem;
  }
}
</style>
