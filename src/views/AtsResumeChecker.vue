<template>
  <div class="adham-layout">
    <!-- Navigation -->
    <nav class="sticky-nav">
      <div class="nav-container">
        <div class="logo-wrapper">
          <img src="/logo.jpeg" alt="Logo" class="nav-logo-img" />
          <div class="logo">Andrew Irawan.</div>
        </div>
        <div class="links">
          <router-link to="/andrew">About</router-link>
          <router-link to="/andrew#portfolio">Featured Work</router-link>
          <router-link to="/ats-resume-checker" class="nav-highlight active" @click.prevent>ATS Scanner</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="ats-wrapper">
      <header class="ats-header reveal-hidden" :class="{'reveal-visible': mounted}">
        <div class="header-content">
          <h1>Resume ATS Scanner <span>+ Gemini AI Chat</span></h1>
          <p class="subtitle">Platform cerdas untuk menganalisis kecocokan CV Anda terhadap kriteria Applicant Tracking System (ATS). Temukan kata kunci yang hilang dan diskusikan strategi perbaikan karir Anda bersama asisten AI.</p>
        </div>
      </header>

      <main class="ats-main reveal-hidden delay-100" :class="{'reveal-visible': mounted}">
        <!-- LEFT PANE: ATS SCANNER -->
        <section class="pane left-pane">
          <div class="pane-header">
            <span class="step-badge">Phase 1</span>
            <h2>ATS Scan Engine</h2>
          </div>
          <p class="pane-desc">Upload CV Anda dan temukan gap *keywords* berdasarkan Job Description target.</p>

          <div class="card upload-card" :class="{ 'drag-over': isDragging }" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
            <label class="card-label">Document Upload (PDF/DOCX/TXT)</label>
            <div class="upload-controls">
              <button class="btn-dark" @click="$refs.fileInput.click()">
                Select File
              </button>
              <span class="file-name-display">{{ fileName || 'No document selected' }}</span>
            </div>
            <input type="file" ref="fileInput" accept=".pdf,.docx,.txt" @change="handleFileUpload" style="display: none" />
            <p v-if="isExtracting" class="text-status text-warning mt-3">Extracting text...</p>
            <p v-if="resumeText && !isExtracting" class="text-status text-success mt-3">✓ Terbaca sukses ({{ resumeText.length }} karakter)</p>
          </div>

          <div class="input-group">
            <label class="card-label mt-4">Target Job Description (Optional)</label>
            <textarea 
              class="textarea-light" 
              v-model="jobDescText" 
              placeholder="Paste Job Description role tujuan Anda di sini untuk akurasi maksimal..."></textarea>
          </div>

          <button class="btn-primary" @click="analyze" :disabled="isAnalyzing || !resumeText">
            {{ isAnalyzing ? 'Scanning with Gemini...' : 'Initiate Scan' }}
          </button>

          <!-- RESULTS STATE -->
          <div v-if="!result" class="card empty-state">
            <h3>Belum ada hasil analisis.</h3>
            <p>Silakan upload file dan lakukan scan.</p>
          </div>
          
          <div v-else class="results-container reveal-hidden delay-200" :class="{'reveal-visible': result}">
            <div class="result-score-card">
               <div class="score-header">
                  <h3>Match Score</h3>
                  <div class="score-badge" :style="{ backgroundColor: scoreColor }">{{ result.score }}%</div>
               </div>
               <p class="score-desc" v-text="scoreFeedback"></p>
            </div>
            <div class="result-keywords">
              <div class="keyword-box">
                <h4 class="text-success text-bold">Found Keywords</h4>
                <div class="chips-container">
                  <span class="chip chip-success" v-for="kw in result.found" :key="kw">{{ kw }}</span>
                  <span v-if="!result.found.length" class="text-muted text-sm">-</span>
                </div>
              </div>
              <div class="keyword-box">
                <h4 class="text-danger text-bold">Missing Keywords</h4>
                <div class="chips-container">
                  <span class="chip chip-danger" v-for="kw in result.missing" :key="kw">{{ kw }}</span>
                   <span v-if="!result.missing.length" class="text-muted text-sm">-</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT PANE: GEMINI CHATBOT -->
        <section class="pane right-pane">
          <div class="pane-header">
            <span class="step-badge">Phase 2</span>
            <h2>AI Assistant Coach</h2>
          </div>
          <p class="pane-desc">Diskusikan hasil CV Anda secara langsung dengan sistem AI berbasis Gemini.</p>

          <!-- PRESET PROMPTS -->
          <div class="prompt-chips">
            <button class="prompt-chip" @click="sendToChat('Bantu identifikasi 3 perbaikan paling kritis untuk CV ini.')">
              Bantu identifikasi 3 perbaikan paling kritis untuk CV ini.
            </button>
            <button class="prompt-chip" @click="sendToChat('Rewrite pengalaman kerja terakhir saya agar lebih ATS-friendly.')">
              Rewrite pengalaman kerja terakhir saya agar lebih ATS-friendly.
            </button>
          </div>

          <!-- CHAT WINDOW -->
          <div class="chat-window-light" ref="chatWindow">
            <div v-for="(msg, index) in chatMessages" :key="index" :class="['chat-bubble-light', msg.role]">
              <span class="chat-sender">{{ msg.role === 'bot' ? 'SYSTEM AI' : 'YOU' }}</span>
              <p>{{ msg.text }}</p>
            </div>
            <div v-if="isBotTyping" class="chat-bubble-light bot typing">
              <span class="chat-sender">SYSTEM AI</span>
              <p>Memproses data<span class="dots">...</span></p>
            </div>
          </div>

          <!-- CHAT INPUT -->
          <div class="chat-input-area">
            <input 
              type="text" 
              class="input-light" 
              v-model="chatInput" 
              @keyup.enter="handleChatSubmit"
              placeholder="Ketik instruksi atau pertanyaan Anda..." />
            <button class="btn-dark px-4" @click="handleChatSubmit" :disabled="!chatInput.trim() || isBotTyping">
              Send
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai'

