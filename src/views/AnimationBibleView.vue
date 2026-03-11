<template>
  <div class="animation-bible-container">
    <!-- Three.js Canvas -->
    <canvas ref="canvasRef" class="three-canvas"></canvas>

    <!-- Scroll Container (drives camera) -->
    <div class="scroll-driver" :style="{ height: scrollHeight + 'px' }"></div>

    <!-- Chapter Text Overlay -->
    <transition name="fade">
      <div class="chapter-overlay" v-if="overlayVisible">
        <div class="chapter-content">
          <div class="chapter-number">{{ currentChapterData.number }}</div>
          <h2 class="chapter-title">{{ currentChapterData.title }}</h2>
          <p class="chapter-verse">{{ currentChapterData.verse }}</p>
          <p class="chapter-desc">{{ currentChapterData.desc }}</p>
        </div>
      </div>
    </transition>

    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ height: (scrollProgress * 100) + '%' }"></div>
      <div
        v-for="(ch, i) in chapters"
        :key="i"
        class="progress-dot"
        :class="{ active: currentChapter === i }"
        :style="{ top: (i / (chapters.length - 1) * 100) + '%' }"
        @click="scrollToChapter(i)"
        :title="ch.title"
      ></div>
    </div>

    <!-- Scroll Hint -->
    <div class="scroll-hint" :class="{ hidden: scrollProgress > 0.01 }">
      <div class="scroll-hint-text">Scroll untuk memulai perjalanan</div>
      <div class="scroll-arrow">↓</div>
    </div>

    <!-- Header -->
    <div class="bible-header" :class="{ faded: scrollProgress > 0.02 }">
      <div class="header-cross">✝</div>
      <h1>Perjalanan Kristus</h1>
      <p>Dari Taman Eden hingga Kebangkitan</p>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import * as THREE from 'three'

