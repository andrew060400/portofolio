<script setup>
import { ref } from 'vue'
import { usePortfolioStore } from '../store'

const store = usePortfolioStore()
const activeSide = ref(null) // 'left' or 'right'

// Modal State
const activeProject = ref(null)

const openModal = (project) => {
  if (project.link) {
    // Navigate directly instead of opening modal
    window.location.href = project.link
    return
  }
  activeProject.value = project
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  activeProject.value = null
  document.body.style.overflow = 'auto'
}
</script>

<template>
  <nav class="sticky-nav">
    <div class="nav-container">
      <div class="logo-wrapper">
        <img src="/logo.jpeg" alt="Logo" class="nav-logo-img" />
        <div class="logo">Andrew Irawan.</div>
      </div>
      <div class="links">
        <a href="#hero">About</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <router-link to="/ats-resume-checker" class="nav-highlight">ATS Scanner</router-link>
      </div>
    </div>
  </nav>
  <div class="adham-layout">
    

    <!-- Split Hero Section -->
    <header id="hero" class="split-hero" @mouseleave="activeSide = null">
      <!-- Left Side: Manager -->
      <div 
        class="split left" 
        :class="{ 
          'is-active': activeSide === 'left', 
          'is-inactive': activeSide === 'right' 
        }" 
        @mouseenter="activeSide = 'left'"
      >
        <div class="split-text">
          <h1>Project<br/>Manager</h1>
          <p>Leading teams, orchestrating timelines, and delivering scalable tech solutions with precision.</p>
        </div>
      </div>

      <!-- Right Side: Coder -->
      <div 
        class="split right" 
        :class="{ 
          'is-active': activeSide === 'right', 
          'is-inactive': activeSide === 'left' 
        }" 
        @mouseenter="activeSide = 'right'"
      >
        <div class="split-text">
          <h1>&lt;Frontend&gt;<br/>Developer</h1>
          <p>Crafting clean, elegant, and highly efficient interactive code utilizing Vue and Next.js.</p>
        </div>
      </div>
      
      <!-- Center Image Overlay (The "Split Face" Concept) -->
      <div class="center-image-container" :class="activeSide">
        <img src="/2.png" alt="Andrew Project Manager" class="base-image" />
        <img src="/1.png" alt="Andrew Coder" class="reveal-image" />
        <div class="divider-line"></div>
      </div>
    </header>

    <!-- Work Experience Section -->
    <main id="experience" class="portfolio-section bg-light">
      <h2 class="section-title">Work Experience</h2>
      <div class="project-grid">
        <div 
          v-for="job in store.experiences" 
          :key="job.id" 
          class="project-card"
          @click="openModal(job)"
        >
          <img :src="job.image" :alt="job.title" class="project-img" />
          <div class="project-overlay">
            <div class="overlay-content">
              <h3>{{ job.title }}</h3>
              <p>{{ job.subtitle }}</p>
              <div class="view-btn">View Details</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Projects Section -->
    <section id="projects" class="portfolio-section">
      <h2 class="section-title">List of Project Experience</h2>
      <div class="project-grid">
        <div 
          v-for="project in store.portfolioProjects" 
          :key="'proj-' + project.id" 
          class="project-card"
          @click="openModal(project)"
        >
          <img :src="project.image" :alt="project.title" class="project-img" />
          <div class="project-overlay">
            <div class="overlay-content">
              <h3>{{ project.title }}</h3>
              <p>{{ project.subtitle }}</p>
              <div class="view-btn">View Details</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Simple Footer -->
    <footer class="adham-footer">
      <h2>Let's build something great.</h2>
      <p>{{ store.contact.email }} • {{ store.contact.phone }}</p>
    </footer>

    <!-- Interactive Project Modal -->
    <transition name="modal-fade">
      <div v-if="activeProject" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeModal">&times;</button>
          
          <div class="modal-layout">
            <div class="modal-image-col">
               <img :src="activeProject.image" :alt="activeProject.title" />
            </div>
            <div class="modal-text-col">
              <h2>{{ activeProject.title }}</h2>
              <p class="modal-subtitle">{{ activeProject.subtitle }}</p>
              
              <div class="modal-desc">
                <p>{{ activeProject.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.adham-layout {
  background-color: #fcfcfc;
  color: #111;
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
}

/* Nav */
.sticky-nav {
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: #111111; /* Dark theme to match Adham */
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  box-sizing: border-box;
  padding: 0 4rem;
}

.nav-container {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem; /* Added padding so it doesn't touch the boundaries */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-logo-img {
  width: 60px;
  height: 60px;
  border-radius: 50%; /* Membulatkan logo (lingkaran) */
  object-fit: cover;
}

.logo {
  font-weight: 800;
  font-size: 1.5rem;
  color: #ffffff;
  letter-spacing: -1px;
}

.links a, .links .nav-highlight {
  margin-left: 2.5rem;
  color: #aaaaaa;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: color 0.3s ease;
}

.links a:hover, .links .nav-highlight:hover {
  color: #ffffff;
}

.links .nav-highlight {
  color: #a5b4fc; /* subtle indigo hint for the special tool */
}


/* Split Hero */
.split-hero {
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  background: #fcfcfc;
  overflow: hidden;
  margin-top: 80px; /* offset for nav height */
}

.split {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 5rem;
  transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.6s ease;
  position: relative;
  z-index: 2;
  background: transparent;
}

.split.left {
  justify-content: flex-start;
}
.split.right {
  justify-content: flex-end;
  text-align: right;
}

.split:hover {
  background-color: rgba(0,0,0,0.02);
}

.split-text {
  max-width: 400px;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
}

.split.left .split-text {
  transform: translateX(0);
}
.split.right .split-text {
  transform: translateX(0);
}

.split.is-inactive .split-text {
  opacity: 0.2;
}
.split.left.is-active .split-text {
  transform: translateX(30px);
}
.split.right.is-active .split-text {
  transform: translateX(-30px);
}

.split h1 {
  font-size: clamp(3rem, 5vw, 5.5rem);
  line-height: 1;
  margin-bottom: 1.5rem;
  letter-spacing: -2px;
  font-weight: 800;
}
.split.right h1 {
  font-family: monospace;
  letter-spacing: -4px;
}

.split p {
  font-size: 1.25rem;
  color: #111111; /* Darkened from #555 for punchy contrast */
  font-weight: 500; /* Added weight for legibility */
  line-height: 1.6;
  text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(255, 255, 255, 0.8); /* Solid white halo to separate from image */
}

/* Center Image Container */
.center-image-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 500px;
  z-index: 1;
  pointer-events: none;
}

.center-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  transition: clip-path 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4);
}