const mounted = ref(false)

// Left Pane: Scanner State
const isDragging = ref(false)
const fileInput = ref(null)
const fileName = ref('')
const isExtracting = ref(false)
const resumeText = ref('')
const jobDescText = ref('')
const isAnalyzing = ref(false)
const result = ref(null)

// Right Pane: Chatbot State
const chatInput = ref('')
const chatMessages = ref([
  { role: 'bot', text: 'Hi! Aku bisa bantu review CV kamu dan kasih saran ATS. Upload resume dulu, ya ✨' }
])
const isBotTyping = ref(false)
const chatWindow = ref(null)
const chatSession = ref(null)

// Gemini AI Setup
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
  }, 100)
})

// --- PDF Extractor Logic ---
const loadPdfJs = async () => {
  if (!window.pdfjsLib) {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js'
    document.head.appendChild(script)
    await new Promise(resolve => script.onload = resolve)
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
}

const processFile = async (file) => {
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf')
  fileName.value = file.name
  isExtracting.value = true
  resumeText.value = ''
  
  try {
    if (isPdf) {
      await loadPdfJs()
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const strings = textContent.items.map(item => item.str)
          fullText += strings.join(' ') + '\n'
      }
      resumeText.value = fullText
    } else {
      const text = await file.text()
      resumeText.value = text
    }
  } catch (err) {
    console.error('Extraction error:', err)
    alert('Gagal mengekstrak teks. Pastikan format file PDF/TXT terbaca dengan baik.')
  } finally {
    isExtracting.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// --- ATS Scan Logic (Gemini API) ---
const analyze = async () => {
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    alert('Silahkan isi VITE_GEMINI_API_KEY di dalam file .env terlebih dahulu.')
    return
  }

  isAnalyzing.value = true
  result.value = null
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are an expert ATS (Applicant Tracking System) scanner and career coach. Return your initial analysis strictly as JSON format with keys: "score" (number 0-100), "found_keywords" (array of strings), "missing_keywords" (array of strings), and "feedback" (string).'
    })

    const prompt = `
      Please analyze this resume against the job description.
      Job Description:
      ${jobDescText.value || 'No specific job description provided. Perform a general best-practice ATS scan for a tech role.'}
      
      Resume Text:
      ${resumeText.value}
    `

    const aiResult = await model.generateContent(prompt)
    const responseText = aiResult.response.text()
    
    // Attempt to extract JSON from response (sometimes wrapped in markdown code blocks)
    let jsonStr = responseText
    if (jsonStr.includes('\`\`\`json')) {
      jsonStr = jsonStr.split('\`\`\`json')[1].split('\`\`\`')[0].trim()
    } else if (jsonStr.includes('\`\`\`')) {
      jsonStr = jsonStr.split('\`\`\`')[1].split('\`\`\`')[0].trim()
    }

    const parsedJson = JSON.parse(jsonStr)

    // Map to component state
    result.value = {
      score: parsedJson.score || 0,
      found: parsedJson.found_keywords || [],
      missing: parsedJson.missing_keywords || []
    }

    // Initialize interactive Chat Session directly with context
    chatSession.value = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        },
        {
          role: 'model',
          parts: [{ text: responseText }]
        }
      ]
    })

    // Auto-message into chatbot
    chatMessages.value.push({
      role: 'bot',
      text: `Analisis riil via Gemini selesai! Skor ATS kamu adalah ${result.value.score}%. \n${parsedJson.feedback}\n\nApa yang ingin kamu perbaiki dari hasil ini?`
    })
    scrollToBottom()

  } catch (err) {
    console.error('Gemini API Error:', err)
    alert('Terjadi kesalahan saat menghubungi server AI. Cek console untuk detailnya.')
  } finally {
    isAnalyzing.value = false
  }
}