export default {
  name: 'AnimationBibleView',

  data() {
    return {
      scrollProgress: 0,
      currentChapter: 0,
      overlayVisible: true,
      scrollHeight: 12000,
      chapterChangeTimeout: null,

      chapters: [
        {
          number: 'Chapter I',
          title: 'Taman Eden',
          verse: 'Kejadian 1:31 — "Allah melihat segala yang dijadikan-Nya itu, sungguh amat baik."',
          desc: 'Pada mulanya, Allah menciptakan langit dan bumi. Adam dan Hawa hidup dalam keindahan firdaus, berjalan bersama Allah dalam damai.',
          skyTop: '#1a472a', skyBot: '#52b788'
        },
        {
          number: 'Chapter II',
          title: 'Kejatuhan Manusia',
          verse: 'Kejadian 3:6 — "Perempuan itu melihat... ia mengambilnya dan memakannya."',
          desc: 'Ular menggoda Hawa, dan dosa memasuki dunia. Adam dan Hawa diusir dari Taman Eden. Dosa memisahkan manusia dari Allah.',
          skyTop: '#4a3728', skyBot: '#d2691e'
        },
        {
          number: 'Chapter III',
          title: 'Bahtera Nuh',
          verse: 'Kejadian 6:18 — "Tetapi dengan engkau Aku akan mengadakan perjanjian-Ku."',
          desc: 'Dunia penuh kejahatan, tetapi Nuh menemukan kasih karunia di hadapan Allah. Bahtera diselamatkan, dan pelangi menjadi tanda perjanjian.',
          skyTop: '#1e3a5f', skyBot: '#4a90d9'
        },
        {
          number: 'Chapter IV',
          title: 'Abraham & Janji Allah',
          verse: 'Kejadian 12:2 — "Aku akan membuat engkau menjadi bangsa yang besar."',
          desc: 'Allah memanggil Abraham keluar dari negerinya. Janji keselamatan dimulai — melalui keturunannya semua bangsa di bumi akan diberkati.',
          skyTop: '#1a1a2e', skyBot: '#e8b86d'
        },
        {
          number: 'Chapter V',
          title: 'Musa & Keluaran',
          verse: 'Keluaran 14:21 — "Laut itu dibelah dua, dan orang Israel berjalan dari tengah-tengah laut."',
          desc: 'Musa memimpin bangsa Israel keluar dari perbudakan Mesir. Laut Merah terbelah, hukum Taurat diberikan, dan Allah memelihara umat-Nya.',
          skyTop: '#c2813f', skyBot: '#f5deb3'
        },
        {
          number: 'Chapter VI',
          title: 'Para Nabi Menubuatkan',
          verse: 'Yesaya 9:5 — "Seorang anak telah lahir untuk kita, seorang putera telah diberikan untuk kita."',
          desc: 'Berabad-abad para nabi menyatakan kedatangan Juruselamat. Sebuah pengharapan yang terpelihara di tengah kegelapan.',
          skyTop: '#2d1b69', skyBot: '#9b72cf'
        },
        {
          number: 'Chapter VII',
          title: 'Kelahiran Yesus di Betlehem',
          verse: 'Lukas 2:11 — "Hari ini telah lahir bagimu Juruselamat, yaitu Kristus, Tuhan."',
          desc: 'Putra Allah datang ke dunia sebagai bayi mungil. Bintang bersinar di langit, para gembala dan orang majus datang menyembah.',
          skyTop: '#0a0a1e', skyBot: '#c8a850'
        },
        {
          number: 'Chapter VIII',
          title: 'Pelayanan Yesus',
          verse: 'Yohanes 3:16 — "Karena begitu besar kasih Allah akan dunia ini..."',
          desc: 'Yesus menyembuhkan yang sakit, membangkitkan yang mati, dan mengajar tentang Kerajaan Allah dengan penuh kuasa.',
          skyTop: '#87ceeb', skyBot: '#29b6f6'
        },
        {
          number: 'Chapter IX',
          title: 'Perjamuan Terakhir',
          verse: 'Lukas 22:19 — "Inilah tubuh-Ku yang diserahkan bagi kamu..."',
          desc: 'Di ruang atas, Yesus berbagi roti dan anggur bersama murid-murid-Nya. Sebuah perjanjian baru dimeteraikan dengan kasih.',
          skyTop: '#4a2040', skyBot: '#8b4163'
        },
        {
          number: 'Chapter X',
          title: 'Getsemani & Pengkhianatan',
          verse: 'Markus 14:36 — "Ya Abba, ya Bapa... tetapi bukanlah apa yang Aku kehendaki."',
          desc: 'Yesus berdoa dengan air mata di taman Getsemani. Yudas mengkhianati-Nya dengan sebuah ciuman di tengah malam.',
          skyTop: '#0d0d1a', skyBot: '#2d2d3f'
        },
        {
          number: 'Chapter XI',
          title: 'Penyaliban di Golgota',
          verse: 'Yohanes 19:30 — "Sudah selesai." Ia menundukkan kepala-Nya dan menyerahkan nyawa-Nya.',
          desc: 'Di bukit Golgota, Yesus disalib. Langit menjadi gelap, tirai Bait Allah terbelah. Sang Juruselamat menanggung dosa dunia.',
          skyTop: '#1a0005', skyBot: '#7b0020'
        },
        {
          number: 'Chapter XII',
          title: 'Kebangkitan yang Mulia',
          verse: 'Lukas 24:6 — "Ia tidak ada di sini, Ia telah bangkit."',
          desc: 'Pada hari ketiga, kubur itu kosong! Yesus bangkit dari kematian, mengalahkan dosa dan maut. Penebusan telah sempurna. Haleluyah!',
          skyTop: '#fff0a0', skyBot: '#ffffff'
        }
      ]
    }
  },

  computed: {
    currentChapterData() {
      return this.chapters[this.currentChapter] || this.chapters[0]
    }
  },

  async mounted() {
    await nextTick()
    try {
      this.initThree()
      this.startAnimation()
    } catch (e) {
      console.error('Three.js init error:', e)
    }
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize)
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    if (this._rafId) cancelAnimationFrame(this._rafId)
    if (this._renderer) this._renderer.dispose()
    if (this.chapterChangeTimeout) clearTimeout(this.chapterChangeTimeout)
  },

  methods: {
    initThree() {
      const canvas = this.$refs.canvasRef
      if (!canvas) throw new Error('Canvas not found')

      const W = window.innerWidth
      const H = window.innerHeight

      // Renderer
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x1a472a)
      this._renderer = renderer

      // Scene
      const scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0x1a3a2a, 30, 150)
      this._scene = scene

      // Camera
      const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 500)
      camera.position.set(0, 1, 0)
      this._camera = camera

      // Spline path
      const splinePoints = []
      const numChapters = this.chapters.length
      for (let i = 0; i < numChapters; i++) {
        const z = -i * 25
        const x = (i % 2 === 0) ? 0 : (i % 4 < 2 ? 4 : -4)
        const y = Math.sin(i * 0.5) * 0.5
        splinePoints.push(new THREE.Vector3(x, y, z))
      }
      this._spline = new THREE.CatmullRomCurve3(splinePoints, false, 'catmullrom', 0.5)
      this._cameraT = 0
      this._targetT = 0

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffd8a0, 1.0)
      scene.add(ambientLight)
      this._ambientLight = ambientLight

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
      dirLight.position.set(5, 10, 5)
      scene.add(dirLight)
      this._dirLight = dirLight

      // Ground
      const groundGeo = new THREE.PlaneGeometry(200, 700)
      const groundMat = new THREE.MeshLambertMaterial({ color: 0x2a1a0e })
      const ground = new THREE.Mesh(groundGeo, groundMat)
      ground.rotation.x = -Math.PI / 2
      ground.position.set(0, -3, -140)
      scene.add(ground)

      // Billboards
      this._billboards = []
      this.addBillboards(scene)

      // Particles
      this.addParticles(scene)

      // Decorative crosses
      this.addCross(scene, -4, -3, -245)
      this.addCross(scene, 0, -3, -250)
      this.addCross(scene, 4, -3, -252)

      // Resurrection light orb
      const orbGeo = new THREE.SphereGeometry(4, 16, 16)
      const orbMat = new THREE.MeshBasicMaterial({ color: 0xfffacd, transparent: true, opacity: 0.12 })
      const orb = new THREE.Mesh(orbGeo, orbMat)
      orb.position.set(0, 4, -275)
      orb.userData.isOrb = true
      scene.add(orb)
      this._billboards.push(orb)

      // Star of Bethlehem
      const starGeo = new THREE.SphereGeometry(0.8, 8, 8)
      const starMat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.6 })
      const star = new THREE.Mesh(starGeo, starMat)
      star.position.set(-3, 10, -150)
      star.userData.isStar = true
      star.userData.phase = 0
      scene.add(star)
      this._billboards.push(star)
    },

    addBillboards(scene) {
      const loader = new THREE.TextureLoader()
      const defs = [
        { img: '/bible-scenes/eden.png',        x: 6,   y: 2, z: -10,  s: 14, ry: -0.4 },
        { img: '/bible-scenes/fall.png',         x: -8,  y: 2, z: -35,  s: 12, ry: 0.5  },
        { img: '/bible-scenes/noah.png',         x: 8,   y: 2, z: -60,  s: 13, ry: -0.4 },
        { img: '/bible-scenes/moses.png',        x: -7,  y: 2, z: -85,  s: 13, ry: 0.4  },
        { img: '/bible-scenes/moses.png',        x: 7,   y: 2, z: -110, s: 11, ry: -0.3 },
        { img: '/bible-scenes/bethlehem.png',    x: -6,  y: 2, z: -135, s: 14, ry: 0.4  },
        { img: '/bible-scenes/ministry.png',     x: 7,   y: 2, z: -160, s: 13, ry: -0.4 },
        { img: '/bible-scenes/last-supper.png',  x: -6,  y: 2, z: -185, s: 14, ry: 0.3  },
        { img: '/bible-scenes/gethsemane.png',   x: 6,   y: 1, z: -210, s: 12, ry: -0.35},
        { img: '/bible-scenes/crucifixion.png',  x: 0,   y: 3, z: -250, s: 16, ry: 0    },
        { img: '/bible-scenes/resurrection.png', x: 0,   y: 2, z: -275, s: 18, ry: 0    },
      ]
      defs.forEach((d, i) => {
        const tex = loader.load(d.img)
        tex.colorSpace = THREE.SRGBColorSpace
        const geo = new THREE.PlaneGeometry(d.s, d.s * 0.75)
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          alphaTest: 0.1
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(d.x, d.y, d.z)
        mesh.rotation.y = d.ry
        mesh.userData.baseY = d.y
        mesh.userData.phase = i * 1.1
        scene.add(mesh)
        this._billboards.push(mesh)
      })
    },

    addParticles(scene) {
      const N = 3000
      const positions = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 80
        positions[i * 3 + 1] = Math.random() * 25
        positions[i * 3 + 2] = -Math.random() * 300
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.6, sizeAttenuation: true })
      this._particles = new THREE.Points(geo, mat)
      scene.add(this._particles)
    },

    addCross(scene, x, y, z) {
      const mat = new THREE.MeshBasicMaterial({ color: 0x1a0005 })
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5, 0.15), mat)
      v.position.set(x, y + 2.5, z)
      scene.add(v)
      const h = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 0.15), mat)
      h.position.set(x, y + 4, z)
      scene.add(h)
    },

    startAnimation() {
      const animate = () => {
        this._rafId = requestAnimationFrame(animate)
        const t = Date.now() * 0.001

        // Smooth camera interpolation
        this._cameraT += (this._targetT - this._cameraT) * 0.05
        this.updateCamera(this._cameraT)

        // Bob billboards
        if (this._billboards) {
          this._billboards.forEach(b => {
            if (b.userData.baseY !== undefined && !b.userData.isOrb) {
              b.position.y = b.userData.baseY + Math.sin(t * 0.7 + (b.userData.phase || 0)) * 0.08
            } else if (b.userData.isOrb || b.userData.isStar) {
              b.position.y += Math.sin(t * 1.5 + (b.userData.phase || 0)) * 0.002
            }
          })
        }

        // Rotate particles slightly
        if (this._particles) {
          this._particles.rotation.y = t * 0.005
        }

        // Update sky
        this.updateSky(this._cameraT)

        if (this._renderer && this._scene && this._camera) {
          this._renderer.render(this._scene, this._camera)
        }
      }
      animate()
    },

    updateCamera(t) {
      if (!this._spline || !this._camera) return
      const clamped = Math.max(0, Math.min(1, t))
      const pos = this._spline.getPoint(clamped)
      const tangent = this._spline.getTangent(clamped)
      this._camera.position.copy(pos)
      this._camera.position.y += 1
      this._camera.lookAt(pos.x + tangent.x * 3, pos.y + 1.2, pos.z + tangent.z * 3)
    },

    updateSky(t) {
      if (!this._renderer || !this._scene) return
      const idx = Math.min(Math.floor(t * (this.chapters.length - 1)), this.chapters.length - 2)
      const frac = Math.max(0, Math.min(1, (t * (this.chapters.length - 1)) - idx))
      const c0 = new THREE.Color(this.chapters[idx].skyTop)
      const c1 = new THREE.Color(this.chapters[Math.min(idx + 1, this.chapters.length - 1)].skyTop)
      const sky = c0.clone().lerp(c1, frac)
      this._renderer.setClearColor(sky)
      if (this._scene.fog) this._scene.fog.color.copy(sky)

      // Lighting
      if (this._ambientLight) {
        const isRes = t > 0.95
        const isCrux = t > 0.85 && t < 0.94
        if (isRes) {
          this._ambientLight.color.set(0xffffee)
          this._ambientLight.intensity = 2.5
        } else if (isCrux) {
          this._ambientLight.color.set(0x3d000d)
          this._ambientLight.intensity = 0.3
        } else {
          this._ambientLight.color.set(0xffd8a0)
          this._ambientLight.intensity = 1.0
        }
      }
    },

    onScroll() {
      const maxScroll = this.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return
      const raw = window.scrollY / maxScroll
      this.scrollProgress = Math.min(Math.max(raw, 0), 1)
      this._targetT = this.scrollProgress

      const chIdx = Math.min(
        Math.round(this.scrollProgress * (this.chapters.length - 1)),
        this.chapters.length - 1
      )
      if (chIdx !== this.currentChapter) {
        this.overlayVisible = false
        if (this.chapterChangeTimeout) clearTimeout(this.chapterChangeTimeout)
        this.chapterChangeTimeout = setTimeout(() => {
          this.currentChapter = chIdx
          this.overlayVisible = true
        }, 300)
      }
    },

    scrollToChapter(idx) {
      const maxScroll = this.scrollHeight - window.innerHeight
      const targetScroll = (idx / (this.chapters.length - 1)) * maxScroll
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    },

    onResize() {
      if (!this._renderer || !this._camera) return
      const W = window.innerWidth
      const H = window.innerHeight
      this._camera.aspect = W / H
      this._camera.updateProjectionMatrix()
      this._renderer.setSize(W, H)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

.animation-bible-container {
  position: relative;
  width: 100%;
  background: #000;
}

.three-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 1;
  display: block;
}