.base-image {
  clip-path: inset(0 0 0 0); /* Full visible */
}

.reveal-image {
  clip-path: inset(0 0 0 50%); /* Half right visible */
  filter: grayscale(100%) contrast(1.1); /* Stylistic differentiator */
}

/* The vertical divider line */
.divider-line {
  position: absolute;
  top: -20px;
  bottom: -20px;
  left: 50%;
  width: 2px;
  background: rgba(255,255,255,0.8);
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  transform: translateX(-50%);
  transition: left 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 3;
}

/* State changes for images based on hover */
.center-image-container.left .reveal-image {
  clip-path: inset(0 0 0 100%); 
  transform: scale(1.03) translateX(10px);
}
.center-image-container.left .base-image {
  transform: scale(1.03) translateX(10px);
}
.center-image-container.left .divider-line {
  left: 100%;
}

.center-image-container.right .reveal-image {
  clip-path: inset(0 0 0 0); 
  transform: scale(1.03) translateX(-10px);
}
.center-image-container.right .base-image {
  transform: scale(1.03) translateX(-10px);
}
.center-image-container.right .divider-line {
  left: 0%;
}


/* Portfolio Section */
.portfolio-section {
  padding: 8rem 4rem;
  background: #ffffff;
}

.portfolio-section.bg-light {
  background: #f8f8f8; /* Soft contrast between sections */
}

.section-title {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 5rem;
  letter-spacing: -2px;
  font-weight: 800;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s ease;
}

.project-card:hover .project-img {
  transform: scale(1.08); /* Zoom effect */
  filter: blur(4px); /* Blur underlying image */
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 17, 17, 0.85); /* Dark overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: #fff;
  transform: translateY(30px); /* Start lower */
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.project-card:hover .overlay-content {
  transform: translateY(0); /* Float up to center */
}

.overlay-content h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.overlay-content p {
  font-size: 1rem;
  color: #cccccc;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.view-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  border: 1px solid rgba(255,255,255,0.5);
  color: #fff;
  border-radius: 50px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 2px;
  transition: background 0.3s, color 0.3s, transform 0.3s, border-color 0.3s;
}

.view-btn:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
  transform: translateY(-3px);
}

/* Footer */
.adham-footer {
  text-align: center;
  padding: 8rem 2rem;
  background: #111111;
  color: #ffffff;
}