const scoreColor = computed(() => {
  if (!result.value) return '#64748b' // slate-500
  if (result.value.score >= 80) return '#22c55e' // green-500
  if (result.value.score >= 50) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
})

const scoreFeedback = computed(() => {
  if (!result.value) return ''
  if (result.value.score >= 80) return 'Bagus sekali! CV kamu sudah teroptimasi untuk role ini.'
  if (result.value.score >= 50) return 'Cukup baik, tapi masih perlu menambahkan beberapa keyword utama.'
  return 'Skor rendah. Sangat disarankan untuk merevisi CV agar lebih sesuai dengan Job Description.'
})

// --- Chatbot Logic (Gemini API) ---
const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindow.value) {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight
    }
  })
}

const sendToChat = (text) => {
  chatInput.value = text
  handleChatSubmit()
}

const handleChatSubmit = async () => {
  if (!chatInput.value.trim() || isBotTyping.value) return
  if (!chatSession.value) {
    alert('Silahkan jalankan Scan Resume terlebih dahulu untuk menginisialisasi AI Chatbot konteks CV Anda.')
    return
  }
  
  const userText = chatInput.value
  chatMessages.value.push({ role: 'user', text: userText })
  chatInput.value = ''
  scrollToBottom()
  
  isBotTyping.value = true
  
  try {
    const aiResponse = await chatSession.value.sendMessage(userText)
    const replyText = aiResponse.response.text()

    chatMessages.value.push({
      role: 'bot',
      text: replyText
    })
  } catch (error) {
    console.error('Chat Error:', error)
    chatMessages.value.push({
      role: 'bot',
      text: 'Maaf, terjadi kesalahan saat menghubungi AI.'
    })
  } finally {
    isBotTyping.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
/* Unified AndrewView Style Base */
.adham-layout {
  background-color: #fcfcfc;
  color: #111;
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
}

/* Nav (Copied directly from AndrewView.vue) */
.sticky-nav {
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: #111111;
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
  padding: 0 2rem;
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
  border-radius: 50%;
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
  color: #a5b4fc;
}

.links .nav-highlight.active {
  color: #ffffff;
  cursor: default;
}

/* ATS Layout Core */
.ats-wrapper {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.ats-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
}

.eyebrow {
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.ats-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #111;
  letter-spacing: -1px;
}

.ats-header h1 span {
  color: #6366f1; /* Keep indigo accent */
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
  max-width: 600px;
  margin: 0;
  line-height: 1.6;
}

/* Main Dual Pane Layout */
.ats-main {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 2rem;
  align-items: stretch;
}

.pane {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03); /* Soft unified shadow */
}

.pane-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.pane-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #111;
  letter-spacing: -0.5px;
}

.step-badge {
  background: #111;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.pane-desc {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Forms & Inputs */
.card-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.card {
  background: #fdfdfd;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 1.5rem;
}

.upload-card.drag-over {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.05);
}

