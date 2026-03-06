<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({
  profile: Object
})

const bioTarget = ref(null)
const quoteTarget = ref(null)

const isBioVisible = ref(false)
const isQuoteVisible = ref(false)

useIntersectionObserver(bioTarget, ([{ isIntersecting }]) => {
  if (isIntersecting) isBioVisible.value = true
}, { threshold: 0.2 })

useIntersectionObserver(quoteTarget, ([{ isIntersecting }]) => {
  if (isIntersecting) isQuoteVisible.value = true
}, { threshold: 0.2 })
</script>

<template>
  <section class="bio-section">
    <div class="bio-content layout-grid" ref="bioTarget">
      <div 
        class="bio-text reveal-hidden"
        :class="{ 'reveal-visible': isBioVisible }"
      >
        <h2 class="section-title">BIO</h2>
        <div class="bio-paragraphs">
          <p v-for="(paragraph, index) in profile.bio.split('\n\n')" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>

      <div class="bio-images">
        <div 
            class="img-tall reveal-scale-hidden delay-100"
            :class="{ 'reveal-scale-visible': isBioVisible }"
        >
          <!-- Profile image for tall portrait -->
          <img src="/Foto2.jpeg" alt="Andrew Irawan Portrait" class="img-rounded" />
        </div>
        <div 
            class="img-wide reveal-scale-hidden delay-300"
            :class="{ 'reveal-scale-visible': isBioVisible }"
        >
           <!-- Profile image for wide portrait -->
          <img src="/Foto3.jpeg" alt="Andrew Irawan Landscape" class="img-rounded" />
        </div>
      </div>
    </div>

    <div class="quote-section layout-grid" ref="quoteTarget">
      <h3 
        class="quote-text reveal-hidden"
        :class="{ 'reveal-visible': isQuoteVisible }"
      >
        {{ profile.quote }}
      </h3>
      <div 
        class="quote-image reveal-scale-hidden delay-200"
        :class="{ 'reveal-scale-visible': isQuoteVisible }"
      >
        <!-- Stand-in for quote full height image -->
        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1287&auto=format&fit=crop" alt="Pose" class="img-rounded" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 6rem;
  align-items: center;
}

.section-title {
  font-size: clamp(3rem, 8vw, 6rem);
  text-transform: uppercase;
  margin: 0 0 2rem 0;
  line-height: 1;
}

.bio-paragraphs {
  font-size: 1.15rem;
  line-height: 1.6;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.bio-paragraphs p {
  margin-bottom: 2rem;
}

.bio-images {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

.img-tall img {
  width: 70%;
  height: 600px;
  float: right;
}

.img-wide img {
  width: 80%;
  height: 400px;
  margin-top: -150px;
  z-index: 2;
  position: relative;
}

.quote-text {
  font-size: clamp(1.5rem, 3.5vw, 2.8rem);
  text-transform: uppercase;
  line-height: 1.3;
  margin: 0;
}

.quote-image img {
  width: 100%;
  height: 800px;
}

@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  .img-tall img, .img-wide img, .quote-image img {
    width: 100%;
    height: 400px;
    margin-top: 0;
    float: none;
  }
}
</style>
