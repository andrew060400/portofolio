<template>
  <div class="fc-layout">
    <!-- NAVIGATION -->
    <nav :class="['fc-navbar', { 'is-scrolled': isScrolled }]">
      <div class="fc-nav-container">
        <!-- Logo Acting As Language Selector -->
        <div class="fc-logo-wrapper">
          <div class="fc-logo" @click="showLangMenu = !showLangMenu">
            <img src="/daily-manna.jpeg" alt="Logo" class="fc-logo-img" />
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
        <p class="fc-body-text text-white">{{ t.error_desc }}</p>
        <button @click="fetchVerse" class="fc-btn-red mt-4">{{ t.try_again }}</button>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else-if="verseData" class="content-wrapper reveal-fade">

      <!-- HERO SECTION -->
      <header class="fc-hero">
        <div class="video-bg-container">
          <iframe id="youtube-bg" class="video-bg"
            src="https://www.youtube.com/embed/KSR68RPsjFk?autoplay=1&mute=0&playsinline=1&loop=1&playlist=KSR68RPsjFk&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
            title="YouTube background player" frameborder="0" allow="autoplay; fullscreen; picture-in-picture"
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
              <img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1470&auto=format&fit=crop"
                alt="Peaceful reflection" class="fc-rounded-img" />
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
                  <svg v-if="!isSpeaking" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="margin-right: 8px; vertical-align: text-bottom;">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="margin-right: 8px; vertical-align: text-bottom;">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                  {{ isSpeaking ? t.stop_reading : t.read_aloud }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PRAYER CORNER (POJOK DOA) CHAT SECTION -->
      <section class="fc-section fc-gray-bg" id="prayer-corner">
        <div class="fc-container">
          <h2 class="fc-section-title text-center">{{ t.prayer_corner_title }}</h2>
          <p class="fc-body-text text-center" style="max-width: 600px; margin: 0 auto 2rem;">{{ t.prayer_corner_desc }}
          </p>
          <div class="fc-divider center"></div>

          <div class="chat-container mt-4">
            <!-- Chat Messages History -->
            <div class="chat-history" ref="chatHistoryRef">
              <!-- Welcome message from AI -->
              <div class="chat-message ai-message">
                <div class="chat-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div class="chat-bubble">{{ t.prayer_welcome }}</div>
              </div>

              <!-- Dynamically rendered messages -->
              <div v-for="(msg, index) in prayerHistory" :key="index"
                :class="['chat-message', msg.role === 'user' ? 'user-message' : 'ai-message']">
                <div v-if="msg.role === 'ai'" class="chat-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <!-- Content renders markdown line breaks logically -->
                <div class="chat-bubble" v-html="formatChatContent(msg.content)"></div>
              </div>

              <!-- Typing Indicator -->
              <div v-if="isPrayerLoading" class="chat-message ai-message">
                <div class="chat-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div class="chat-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <!-- Scroll anchoring -->
              <div ref="prayerEndRef"></div>
            </div>

            <!-- Chat Input Area -->
            <div class="chat-input-area">
              <textarea v-model="prayerInput" @keydown.enter.prevent="submitPrayerRequest"
                :placeholder="t.prayer_placeholder" rows="1" class="chat-textarea"
                :disabled="isPrayerLoading"></textarea>
              <button class="chat-send-btn" @click="submitPrayerRequest"
                :disabled="!prayerInput.trim() || isPrayerLoading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ADDITIONAL CARDS SECTION (Simulating Ministries/Connect) -->
      <section class="fc-section">
        <div class="fc-container">
          <h2 class="fc-section-title text-center">{{ t.explore_more }}</h2>
          <div class="fc-divider center"></div>

          <div class="fc-grid-3 mt-5">
            <div class="fc-card">
              <div class="fc-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1400&auto=format&fit=crop"
                  alt="Card 1" />
              </div>
              <div class="fc-card-body">
                <h3 class="fc-card-title">{{ t.card_1_title }}</h3>
                <p class="fc-card-text">{{ t.card_1_desc }}</p>
                <a href="#" class="fc-card-link">{{ t.read_more }} &rarr;</a>
              </div>
            </div>
            <div class="fc-card">
              <div class="fc-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1400&auto=format&fit=crop"
                  alt="Card 2" />
              </div>
              <div class="fc-card-body">
                <h3 class="fc-card-title">{{ t.card_2_title }}</h3>
                <p class="fc-card-text">{{ t.card_2_desc }}</p>
                <a href="#" class="fc-card-link">{{ t.find_group }} &rarr;</a>
              </div>
            </div>
            <div class="fc-card">
              <div class="fc-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1400&auto=format&fit=crop"
                  alt="Card 3" />
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

      <!-- BIBLE STORIES SECTION -->
      <section class="fc-section fc-gray-bg" id="bible-stories">
        <div class="fc-container text-center">
          <h2 class="fc-section-title">{{ t.bible_stories_title }}</h2>
          <p class="fc-body-text" style="max-width: 600px; margin: 0 auto 2rem;">{{ t.bible_stories_desc }}</p>
          <div class="fc-divider center"></div>

          <div class="story-card-container">
            <a href="https://gemini.google.com/share/79bb2850d60e" target="_blank" class="premium-story-card">
              <div class="premium-story-img">
                <img src="/daud-saul.png" alt="Kisah Raja Daud" />
                <div class="story-overlay">
                  <div class="play-icon-pulse">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" />
                    </svg>
                  </div>
                </div>
                <div class="story-badge">{{ t.story_badge }}</div>
              </div>
              <div class="premium-story-content">
                <h3 class="story-title">{{ t.story_title }}</h3>
                <p class="story-desc">{{ t.story_desc }}</p>
                <div class="story-footer">
                  <span class="story-action">{{ t.story_action }}</span>
                  <span class="story-arrow">&rarr;</span>
                </div>
              </div>
            </a>
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

  // Chat / Prayer Corner State
  const prayerInput = ref('')
  const prayerHistory = ref([])
  const isPrayerLoading = ref(false)
  const chatHistoryRef = ref(null)
  const prayerEndRef = ref(null)

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
      prompt_instruction: 'You are a compassionate Christian devotional writer. Provide a daily Bible verse along with a short, meaningful reflection. VERY IMPORTANT: Your response must be entirely in ENGLISH. Return the output STRICTLY as a JSON object with keys: "reference" (the Bible verse reference, e.g., "John 3:16"), "text" (the actual verse text in English), and "reflection" (a 2-3 sentence thoughtful reflection in English).',
      prayer_corner_title: 'PRAYER CORNER',
      prayer_corner_desc: 'Bring your burdens here. Share your struggles below, and we will pray with you and provide specific prayer points based on the word of God.',
      prayer_welcome: 'Hello. I am here to listen and pray with you. What challenges are you facing right now that we can lift up together?',
      prayer_placeholder: 'Share your burden here...',
      prayer_prompt_system: `You are a deeply empathetic, loving Christian prayer counselor. A user will share their struggles or life problems with you. Provide brief, comforting words of encouragement rooted in scripture, then provide a bulleted list of 2-3 specific, actionable "Prayer Points" (pokok doa) that they can use to pray over their situation. Always respond empathetically. Do not act like an AI, but like a compassionate counselor. VERY IMPORTANT: Respond strictly in ENGLISH.`,
      bible_stories_title: 'BIBLE STORIES',
      bible_stories_desc: 'Journey through the scriptures with our interactive bible stories collection.',
      story_badge: 'INTERACTIVE STORY',
      story_title: 'The Story of David fleeing from Saul',
      story_desc: 'A valuable lesson on patience, unwavering trust in God, and respecting His appointed authority even when we are in difficult and stressful times.',
      story_action: 'Read the Full Story'
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
      prompt_instruction: 'Anda adalah seorang penulis renungan Kristen yang penuh kasih. Berikan satu ayat Alkitab harian beserta renungan singkat yang bermakna. SANGAT PENTING: Seluruh respons Anda HARUS menggunakan BAHASA INDONESIA. Kembalikan output SECARA KETAT sebagai objek JSON dengan kunci: "reference" (referensi ayat, contoh: "Yohanes 3:16"), "text" (teks ayat Alkitab dalam Bahasa Indonesia), dan "reflection" (2-3 kalimat renungan yang bijak dalam Bahasa Indonesia).',
      prayer_corner_title: 'POJOK DOA',
      prayer_corner_desc: 'Bawa beban Anda ke sini. Bagikan pergumulan Anda di bawah ini, dan kami akan berdoa bersama Anda serta memberikan pokok-pokok doa khusus berdasarkan firman Tuhan.',
      prayer_welcome: 'Halo. Saya di sini untuk mendengarkan dan berdoa bersama Anda. Pergumulan atau tantangan apa yang sedang Anda hadapi saat ini?',
      prayer_placeholder: 'Bagikan pergumulan Anda di sini...',
      prayer_prompt_system: `Anda adalah seorang konselor doa Kristen yang sangat empati dan penuh kasih. Pengguna akan membagikan pergumulan atau masalah hidup mereka. Berikan kata-kata penghiburan singkat yang menguatkan dan berakar pada Alkitab, lalu berikan daftar berformat bullet berisi 2-3 "Pokok Doa" yang spesifik yang dapat mereka gunakan untuk mendoakan situasi tersebut. Tolong jangan bertindak kaku seperti AI, melainkan seperti konselor manusia yang penyayang. SANGAT PENTING: Respons HARUS menggunakan BAHASA INDONESIA.`,
      bible_stories_title: 'KISAH ALKITAB',
      bible_stories_desc: 'Jelajahi kebenaran firman melalui koleksi buku cerita Alkitab interaktif kami.',
      story_badge: 'KISAH INTERAKTIF',
      story_title: 'Kisah Raja Daud yang di kejar Saul',
      story_desc: 'Pelajaran berharga tentang kesabaran, kepercayaan penuh kepada Tuhan, dan menghormati otoritas yang ditetapkan-Nya meskipun kita sedang berada dalam masa-masa yang sulit dan penuh tekanan.',
      story_action: 'Baca Kisah Selengkapnya'
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
      prompt_instruction: '你是一位以慈爱为怀的基督教灵修作家。请提供每日圣经经文和简短、有意义的灵修内容。非常重要：您的所有回复必须全部使用中文。必须严格返回一个JSON对象作为结果，键名为："reference"（圣经经文引用，例如："约翰福音 3:16"），"text"（中文经文内容），以及"reflection"（2-3句充满哲理的中文灵修）。',
      prayer_corner_title: '祷告角',
      prayer_corner_desc: '将你的重担交托在这里。请分享您当前面临的挣扎，我们将与您一同祷告，并根据神的话语提供具体的代祷事项。',
      prayer_welcome: '您好。我在这里倾听并与您一同祷告。您目前正面临什么挑战或挣扎可以向我分享？',
      prayer_placeholder: '在这里分享您的重担...',
      prayer_prompt_system: `你是一位极具同理心、充满爱心的基督教祷告辅导员。用户将与你分享他们的挣扎或生活问题。请根据圣经提供简短、安慰和鼓励的言辞，然后提供一个包含2-3个具体且有针对性的"代祷事项"（Prayer Points）的列表，供他们在当前处境中祷告使用。请务必表现出极大的同理心，不要表现得像冰冷的AI，而是像一位富有同情心的人类辅导员。非常重要：所有的回复必须使用中文（简体）。`,
      bible_stories_title: '圣经故事',
      bible_stories_desc: '通过我们的互动圣经故事集探索圣经。',
      story_badge: '互动故事',
      story_title: '大卫逃避扫罗的故事',
      story_desc: '这是关于忍耐、对上帝完全的信任，以及即使在困难和压力重重的时期也尊重祂所指定的权柄的宝贵功课。',
      story_action: '阅读完整故事'
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

  const formatChatContent = (content) => {
    if (!content) return ''
    // Simple naive markdown parsing for bold text and line breaks
    return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
  }

  const scrollToChatBottom = () => {
    setTimeout(() => {
      if (prayerEndRef.value) {
        prayerEndRef.value.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
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

  const submitPrayerRequest = async () => {
    if (!prayerInput.value.trim() || isPrayerLoading.value) return;

    const userText = prayerInput.value.trim();
    prayerInput.value = '';

    // Add user message to history
    prayerHistory.value.push({ role: 'user', content: userText });
    scrollToChatBottom();

    isPrayerLoading.value = true;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('API Key missing');
      }

      const genAI = new GoogleGenerativeAI(apiKey);

      // Pass the previous context as chat history specifically formatted for the model
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: t.value.prayer_prompt_system,
      });

      // Initialize chat session
      const chat = model.startChat({
        history: prayerHistory.value.slice(0, -1).map(msg => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      });

      // Send the new message
      const result = await chat.sendMessage(userText);
      const responseText = result.response.text();

      prayerHistory.value.push({
        role: 'ai',
        content: responseText
      });

    } catch (err) {
      console.error('Prayer Error:', err);
      let errorMsg = currentLang.value === 'id' ? 'Maaf, saya sedang kesulitan terhubung. Bisakah Anda mengulanginya?' :
        currentLang.value === 'zh' ? '抱歉，我当前无法连接网络。您能再试一次吗？' :
          'Sorry, I am having trouble connecting. Could you please try again?';

      prayerHistory.value.push({ role: 'ai', content: errorMsg });
    } finally {
      isPrayerLoading.value = false;
      scrollToChatBottom();
    }
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

      if (currentLang.value === 'id') {
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

    const today = new Date().toLocaleDateString()
    const langCode = currentLang.value

    try {
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
      console.error('Gemini Fetch Error:', err)

      try {
        // Fallback to bible-api.com
        const apiLangMap = { 'en': 'web', 'id': 'web', 'zh': 'cuv' } // ID uses 'web' (EN) since no Indonesian translation is available on the API
        const translationId = apiLangMap[langCode] || 'web'

        const response = await fetch(`https://bible-api.com/data/${translationId}/random`)
        if (!response.ok) throw new Error('Bible-API failed')

        const fallbackData = await response.json()
        const v = fallbackData.random_verse

        const defaultReflection =
          langCode === 'id' ? 'Biarlah ayat harian ini menjadi perenungan dan kekuatan bagi Anda.' :
            langCode === 'zh' ? '愿这节每日经文成为你的默想和力量。' :
              'May this daily verse be a source of meditation and strength for you.'

        verseData.value = {
          reference: `${v.book} ${v.chapter}:${v.verse}`,
          text: v.text.trim(),
          reflection: defaultReflection
        }
        store.setDailyVerse(langCode, today, verseData.value)
        error.value = false

      } catch (fallbackErr) {
        console.error('Fallback API Error:', fallbackErr)
        error.value = true
      }
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

  .text-center {
    text-align: center;
  }

  .text-white {
    color: #ffffff !important;
  }

  .mt-4 {
    margin-top: 1.5rem;
  }

  .mt-5 {
    margin-top: 3rem;
  }

  /* NAVIGATION (Always Solid) */
  .fc-navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    z-index: 1000;
    background-color: #ffffff;
    transition: box-shadow 0.3s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    /* Subtle border when at the top */
  }

  .fc-navbar.is-scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border-bottom-color: transparent;
  }

  .fc-nav-container {
    width: 100%;
    max-width: 1400px;
    height: 100%;
    margin: 0 auto;
    padding: 0 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fc-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 900;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
    color: #111111;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .fc-logo-img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease, border-color 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .fc-nav-center {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .fc-nav-center a {
    color: #333333;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  .fc-nav-center a:hover {
    color: #E52B1E;
  }

  .fc-nav-right-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  /* Custom Logo-based Language Dropdown */
  .fc-logo-wrapper {
    position: relative;
    z-index: 2000;
  }

  .fc-logo-lang-dropdown {
    position: absolute;
    top: calc(100% + 15px);
    left: 0;
    background-color: #ffffff;
    color: #111111;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 150px;
    z-index: 2001;
  }

  .lang-option {
    padding: 1rem 1.5rem;
    font-weight: 700;
    font-size: 0.85rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .lang-option:last-child {
    border-bottom: none;
  }

  .lang-option:hover {
    background-color: #fceceb;
    color: #E52B1E;
  }

  .lang-overlay {
    position: fixed;
    inset: 0;
    background-color: transparent;
    z-index: 2000;
  }

  /* BUTTONS */
  .fc-btn-red {
    background-color: #E52B1E;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 0.8rem 2rem;
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s;
  }

  .fc-btn-red:hover {
    background-color: #c42217;
  }

  .fc-btn-outline {
    background-color: transparent;
    color: #ffffff;
    border: 2px solid #ffffff;
    border-radius: 4px;
    padding: 0.75rem 2rem;
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .fc-btn-outline:hover {
    background-color: #ffffff;
    color: #111111;
  }

  .fc-btn-dark {
    background-color: #222222;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 0.8rem 2.5rem;
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .fc-btn-dark:hover {
    background-color: #000000;
  }

  .fc-btn-large {
    padding: 1.2rem 2.5rem;
    font-size: 0.95rem;
  }

  /* LOADING & ERROR */
  .loading-overlay,
  .error-overlay {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #1a1a1a;
    color: white;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: #E52B1E;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* HERO SECTION */
  .fc-hero {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 140px 0 160px;
    /* Accounts for navbar top and banner bottom */
  }

  .video-bg-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    overflow: hidden;
  }

  .video-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw !important;
    height: 56.25vw !important;
    /* 16:9 ratio */
    min-height: 100vh !important;
    min-width: 177.77vh !important;
    /* Use scale to excessively enlarge the iframe so it never shows edges even if the container stretches taller than 100vh */
    transform: translate(-50%, -50%) scale(1.5);
    border: none;
    pointer-events: none;
    /* Ignore clicks */
  }

  .video-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.55);
    /* Darkens the video slightly for text readability */
  }

  .fc-hero-content {
    position: relative;
    z-index: 10;
    max-width: 1000px;
    padding: 3rem 4rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.4);
    /* Dark semi-transparent highlight */
    backdrop-filter: blur(12px);
    /* Glassmorphism effect */
    -webkit-backdrop-filter: blur(12px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  }

  .fc-hero-eyebrow {
    color: #E52B1E;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  .fc-hero-title {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 900;
    line-height: 1.1;
    color: #ffffff;
    text-transform: uppercase;
    margin: 0 0 1.5rem 0;
    letter-spacing: -2px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .fc-hero-subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 3rem 0;
    letter-spacing: 1px;
    opacity: 0.9;
  }

  .fc-hero-actions {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* BANNER SECTION */
  .fc-banner-wrapper {
    position: relative;
    width: 100%;
    z-index: 20;
    display: flex;
    justify-content: center;
    background-color: #f4f4f5;
    /* Light grey background directly below hero */
    padding: 3rem 2rem;
  }

  .fc-banner {
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 2rem 3rem;
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .fc-banner-left {
    display: flex;
    flex-direction: column;
  }

  .fc-banner-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #888888;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.3rem;
  }

  .fc-banner-text {
    font-size: 1.5rem;
    font-weight: 800;
    color: #111111;
    text-transform: uppercase;
    letter-spacing: -0.5px;
  }

  /* GENERAL SECTIONS */
  .fc-section {
    padding: 100px 0;
  }

  .fc-gray-bg {
    background-color: #f9f9f9;
  }

  .fc-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .fc-section-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #111111;
    text-transform: uppercase;
    letter-spacing: -1px;
    margin: 0 0 1rem 0;
  }

  .fc-divider {
    width: 60px;
    height: 4px;
    background-color: #E52B1E;
    margin-bottom: 2rem;
  }

  .fc-divider.center {
    margin: 0 auto 2rem auto;
  }

  .fc-body-text {
    font-size: 1.15rem;
    line-height: 1.8;
    color: #555555;
    font-weight: 400;
    margin-bottom: 1.5rem;
  }

  .fc-verse-quote {
    font-style: italic;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333333;
    margin-bottom: 1.5rem;
    border-left: 4px solid #E52B1E;
    padding-left: 1.5rem;
  }

  /* STORY GRID */
  .story-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    align-items: stretch;
    margin-top: 2rem;
  }

  .story-frame-wrap {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .story-frame-wrap:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }

  /* GRIDS */
  .fc-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .fc-image-col img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  .fc-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  /* CARDS */
  .fc-card {
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .fc-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  }

  .fc-card-img-wrap {
    width: 100%;
    height: 240px;
    overflow: hidden;
  }

  .fc-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .fc-card:hover .fc-card-img-wrap img {
    transform: scale(1.05);
  }

  .fc-card-body {
    padding: 2rem;
  }

  .fc-card-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: #111111;
    text-transform: uppercase;
    margin: 0 0 1rem 0;
    letter-spacing: -0.5px;
  }

  .fc-card-text {
    font-size: 1rem;
    color: #666666;
    font-weight: 400;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .fc-card-link {
    font-weight: 700;
    color: #E52B1E;
    text-decoration: none;
    font-size: 0.9rem;
    letter-spacing: 1px;
    transition: color 0.3s ease;
  }

  .fc-card-link:hover {
    color: #111111;
  }

  /* FOOTER */
  .fc-footer {
    background-color: #111111;
    padding: 4rem 2rem;
    color: #ffffff;
  }

  .fc-footer-logo {
    font-weight: 900;
    font-size: 2rem;
    letter-spacing: -1px;
    margin-bottom: 1rem;
  }

  .fc-footer-text {
    color: #888888;
    font-size: 0.9rem;
  }

  /* CHAT COMPONENT CSS */
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .chat-history {
    padding: 2rem;
    height: 400px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #fafafa;
  }

  .chat-message {
    display: flex;
    align-items: flex-end;
    max-width: 85%;
  }

  .chat-message.ai-message {
    align-self: flex-start;
  }

  .chat-message.user-message {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .chat-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #fceceb;
    color: #E52B1E;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  .chat-message.ai-message .chat-avatar {
    margin-right: 12px;
  }

  .chat-message.user-message .chat-avatar {
    margin-left: 12px;
    background-color: #f0f0f0;
    color: #666;
    display: none;
  }

  .chat-bubble {
    padding: 1rem 1.25rem;
    border-radius: 16px;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .ai-message .chat-bubble {
    background-color: #ffffff;
    color: #333333;
    border-bottom-left-radius: 4px;
    border: 1px solid #eeeeee;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  }

  .user-message .chat-bubble {
    background-color: #E52B1E;
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 15px rgba(229, 43, 30, 0.2);
  }

  .chat-input-area {
    display: flex;
    align-items: flex-end;
    padding: 1.5rem;
    background-color: #ffffff;
    border-top: 1px solid #eeeeee;
    gap: 1rem;
  }

  .chat-textarea {
    flex-grow: 1;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 0.8rem 1.5rem;
    font-family: inherit;
    font-size: 0.95rem;
    resize: none;
    background-color: #f9f9f9;
    transition: border-color 0.3s;
    min-height: 50px;
    line-height: 1.5;
    color: #111;
  }

  .chat-textarea:focus {
    outline: none;
    border-color: #E52B1E;
    background-color: #ffffff;
  }

  .chat-send-btn {
    background-color: #E52B1E;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.2s, opacity 0.3s;
  }

  .chat-send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229, 43, 30, 0.3);
  }

  .chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Typing indicator dots */
  .typing-indicator span {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #bbbbbb;
    border-radius: 50%;
    margin: 0 2px;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {

    0%,
    80%,
    100% {
      transform: scale(0);
    }

    40% {
      transform: scale(1);
    }
  }

  /* ANIMATIONS */
  .reveal-fade {
    animation: fadeUp 1s ease-out forwards;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  /* PREMIUM STORY CARD */
  .story-card-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .premium-story-card {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .premium-story-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px rgba(229, 43, 30, 0.15);
  }

  .premium-story-img {
    position: relative;
    width: 100%;
    height: 350px;
    overflow: hidden;
  }

  .premium-story-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 0.7s ease;
  }

  .premium-story-card:hover .premium-story-img img {
    transform: scale(1.08);
  }

  .story-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.6));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }

  .premium-story-card:hover .story-overlay {
    opacity: 1;
  }

  .play-icon-pulse {
    width: 64px;
    height: 64px;
    background: #E52B1E;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 rgba(229, 43, 30, 0.4);
    animation: pulseGlow 2s infinite;
    transition: transform 0.3s ease;
  }

  .premium-story-card:hover .play-icon-pulse {
    transform: scale(1.1);
  }

  .story-badge {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    color: #E52B1E;
    padding: 0.5rem 1.2rem;
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
  }

  .premium-story-content {
    padding: 2.5rem;
    text-align: left;
    background: #ffffff;
    position: relative;
  }

  .story-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: #111111;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .story-desc {
    font-size: 1.05rem;
    color: #555555;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  .story-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.5rem;
    border-top: 1px solid #eeeeee;
  }

  .story-action {
    color: #E52B1E;
    font-weight: 800;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .story-arrow {
    color: #E52B1E;
    font-size: 1.5rem;
    font-weight: bold;
    transition: transform 0.3s ease;
  }

  .premium-story-card:hover .story-arrow {
    transform: translateX(8px);
  }

  @keyframes pulseGlow {
    0% {
      box-shadow: 0 0 0 0 rgba(229, 43, 30, 0.7);
    }

    70% {
      box-shadow: 0 0 0 20px rgba(229, 43, 30, 0);
    }

    100% {
      box-shadow: 0 0 0 0 rgba(229, 43, 30, 0);
    }
  }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .fc-hero-title {
      font-size: 3.5rem;
    }

    .fc-banner {
      margin-top: 0;
      box-shadow: none;
      border: 1px solid #eeeeee;
    }

    .fc-reflection-section {
      padding-top: 4rem;
    }
  }

  @media (max-width: 768px) {
    .fc-nav-center {
      display: none;
    }

    .desktop-only {
      display: none;
    }

    .fc-grid-2,
    .fc-grid-3 {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .fc-hero-content {
      padding: 2rem 1.5rem;
    }

    .fc-hero-title {
      font-size: 2.5rem;
      letter-spacing: -1px;
    }

    .fc-section {
      padding: 60px 0;
    }

    .fc-banner {
      flex-direction: column;
      text-align: center;
    }

    .fc-section-title {
      font-size: 2rem;
    }

    .fc-hero-actions {
      flex-direction: column;
      width: 100%;
    }

    .fc-hero-actions button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .fc-container {
      padding: 0 1rem;
    }

    .fc-hero-title {
      font-size: 2rem;
    }

    .fc-hero-subtitle {
      font-size: 1.15rem;
    }

    .fc-hero-content {
      padding: 1.5rem 1rem;
    }

    .fc-section-title {
      font-size: 1.75rem;
      word-break: break-word;
    }

    .fc-banner {
      padding: 1.5rem 1rem;
    }

    .fc-card-body {
      padding: 1.5rem 1rem;
    }

    .chat-history {
      padding: 1rem;
      height: 350px;
    }

    .chat-input-area {
      padding: 1rem;
      gap: 0.5rem;
    }

    .chat-textarea {
      padding: 0.6rem 1rem;
    }

    .fc-grid-2 {
      gap: 2rem;
    }

    .fc-verse-quote {
      padding-left: 1rem;
      font-size: 1.15rem;
    }
  }
</style>