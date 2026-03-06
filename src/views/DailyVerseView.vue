<template>
  <div class="fc-layout">
    <!-- NAVIGATION -->
    <nav :class="['fc-navbar', { 'is-scrolled': isScrolled }]">
      <div class="fc-nav-container">
        <!-- Logo Acting As Language Selector -->
        <div class="fc-logo-wrapper">
            <div class="fc-logo" @click="showLangMenu = !showLangMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22H22L12 2Z"></path>
              </svg>
              <span>DAILY MANNA</span>
              
              <!-- Indicator of Language Mode -->
              <span style="font-size: 0.6rem; margin-left: 0.5rem; opacity: 0.6;">[{{ currentLang.toUpperCase() }}]</span>
            </div>
            
            <!-- Absolute Positioning Dropdown menu -->
            <div v-if="showLangMenu" class="fc-logo-lang-dropdown">
               <div class="lang-option" @click="selectLang('en')">English (EN)</div>
               <div class="lang-option" @click="selectLang('id')">Bahasa (ID)</div>
               <div class="lang-option" @click="selectLang('zh')">中文 (ZH)</div>
            </div>
            <!-- Overlay to close menu when clicking outside -->
            <div v-if="showLangMenu" class="lang-overlay" @click="showLangMenu = false"></div>
        </div>
        
        <!-- Desktop Nav Center -->
        <div class="fc-nav-center">
          <router-link to="/andrew">{{ t.home }}</router-link>
          <a href="#" @click.prevent="scrollToReflection">{{ t.devotionals }}</a>
          <a href="#">{{ t.ministries }}</a>
          <a href="#">{{ t.watch }}</a>
        </div>

        <!-- Right Action (Always visible on mobile: Portfolio Button) -->
        <div class="fc-nav-right-container">
          <div class="fc-nav-right desktop-only">
            <button class="fc-btn-red" @click="$router.push('/andrew')">{{ t.portfolio }}</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ t.loading_message }}</p>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="error-overlay">
      <div class="fc-container text-center">
        <h2 class="fc-section-title text-white">{{ t.error_title }}</h2>
        <p class="fc-body-text text-white">{{ ت.error_desc }}</p>
        <button @click="fetchVerse" class="fc-btn-red mt-4">{{ t.try_again }}</button>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else-if="verseData" class="content-wrapper reveal-fade">
      
      <!-- HERO SECTION -->
      <header class="fc-hero">
        <div class="video-bg-container">
          <iframe 
            id="youtube-bg"
            class="video-bg"
            src="https://www.youtube.com/embed/KSR68RPsjFk?autoplay=1&mute=0&playsinline=1&loop=1&playlist=KSR68RPsjFk&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1" 
            title="YouTube background player" 
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen>
          </iframe>
          <div class="video-overlay"></div>
        </div>
        
        <div class="fc-hero-content">
          <p class="fc-hero-eyebrow">{{ currentDateFormatted }}</p>
          <h1 class="fc-hero-title">"{{ getFirstSentence(verseData.text) }}"</h1>
          <p class="fc-hero-subtitle">— {{ verseData.reference }}</p>
          
          <div class="fc-hero-actions">
            <button class="fc-btn-red fc-btn-large" @click="scrollToReflection">{{ t.read_reflection }}</button>
            <!-- NEW VERSE button hidden as requested -->
          </div>
        </div>
      </header>

      <!-- BANNER OVERLAP SECTION -->
      <div class="fc-banner-wrapper">
        <div class="fc-container">
          <div class="fc-banner">
            <div class="fc-banner-left">
               <span class="fc-banner-label">{{ t.todays_verse }}</span>
               <span class="fc-banner-text">{{ verseData.reference }}</span>
            </div>
            <div class="fc-banner-right">
               <button class="fc-btn-dark" @click="scrollToReflection">{{ t.learn_more }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- REFLECTION SECTION -->
      <section class="fc-section fc-reflection-section" ref="reflectionRef">
        <div class="fc-container">
          <div class="fc-grid-2">
            <!-- Image Column -->
            <div class="fc-image-col">
              <img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1470&auto=format&fit=crop" alt="Peaceful reflection" class="fc-rounded-img"/>
            </div>
            
            <!-- Text Column -->
            <div class="fc-text-col">
              <h2 class="fc-section-title">{{ t.daily_reflection }}</h2>
              <div class="fc-divider"></div>
              
              <div class="fc-verse-quote">
                <strong>{{ verseData.reference }}</strong> - "{{ verseData.text }}"
              </div>

              <p class="fc-body-text">{{ verseData.reflection }}</p>
              
              <div class="mt-4">
                 <button class="fc-btn-red" @click="toggleSpeech">
                    <svg v-if="!isSpeaking" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: text-bottom;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: text-bottom;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    {{ isSpeaking ? t.stop_reading : t.read_aloud }}
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ADDITIONAL CARDS SECTION (Simulating Ministries/Connect) -->
      <section class="fc-section fc-gray-bg">
        <div class="fc-container">
           <h2 class="fc-section-title text-center">{{ t.explore_more }}</h2>
           <div class="fc-divider center"></div>
           
           <div class="fc-grid-3 mt-5">
              <div class="fc-card">
                 <div class="fc-card-img-wrap">
                    <img src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1400&auto=format&fit=crop" alt="Card 1" />
                 </div>
                 <div class="fc-card-body">
                    <h3 class="fc-card-title">{{ t.card_1_title }}</h3>
                    <p class="fc-card-text">{{ t.card_1_desc }}</p>
                    <a href="#" class="fc-card-link">{{ t.read_more }} &rarr;</a>
                 </div>
              </div>
              <div class="fc-card">
                 <div class="fc-card-img-wrap">
                    <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1400&auto=format&fit=crop" alt="Card 2" />
                 </div>
                 <div class="fc-card-body">
                    <h3 class="fc-card-title">{{ t.card_2_title }}</h3>
                    <p class="fc-card-text">{{ t.card_2_desc }}</p>
                    <a href="#" class="fc-card-link">{{ t.find_group }} &rarr;</a>
                 </div>
              </div>
              <div class="fc-card">
                 <div class="fc-card-img-wrap">
                    <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1400&auto=format&fit=crop" alt="Card 3" />
                 </div>
                 <div class="fc-card-body">
                    <h3 class="fc-card-title">{{ t.card_3_title }}</h3>
                    <p class="fc-card-text">{{ t.card_3_desc }}</p>
                    <a href="#" class="fc-card-link">{{ t.watch_latest }} &rarr;</a>
                 </div>
              </div>
           </div>
        </div>
      </section>
      
      <!-- FOOTER -->
      <footer class="fc-footer">
         <div class="fc-container text-center">
            <h2 class="fc-footer-logo">DAILY MANNA.</h2>
            <p class="fc-footer-text">Built as a portfolio demonstration for the Gemini AI + Vue.js integration.</p>
         </div>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { usePortfolioStore } from '@/store'

const store = usePortfolioStore()

const isLoading = ref(true)
const error = ref(false)
const verseData = ref(null)
const reflectionRef = ref(null)
const isScrolled = ref(false)
const isSpeaking = ref(false)
const showLangMenu = ref(false)
const currentLang = ref(localStorage.getItem('fc_lang') || 'en')

// UI Dictionary
const dictionary = {
  en: {
    home: 'HOME',
    devotionals: 'DEVOTIONALS',
    ministries: 'MINISTRIES',
    watch: 'WATCH',
    portfolio: 'PORTFOLIO',
    loading_message: "Seeking today's guidance...",
    error_title: 'CONNECTION ERROR',
    error_desc: 'Failed to connect to the divine source (API). Please verify your connection.',
    try_again: 'TRY AGAIN',
    read_reflection: 'READ REFLECTION',
    new_verse: 'NEW VERSE',
    todays_verse: "TODAY'S VERSE",
    learn_more: 'LEARN MORE',
    daily_reflection: 'DAILY REFLECTION',
    read_aloud: 'READ ALOUD',
    stop_reading: 'STOP READING',
    explore_more: 'EXPLORE MORE',
    card_1_title: 'DEVOTIONALS',
    card_1_desc: 'Dive deeper into the word every morning with our curated devotionals.',
    read_more: 'READ MORE',
    card_2_title: 'COMMUNITY',
    card_2_desc: 'Join a life group and build relationships that last eternally.',
    find_group: 'FIND A GROUP',
    card_3_title: 'WATCH LIVE',
    card_3_desc: 'Experience powerful worship and uncompromised truth every Sunday.',
    watch_latest: 'WATCH LATEST',
    tts_error: 'Sorry, your browser does not support Text-to-Speech.',
    prompt_instruction: 'You are a compassionate Christian devotional writer. Provide a daily Bible verse along with a short, meaningful reflection. VERY IMPORTANT: Your response must be entirely in ENGLISH. Return the output STRICTLY as a JSON object with keys: "reference" (the Bible verse reference, e.g., "John 3:16"), "text" (the actual verse text in English), and "reflection" (a 2-3 sentence thoughtful reflection in English).'
  },
  id: {
    home: 'BERANDA',
    devotionals: 'RENUNGAN',
    ministries: 'PELAYANAN',
    watch: 'TONTON',
    portfolio: 'PORTOFOLIO',
    loading_message: "Mencari ayat hari ini...",
    error_title: 'KONEKSI GAGAL',
    error_desc: 'Gagal mendapatkan ayat hari ini dari API. Silakan periksa koneksi Anda.',
    try_again: 'COBA LAGI',
    read_reflection: 'BACA RENUNGAN',
    new_verse: 'AYAT BARU',
    todays_verse: "AYAT HARI INI",
    learn_more: 'PELAJARI LEBIH',
    daily_reflection: 'RENUNGAN HARIAN',
    read_aloud: 'BACAKAN',
    stop_reading: 'HENTIKAN',
    explore_more: 'EKSPLORASI',
    card_1_title: 'RENUNGAN',
    card_1_desc: 'Selami firman lebih dalam setiap pagi dengan renungan pilihan kami.',
    read_more: 'BACA LEBIH LANJUT',
    card_2_title: 'KOMUNITAS',
    card_2_desc: 'Bergabunglah dengan kelompok sel dan bangun hubungan yang memberkati.',
    find_group: 'CARI KELOMPOK',
    card_3_title: 'TONTON LANGSUNG',
    card_3_desc: 'Alami pujian penyembahan yang kuat dan kebenaran firman setiap hari Minggu.',
    watch_latest: 'TONTON SEKARANG',
    tts_error: 'Maaf, browser Anda tidak mendukung fitur Text-to-Speech.',
    prompt_instruction: 'Anda adalah seorang penulis renungan Kristen yang penuh kasih. Berikan satu ayat Alkitab harian beserta renungan singkat yang bermakna. SANGAT PENTING: Seluruh respons Anda HARUS menggunakan BAHASA INDONESIA. Kembalikan output SECARA KETAT sebagai objek JSON dengan kunci: "reference" (referensi ayat, contoh: "Yohanes 3:16"), "text" (teks ayat Alkitab dalam Bahasa Indonesia), dan "reflection" (2-3 kalimat renungan yang bijak dalam Bahasa Indonesia).'
  },
  zh: {
    home: '主页',
    devotionals: '灵修',
    ministries: '事工',
    watch: '观看',
    portfolio: '作品集',
    loading_message: "正在寻找今日的指引...",
    error_title: '连接错误',
    error_desc: '无法获取今日经文（API连接失败）。请检查您的连接。',
    try_again: '重试',
    read_reflection: '阅读灵修',
    new_verse: '新经文',
    todays_verse: "今日经文",
    learn_more: '了解更多',
    daily_reflection: '每日灵修',
    read_aloud: '语音朗读',
    stop_reading: '停止朗读',
    explore_more: '探索更多',
    card_1_title: '灵修',
    card_1_desc: '每天早晨通过我们精选的灵修深入了解神的话语。',
    read_more: '阅读全文',
    card_2_title: '社区',
    card_2_desc: '加入生命小组，建立直到永远的关系。',
    find_group: '寻找小组',
    card_3_title: '观看直播',
    card_3_desc: '每个星期天体验充满力量的敬拜和不妥协的真理。',
    watch_latest: '观看最新',
    tts_error: '抱歉，您的浏览器不支持文本转语音功能。',
    prompt_instruction: '你是一位以慈爱为怀的基督教灵修作家。请提供每日圣经经文和简短、有意义的灵修内容。非常重要：您的所有回复必须全部使用中文。必须严格返回一个JSON对象作为结果，键名为："reference"（圣经经文引用，例如："约翰福音 3:16"），"text"（中文经文内容），以及"reflection"（2-3句充满哲理的中文灵修）。'
  }
}

const t = computed(() => dictionary[currentLang.value])

const currentDateFormatted = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const localeMap = { 'en': 'en-US', 'id': 'id-ID', 'zh': 'zh-CN' }
  return new Date().toLocaleDateString(localeMap[currentLang.value], options)
})