.scroll-driver {
  position: relative;
  z-index: 0;
  pointer-events: none;
}

/* =================== HEADER =================== */
.bible-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 10;
  padding: 1.5rem 2rem;
  text-align: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent);
  transition: opacity 1s ease;
}
.bible-header.faded { opacity: 0; pointer-events: none; }

.header-cross {
  font-size: 1.8rem;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255,215,0,0.8);
  margin-bottom: 0.4rem;
  display: block;
  animation: pulseGlow 2s ease-in-out infinite;
}

.bible-header h1 {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(1.3rem, 3.5vw, 2.8rem);
  color: #ffd700;
  text-shadow: 0 0 30px rgba(255,215,0,0.5), 0 2px 8px rgba(0,0,0,0.9);
  letter-spacing: 0.08em;
  margin-bottom: 0.3rem;
}

.bible-header p {
  font-family: 'Crimson Text', serif;
  font-size: 1rem;
  color: rgba(255,240,200,0.9);
  letter-spacing: 0.15em;
  font-style: italic;
}

/* =================== CHAPTER OVERLAY =================== */
.chapter-overlay {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 10;
  padding: 1.5rem 2rem 2rem;
  background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 80%, transparent 100%);
  pointer-events: none;
}

.chapter-content {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}

.chapter-number {
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.7rem;
  color: #ffd700;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
  opacity: 0.85;
}

