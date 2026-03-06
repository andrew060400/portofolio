<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { usePortfolioStore } from '../store'
import HeroSection from '../components/HeroSection.vue'
import BioSection from '../components/BioSection.vue'
import PortfolioSection from '../components/PortfolioSection.vue'
import StatsSection from '../components/StatsSection.vue'

const store = usePortfolioStore()

const footerTarget = ref(null)
const isFooterVisible = ref(false)

useIntersectionObserver(footerTarget, ([{ isIntersecting }]) => {
  if (isIntersecting) isFooterVisible.value = true
}, { threshold: 0.1 })
</script>

<template>
  <div class="portfolio-layout">
    <main class="home-container">
      <HeroSection :profile="store.profile" />
      <BioSection :profile="store.profile" />
      <PortfolioSection :projects="store.projects" />
      <StatsSection :stats="store.stats" />
    </main>

    <footer class="contact-footer" ref="footerTarget">
      <div 
        class="footer-grid reveal-hidden delay-100"
        :class="{ 'reveal-visible': isFooterVisible }"
     >
        <div class="footer-column">
          <h3>ADDRESS</h3>
          <p>{{ store.contact.address }}</p>
        </div>
        <div class="footer-column">
          <h3>PHONE</h3>
          <p>{{ store.contact.phone }}</p>
        </div>
        <div class="footer-column">
          <h3>EMAIL</h3>
          <p><a :href="`mailto:${store.contact.email}`">{{ store.contact.email }}</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.portfolio-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.home-container {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.contact-footer {
  margin-top: 6rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h3 {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.footer-column p {
  font-size: 1.2rem;
  font-weight: 400;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
</style>