const selectLang = (lang) => {
    currentLang.value = lang
    showLangMenu.value = false
    changeLanguage()
}

const changeLanguage = () => {
    localStorage.setItem('fc_lang', currentLang.value)
    // If speaking, stop it
    if (isSpeaking.value) {
        window.speechSynthesis.cancel()
        isSpeaking.value = false
        commandYouTube('playVideo')
    }
    fetchVerse()
}

// For hero text, extract just the first sentence so it isn't massive
const getFirstSentence = (text) => {
  if (!text) return ''
  const regex = /[^.!?]*[.!?]/
  const match = text.match(regex)
  return match ? match[0].trim() : text
}

// Helper function to send commands to the YouTube IFrame
const commandYouTube = (command) => {
    const iframe = document.getElementById('youtube-bg');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
    }
}

const toggleSpeech = () => {
    if (!window.speechSynthesis) {
        alert(t.value.tts_error);
        return;
    }

    // Stop speaking if it's already playing
    if (isSpeaking.value) {
        window.speechSynthesis.cancel();
        isSpeaking.value = false;
        commandYouTube('playVideo'); // Resume background music
        return;
    }

    if (verseData.value) {
        // Pause the background video while reading
        commandYouTube('pauseVideo');

        // Build the reading narrative based on language
        let textToRead = '';
        let langCode = 'en-US';
        
        if(currentLang.value === 'id') {
            textToRead = `Ayat hari ini dari ${verseData.value.reference}. ${verseData.value.text}. Renungan: ${verseData.value.reflection}`;
            langCode = 'id-ID';
        } else if (currentLang.value === 'zh') {
            textToRead = `今日经文来自 ${verseData.value.reference}. ${verseData.value.text}. 灵修: ${verseData.value.reflection}`;
            langCode = 'zh-CN';
        } else {
            textToRead = `Today's verse is from ${verseData.value.reference}. ${verseData.value.text}. Reflection: ${verseData.value.reflection}`;
            langCode = 'en-US';
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = langCode; 
        utterance.rate = 0.9; // Read slightly slower for better immersion
        
        utterance.onend = () => { 
            isSpeaking.value = false; 
            commandYouTube('playVideo'); // Resume music when done
        };
        utterance.onerror = () => { 
            isSpeaking.value = false; 
            commandYouTube('playVideo'); // Resume music on error
        };

        isSpeaking.value = true;
        window.speechSynthesis.speak(utterance);
    }
}

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

const scrollToReflection = () => {
  if (reflectionRef.value) {
    const navHeight = 90
    const top = reflectionRef.value.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

const refreshVerse = () => {
    // Clear all cached verses so a new one is forced and other languages sync to the new reference
    store.clearAllVerses()
    fetchVerse(true)
}

const fetchVerse = async (forceRefresh = false) => {
    isLoading.value = true
    error.value = false
    verseData.value = null

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      error.value = true
      isLoading.value = false
      console.error('Gemini API key is missing or invalid.')
      return
    }

    try {
        const today = new Date().toLocaleDateString()
        const langCode = currentLang.value
        
        // Cache Check (Multi-Language aware)
        if (!forceRefresh && store.dailyVerses && store.dailyVerses[langCode] && store.dailyVerses[langCode].date === today && store.dailyVerses[langCode].data) {
            verseData.value = store.dailyVerses[langCode].data
            isLoading.value = false
            return
        }

        // Check if ANY language has a verse for today to use as a base reference
        let baseReference = null;
        if (!forceRefresh && store.dailyVerses) {
            for (const key in store.dailyVerses) {
                if (store.dailyVerses[key]?.date === today && store.dailyVerses[key]?.data?.reference) {
                    baseReference = store.dailyVerses[key].data.reference;
                    break;
                }
            }
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: t.value.prompt_instruction
        })

        let prompt = `Give me a unique daily Bible verse and reflection for today, ${today}. Needs to be uplifting and provide spiritual guidance. Language code target: ${langCode}.`
        
        if (baseReference) {
             // If we already generated a verse today in another language, just translate that exact verse
             prompt = `Please provide the Bible verse and a reflection specifically for ${baseReference}. Needs to be uplifting, provide spiritual guidance, and perfectly translated. Language code target: ${langCode}.`
        }

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        let jsonStr = responseText
        if (jsonStr.includes('```json')) jsonStr = jsonStr.split('```json')[1].split('```')[0].trim()
        else if (jsonStr.includes('```')) jsonStr = jsonStr.split('```')[1].split('```')[0].trim()

        verseData.value = JSON.parse(jsonStr)
        store.setDailyVerse(langCode, today, verseData.value)

    } catch (err) {
        console.error('Error fetching verse from Gemini:', err)
        error.value = true
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchVerse()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (window.speechSynthesis) {
      window.speechSynthesis.cancel() // Stop speaking when leaving the page
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');

/* GLOBAL CSS FOR THIS VIEW */
.fc-layout {
  font-family: 'Montserrat', system-ui, sans-serif;
  color: #111111;
  background-color: #ffffff;
  overflow-x: hidden;
  line-height: 1.6;
}

/* Ensure no padding interrupts the layout */
:deep(#app) {
  padding: 0 !important;
}

.text-center { text-align: center; }
.text-white { color: #ffffff !important; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 3rem; }

/* NAVIGATION (Always Solid) */
.fc-navbar {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 90px;
  z-index: 1000;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
  border-bottom: 1px solid rgba(0,0,0,0.05); /* Subtle border when at the top */
}

.fc-navbar.is-scrolled {
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border-bottom-color: transparent;
}

.fc-nav-container {
  width: 100%; max-width: 1400px;
  height: 100%; margin: 0 auto; padding: 0 3rem;
  display: flex; justify-content: space-between; align-items: center;
}

.fc-logo {
  display: flex; align-items: center; gap: 0.5rem;
  font-weight: 900; font-size: 1.5rem; letter-spacing: -0.5px;
  color: #111111; cursor: pointer; transition: color 0.3s ease;
}

.fc-logo svg { fill: #E52B1E; transition: fill 0.3s ease; }

.fc-nav-center {
  display: flex; gap: 2rem; align-items: center;
}

.fc-nav-center a {
  color: #333333; text-decoration: none;
  font-weight: 700; font-size: 0.85rem; letter-spacing: 1px;
  text-transform: uppercase; transition: color 0.3s ease;
}

.fc-nav-center a:hover { color: #E52B1E; }

.fc-nav-right-container {
  display: flex; align-items: center; gap: 1.5rem;
}

/* Custom Logo-based Language Dropdown */
.fc-logo-wrapper {
  position: relative; 
  z-index: 2000;
}

.fc-logo-lang-dropdown {
  position: absolute; top: calc(100% + 15px); left: 0;
  background-color: #ffffff; color: #111111;
  border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex; flex-direction: column; overflow: hidden;
  min-width: 150px; z-index: 2001;
}

.lang-option {
  padding: 1rem 1.5rem; font-weight: 700; font-size: 0.85rem;
  border-bottom: 1px solid rgba(0,0,0,0.05); cursor: pointer;
  transition: background-color 0.2s;
}

.lang-option:last-child { border-bottom: none; }
.lang-option:hover { background-color: #fceceb; color: #E52B1E; }

.lang-overlay {
  position: fixed; inset: 0; background-color: transparent; z-index: 2000;
}

/* BUTTONS */
.fc-btn-red {
  background-color: #E52B1E; color: #ffffff;
  border: none; border-radius: 4px;
  padding: 0.8rem 2rem; font-weight: 800; font-size: 0.85rem;
  letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; transition: background-color 0.3s ease, transform 0.2s;
}

.fc-btn-red:hover { background-color: #c42217; }

.fc-btn-outline {
  background-color: transparent; color: #ffffff;
  border: 2px solid #ffffff; border-radius: 4px;
  padding: 0.75rem 2rem; font-weight: 800; font-size: 0.85rem;
  letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s ease;
}

.fc-btn-outline:hover {
  background-color: #ffffff; color: #111111;
}

.fc-btn-dark {
  background-color: #222222; color: #ffffff;
  border: none; border-radius: 4px;
  padding: 0.8rem 2.5rem; font-weight: 800; font-size: 0.85rem;
  letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; transition: background-color 0.3s ease;
}

.fc-btn-dark:hover { background-color: #000000; }

.fc-btn-large {
  padding: 1.2rem 2.5rem; font-size: 0.95rem;
}

/* LOADING & ERROR */
.loading-overlay, .error-overlay {
  height: 100vh; width: 100vw;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  background-color: #1a1a1a; color: white;
}

.spinner {
  width: 50px; height: 50px; border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.1); border-left-color: #E52B1E;
  animation: spin 1s linear infinite; margin-bottom: 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* HERO SECTION */
.fc-hero {
  position: relative; 
  min-height: 100vh; 
  width: 100%;
  display: flex; justify-content: center; align-items: center; text-align: center;
  padding: 140px 0 160px; /* Accounts for navbar top and banner bottom */
}

.video-bg-container {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1; overflow: hidden;
}

.video-bg {
  position: absolute; 
  top: 50%; left: 50%; 
  width: 100vw !important; 
  height: 56.25vw !important; /* 16:9 ratio */
  min-height: 100vh !important;
  min-width: 177.77vh !important;
  /* Use scale to excessively enlarge the iframe so it never shows edges even if the container stretches taller than 100vh */
  transform: translate(-50%, -50%) scale(1.5);
  border: none;
  pointer-events: none; /* Ignore clicks */
}

.video-overlay {
  position: absolute; inset: 0; z-index: 2;
  background: rgba(0, 0, 0, 0.55); /* Darkens the video slightly for text readability */
}

.fc-hero-content {
  position: relative; z-index: 10; max-width: 1000px; padding: 3rem 4rem;
  display: flex; flex-direction: column; align-items: center;
  background: rgba(0, 0, 0, 0.4); /* Dark semi-transparent highlight */
  backdrop-filter: blur(12px); /* Glassmorphism effect */
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.fc-hero-eyebrow {
  color: #E52B1E; font-size: 1rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase; margin-bottom: 1.5rem;
}

.fc-hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 900; line-height: 1.1;
  color: #ffffff; text-transform: uppercase; margin: 0 0 1.5rem 0;
  letter-spacing: -2px; text-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.fc-hero-subtitle {
  font-size: 1.5rem; font-weight: 600; color: #ffffff;
  margin: 0 0 3rem 0; letter-spacing: 1px; opacity: 0.9;
}

.fc-hero-actions {
  display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center;
}

/* BANNER SECTION */
.fc-banner-wrapper {
  position: relative; width: 100%; z-index: 20;
  display: flex; justify-content: center;
  background-color: #f4f4f5; /* Light grey background directly below hero */
  padding: 3rem 2rem; 
}

.fc-banner {
  background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border-radius: 8px; padding: 2rem 3rem; width: 100%; max-width: 1200px;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 1rem;
  border: 1px solid rgba(0,0,0,0.05);
}

.fc-banner-left { display: flex; flex-direction: column; }

.fc-banner-label {
  font-size: 0.8rem; font-weight: 700; color: #888888;
  text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.3rem;
}

.fc-banner-text {
  font-size: 1.5rem; font-weight: 800; color: #111111;
  text-transform: uppercase; letter-spacing: -0.5px;
}

/* GENERAL SECTIONS */
.fc-section { padding: 100px 0; }
.fc-gray-bg { background-color: #f9f9f9; }

.fc-container {
  max-width: 1200px; margin: 0 auto; padding: 0 2rem; width: 100%;
}

.fc-section-title {
  font-size: 2.5rem; font-weight: 900; color: #111111;
  text-transform: uppercase; letter-spacing: -1px; margin: 0 0 1rem 0;
}

.fc-divider {
  width: 60px; height: 4px; background-color: #E52B1E; margin-bottom: 2rem;
}
.fc-divider.center { margin: 0 auto 2rem auto; }

.fc-body-text {
  font-size: 1.15rem; line-height: 1.8; color: #555555;
  font-weight: 400; margin-bottom: 1.5rem;
}

.fc-verse-quote {
  font-style: italic; font-size: 1.25rem; font-weight: 600;
  color: #333333; margin-bottom: 1.5rem; border-left: 4px solid #E52B1E;
  padding-left: 1.5rem;
}

/* GRIDS */
.fc-grid-2 {
  display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
}

.fc-image-col img { width: 100%; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

.fc-grid-3 {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
}

/* CARDS */
.fc-card {
  background: #ffffff; border-radius: 8px; overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04); transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fc-card:hover {
  transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.08);
}

.fc-card-img-wrap { width: 100%; height: 240px; overflow: hidden; }
.fc-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.fc-card:hover .fc-card-img-wrap img { transform: scale(1.05); }

.fc-card-body { padding: 2rem; }

.fc-card-title {
  font-size: 1.3rem; font-weight: 800; color: #111111;
  text-transform: uppercase; margin: 0 0 1rem 0; letter-spacing: -0.5px;
}

.fc-card-text {
  font-size: 1rem; color: #666666; font-weight: 400; line-height: 1.6; margin-bottom: 1.5rem;
}

.fc-card-link {
  font-weight: 700; color: #E52B1E; text-decoration: none;
  font-size: 0.9rem; letter-spacing: 1px; transition: color 0.3s ease;
}

.fc-card-link:hover { color: #111111; }

/* FOOTER */
.fc-footer {
  background-color: #111111; padding: 4rem 2rem; color: #ffffff;
}

.fc-footer-logo {
  font-weight: 900; font-size: 2rem; letter-spacing: -1px; margin-bottom: 1rem;
}

.fc-footer-text {
  color: #888888; font-size: 0.9rem;
}

/* ANIMATIONS */
.reveal-fade { animation: fadeUp 1s ease-out forwards; }
@keyframes fadeUp { from { opacity: 0; } to { opacity: 1; } }

/* RESPONSIVE */
@media (max-width: 1024px) {
  .fc-hero-title { font-size: 3.5rem; }
  .fc-banner { margin-top: 0; box-shadow: none; border: 1px solid #eeeeee; }
  .fc-reflection-section { padding-top: 4rem; }
}

@media (max-width: 768px) {
  .fc-nav-center { display: none; }
  .desktop-only { display: none; }
  .fc-grid-2, .fc-grid-3 { grid-template-columns: 1fr; gap: 2rem; }
  .fc-hero-content { padding: 2rem 1.5rem; }
  .fc-hero-title { font-size: 2.5rem; letter-spacing: -1px; }
  .fc-section { padding: 60px 0; }
  .fc-banner { flex-direction: column; text-align: center; }
  .fc-section-title { font-size: 2rem; }
  .fc-hero-actions { flex-direction: column; width: 100%; }
  .fc-hero-actions button { width: 100%; }
}
</style>