.chapter-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(1.2rem, 2.8vw, 2rem);
  color: #fff;
  text-shadow: 0 0 20px rgba(255,215,0,0.3), 0 2px 6px rgba(0,0,0,0.9);
  margin-bottom: 0.6rem;
  letter-spacing: 0.04em;
}

.chapter-verse {
  font-family: 'Crimson Text', serif;
  font-size: 0.9rem;
  color: #ffd700;
  font-style: italic;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  opacity: 0.9;
}

.chapter-desc {
  font-family: 'Crimson Text', serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.7;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* =================== PROGRESS BAR =================== */
.progress-bar {
  position: fixed;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 3px;
  height: 280px;
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
}

.progress-fill {
  width: 100%;
  background: linear-gradient(to bottom, #ffd700, #ff8c00);
  border-radius: 2px;
  transition: height 0.12s ease;
  box-shadow: 0 0 8px rgba(255,215,0,0.6);
  min-height: 3px;
}

.progress-dot {
  position: absolute;
  right: -4px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid rgba(255,215,0,0.5);
  background: rgba(0,0,0,0.5);
  transform: translate(0, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
}
.progress-dot.active {
  background: #ffd700;
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255,215,0,0.9);
  transform: translate(0, -50%) scale(1.4);
}
.progress-dot:hover:not(.active) {
  background: rgba(255,215,0,0.4);
  transform: translate(0, -50%) scale(1.2);
}

/* =================== SCROLL HINT =================== */
.scroll-hint {
  position: fixed;
  bottom: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
  transition: opacity 0.8s ease;
  pointer-events: none;
}
.scroll-hint.hidden { opacity: 0; }

.scroll-hint-text {
  font-family: 'Crimson Text', serif;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.15em;
  margin-bottom: 0.4rem;
}

.scroll-arrow {
  font-size: 1.4rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255,215,0,0.8);
  animation: bounce 1.5s ease-in-out infinite;
}

/* =================== ANIMATIONS =================== */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
@keyframes pulseGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(255,215,0,0.8); }
  50% { text-shadow: 0 0 40px rgba(255,215,0,1), 0 0 60px rgba(255,180,0,0.5); }
}

/* Responsive */
@media (max-width: 600px) {
  .chapter-overlay { padding: 1rem 1.2rem 1.5rem; }
  .chapter-desc { display: none; }
  .progress-bar { right: 0.6rem; height: 220px; }
}
</style>