.adham-footer h2 {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  letter-spacing: -2px;
}

.adham-footer p {
  color: #aaaaaa;
  font-size: 1.25rem;
  letter-spacing: 1px;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 1100px;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 3rem;
  color: #111;
  cursor: pointer;
  z-index: 10;
  line-height: 0.5;
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(4px);
  transition: transform 0.3s, background 0.3s;
}

.close-btn:hover {
  transform: scale(1.1) rotate(90deg);
  background: #fff;
}

.modal-layout {
  display: flex;
  flex-direction: row;
  height: 60vh;
  min-height: 500px;
}

.modal-image-col {
  flex: 6;
  position: relative;
}

.modal-image-col img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-text-col {
  flex: 5;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #f8f8f8;
}

.modal-text-col h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
  color: #111;
}

.modal-subtitle {
  font-size: 1.25rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 2.5rem;
}

.modal-desc p {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #444;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  transition-delay: 0.1s;
}

.modal-fade-enter-from .modal-content {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
}

@media (max-width: 900px) {
  /* Scrollable Swipe Navigation for Mobile */
  .sticky-nav { 
    padding: 0; 
    height: 75px; 
    overflow-x: auto; 
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .sticky-nav::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  .nav-container { 
    padding: 0 1.5rem; 
    min-width: 550px; /* Memaksa elemen tetap lebar agar bisa di-scroll horizontal */
  }
  
  .logo-wrapper { 
    gap: 0.75rem; 
  }
  .logo { 
    font-size: 1.2rem; 
    white-space: nowrap; /* Mencegah nama turun ke baris baru */
  }
  .nav-logo-img { 
    width: 42px; 
    height: 42px; 
  }
  .links {
    display: flex;
    gap: 1.5rem;
    white-space: nowrap;
  }
  .links a { 
    margin-left: 0; 
    font-size: 0.95rem; 
  }

  /* Premium Split Hero for Mobile (Restored Minimalist Gap Layout) */
  .split-hero {
    flex-direction: row;
    height: calc(100vh - 75px);
    padding-top: 0;
  }
  
  .center-image-container {
    display: block !important;
    position: absolute;
    top: 50%; /* Titik ekuator sempurna 50:50 */
    left: 50%;
    transform: translate(-50%, -50%);
    width: 260px;
    height: 360px;
    z-index: 10;
  }

  .split {
    padding: 1rem 0.5rem;
  }
  
  .split.left { 
    padding-left: 1rem; 
    align-items: flex-start !important;
    justify-content: flex-start !important;
    padding-top: 5.5rem; /* Jarak presisi dari atas */
  }
  
  .split.right { 
    padding-right: 1rem; 
    align-items: flex-end !important; 
    justify-content: flex-end !important;
    text-align: right !important; 
    padding-bottom: 5.5rem; /* Jarak presisi dari bawah (sama persis!) */
  }
  
  .split h1 { 
    font-size: 2rem; 
    margin-bottom: 0.5rem; 
    letter-spacing: -1px; 
  }
  
  .split p { 
    display: none; /* Sembunyikan paragraf untuk kesan minimalis elegan */
  }

  /* Hilangkan efek geser teks yang berlebihan saat mode HP */
  .split.left.is-active .split-text,
  .split.right.is-active .split-text {
    transform: none !important;
  }

  /* Keep layout tight */
  .portfolio-section { padding: 4rem 1rem; }
  .section-title { font-size: 2.5rem; margin-bottom: 3rem; }
  .project-grid {
    grid-template-columns: 1fr;
    padding: 0;
    gap: 2rem;
  }
  
  /* Mobile Modal */
  .modal-overlay { padding: 1rem; }
  .modal-layout {
    flex-direction: column;
    height: 85vh;
  }
  .modal-image-col {
    height: 250px;
    flex: none;
  }
  .modal-text-col {
    padding: 2rem 1.5rem;
    overflow-y: auto;
  }
  .modal-text-col h2 { font-size: 1.8rem; }
  .modal-subtitle { font-size: 1rem; margin-bottom: 1.5rem; }
  .modal-desc p { font-size: 1rem; }
  .close-btn { top: 1rem; right: 1rem; font-size: 2.5rem; }
  
  /* Footer */
  .adham-footer { padding: 4rem 1.5rem; }
  .adham-footer h2 { font-size: 2rem; margin-bottom: 1rem;}
  .adham-footer p { font-size: 1rem; }
}
</style>