.upload-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-dark {
  background: #111; 
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-dark:hover:not(:disabled) {
  background: #333;
  transform: translateY(-2px);
}

.btn-dark:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-name-display {
  background: #f8f8f8;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  color: #555;
  font-size: 0.9rem;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.textarea-light {
  width: 100%;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 1rem;
  color: #111;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 150px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.textarea-light:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-primary {
  margin-top: 1.5rem;
  width: 100%;
  background: #6366f1;
  color: white;
  border: none;
  padding: 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* Results State */
.empty-state {
  margin-top: 2rem;
  border-style: dashed;
  text-align: center;
  padding: 3rem 1rem;
  background: #fafafa;
}

.empty-state h3 {
  color: #111;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.results-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-score-card {
  background: #fdfdfd;
  border: 1px solid #eaeaea;
  padding: 1.5rem;
  border-radius: 12px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.score-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #111;
}

.score-badge {
  color: white;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 1.1rem;
}

.score-desc {
  color: #555;
  margin: 0;
  line-height: 1.5;
}

.result-keywords h4 {
  font-size: 0.95rem;
  margin: 0 0 0.75rem 0;
  color: #333;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.chip {
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  background: #f5f5f5;
  border: 1px solid #eaeaea;
  color: #333;
  font-weight: 500;
}

/* Right Pane Chatbot */
.prompt-chips {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.prompt-chip {
  background: #ffffff;
  border: 1px solid #eaeaea;
  color: #444;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.prompt-chip:hover {
  background: #fafafa;
  border-color: #111;
  color: #111;
  transform: translateX(4px);
}

.chat-window-light {
  flex: 1;
  background: #fcfcfc;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  min-height: 250px;
  max-height: 450px;
  margin-bottom: 1rem;
}

.chat-bubble-light {
  max-width: 85%;
  background: #ffffff;
  padding: 1.2rem 1.4rem;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.chat-bubble-light.user {
  align-self: flex-end;
  background: #f1f5f9; /* Slate 100 */
  border-color: #e2e8f0;
}

.chat-bubble-light.bot {
  align-self: flex-start;
}

.chat-sender {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #888;
  display: block;
  margin-bottom: 0.5rem;
}

.chat-bubble-light.bot .chat-sender {
  color: #6366f1;
}

.chat-bubble-light p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.chat-input-area {
  display: flex;
  gap: 0.75rem;
}

.input-light {
  flex: 1;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #111;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.input-light:focus {
  border-color: #111;
}

.px-4 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.dots { animation: blink 1.5s infinite steps(4, end); }
@keyframes blink { 0% { clip-path: inset(0 100% 0 0); } 100% { clip-path: inset(0 0 0 0); } }

/* Utilities */
.text-success { color: #16a34a !important; }
.text-danger { color: #dc2626 !important; }
.text-warning { color: #d97706 !important; }
.text-muted { color: #888; }
.text-sm { font-size: 0.85rem; }
.text-bold { font-weight: 700; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }

/* Responsive */
@media (max-width: 900px) {
  /* Main Layout */
  .ats-main { 
    grid-template-columns: 1fr; 
    gap: 1.5rem;
  }
  
  .ats-wrapper { 
    padding: 1.5rem 1rem; 
  }
  
  .ats-header { 
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    text-align: center; 
  }
  
  .ats-header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
    margin: 0 auto;
  }
  
  .pane { 
    padding: 1.5rem; 
    border-radius: 12px;
  }

  .pane-header h2 {
    font-size: 1.25rem;
  }
  
  /* Upload Area */
  .upload-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-dark {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .file-name-display {
    text-align: center;
  }

  /* Chat Area */
  .chat-window-light {
    padding: 1rem;
    max-height: 400px;
  }
  
  .chat-bubble-light {
    max-width: 95%;
    padding: 1rem;
  }

  .prompt-chips {
    gap: 0.5rem;
  }

  .prompt-chip {
    font-size: 0.85rem;
    padding: 0.75rem;
  }
  
  .chat-input-area {
    flex-direction: column;
  }
  
  .chat-input-area .btn-dark {
    width: 100%;
    margin-bottom: 0;
  }
  
  /* Mobile Nav styles adapted directly from AndrewView.vue */
  .sticky-nav { 
    padding: 0; 
    height: 75px; 
    overflow-x: auto; 
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .sticky-nav::-webkit-scrollbar {
    display: none;
  }
  .nav-container { 
    padding: 0 1.5rem; 
    min-width: 550px;
  }
  .logo-wrapper { gap: 0.75rem; }
  .logo { font-size: 1.2rem; white-space: nowrap; }
  .nav-logo-img { width: 42px; height: 42px; }
  .links { display: flex; gap: 1.5rem; white-space: nowrap; }
  .links a { margin-left: 0; font-size: 0.95rem; }
}
</style>
