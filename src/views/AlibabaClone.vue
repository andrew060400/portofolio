<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini Initialization
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Mock Data
const categories = ref([
  { id: 1, name: 'Consumer Electronics', icon: '📱' },
  { id: 2, name: 'Apparel', icon: '👕' },
  { id: 3, name: 'Vehicles & Accessories', icon: '🚗' },
  { id: 4, name: 'Sports & Entertainment', icon: '⚽' },
  { id: 5, name: 'Machinery', icon: '⚙️' },
  { id: 6, name: 'Home & Garden', icon: '🏡' },
  { id: 7, name: 'Beauty & Personal Care', icon: '💄' },
  { id: 8, name: 'Packaging & Printing', icon: '📦' },
]);

const readyToShipProducts = ref([
  { id: 1, name: 'Wireless Bluetooth Earbuds Pro', price: '$12.50', moq: '10 Pieces', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Shenzhen Audio Tech' },
  { id: 2, name: 'Smart Watch Fitness Tracker 2024', price: '$8.90', moq: '50 Pieces', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Guangzhou Smart Wearables' },
  { id: 3, name: 'Portable Mini Power Bank 10000mAh', price: '$5.20', moq: '100 Pieces', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Dongguan Energy Co.' },
  { id: 4, name: 'Adjustable Laptop Stand Aluminum Alloy', price: '$15.00', moq: '20 Pieces', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Zhejiang Metal Works' },
]);

const customizedProducts = ref([
   { id: 5, name: 'Custom Logo Printed Cotton T-Shirt', price: '$2.50 - $4.00', moq: '500 Pieces', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Fujian Textile Factory' },
   { id: 6, name: 'OEM Eco-friendly Bamboo Toothbrush', price: '$0.30 - $0.50', moq: '1000 Pieces', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Yiwu Daily Care' },
   { id: 7, name: 'Private Label Organic Essential Oil', price: '$1.20 - $3.50', moq: '2000 Pieces', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Guangzhou Cosmetics Co.' },
   { id: 8, name: 'Custom Packaging Corrugated Box', price: '$0.15 - $0.80', moq: '5000 Pieces', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', supplier: 'Shanghai Printing Group' },
]);

// Search & AI State
const activeTab = ref('Products'); // AI, Products, Manufacturers, Worldwide
const searchQuery = ref('');
const showAIModal = ref(false);
const isAITyping = ref(false);
const aiMessages = ref([]);
const chatSession = ref(null);
const chatScrollArea = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatScrollArea.value) {
      chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight;
    }
  });
};

const handleSearch = async () => {
    if (!searchQuery.value.trim()) return;

    if (activeTab.value === 'AI') {
      // Init AI Search
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        alert('Silahkan isi VITE_GEMINI_API_KEY di dalam file .env terlebih dahulu.');
        return;
      }

      showAIModal.value = true;
      const userText = searchQuery.value;
      
      // If it's a new session or the user clicked 'Ask AI' from the main bar
      if (!chatSession.value) {
          aiMessages.value = [{ role: 'user', text: userText }];
          searchQuery.value = '';
          isAITyping.value = true;
          scrollToBottom();

          try {
            const model = genAI.getGenerativeModel({ 
              model: 'gemini-2.5-flash',
              systemInstruction: 'You are an expert Alibaba global sourcing agent. Help the buyer find products, understand MOQs (Minimum Order Quantities), evaluate suppliers, calculate rough shipping margins, and provide market insights. Be professional, concise, and format your responses clearly. You are helping them source B2B products.'
            });

            chatSession.value = model.startChat();
            const result = await chatSession.value.sendMessage(userText);
            
            aiMessages.value.push({ role: 'bot', text: result.response.text() });
          } catch (error) {
            console.error('Gemini Error:', error);
            aiMessages.value.push({ role: 'bot', text: 'Sorry, I encountered an error connecting to the sourcing network. Please try again later.' });
          } finally {
            isAITyping.value = false;
            scrollToBottom();
          }
      } else {
         // Existing session follow up
         handleAIFollowUp(userText);
      }
    } else {
       // Regular Search Mock
       console.log(`Searching in ${activeTab.value}: ${searchQuery.value}`);
       alert(`Mock: Searching for "${searchQuery.value}" in ${activeTab.value}`);
    }
};

const handleAIFollowUp = async (text) => {
   if (!text.trim() || isAITyping.value || !chatSession.value) return;
   
   aiMessages.value.push({ role: 'user', text: text });
   searchQuery.value = ''; // clear input
   isAITyping.value = true;
   scrollToBottom();

   try {
     const result = await chatSession.value.sendMessage(text);
     aiMessages.value.push({ role: 'bot', text: result.response.text() });
   } catch (error) {
     console.error('Gemini Error:', error);
     aiMessages.value.push({ role: 'bot', text: 'Failed to send message.' });
   } finally {
     isAITyping.value = false;
     scrollToBottom();
   }
};

const closeAIModal = () => {
  showAIModal.value = false;
  // Opt: clear session on close? 
  // chatSession.value = null;
  // aiMessages.value = [];
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="alibaba-layout">
    <!-- TOP PROMO BANNER -->
    <div class="top-promo-banner">
      <div class="container">
        <span>Get up to ₫300,000 off with a new supplier!</span>
        <a href="#">Claim your coupons ></a>
      </div>
    </div>

    <!-- HEADER / NAVBAR -->
    <header class="alibaba-header">
      <div class="container header-container">
        <!-- Logo -->
        <div class="logo-area">
          <RouterLink to="/andrew" class="brand-logo">
            <span class="logo-text">KokiGembul</span><span class="logo-dot">.com</span>
          </RouterLink>
        </div>

        <!-- Custom AI Tabbed Search Bar Area -->
        <div class="search-container-v2" :class="{ 'ai-mode-active': activeTab === 'AI' }">
          <nav class="new-header-search-tab ai-background" :class="{ 'with-ai-mode': activeTab === 'AI' }" aria-label="Search tabs">
            <div class="ai-mode-entry-wrapper">
              <a href="#" class="home-dot-element ai-mode-entry ai-background" 
                 :class="{ 'active': activeTab === 'AI' }"
                 @click.prevent="setActiveTab('AI')">
                <span class="ai-mode-text">AI Mode</span>
                <svg class="icbu-common-icon ai-mode-icon" viewBox="0 0 42 42" style="--icon-size: 17px;">
                  <g><path d="M40.4597 2.625C40.8946 2.625 41.2472 2.97758 41.2472 3.4125V12.6557C41.2472 13.0906 40.8946 13.4432 40.4597 13.4432H40.075C39.6401 13.4432 39.2875 13.0906 39.2875 12.6557V3.4125C39.2875 2.97757 39.6401 2.625 40.075 2.625H40.4597ZM33.9844 3.27148L35.2936 6.44984L35.4759 6.89241L35.4759 6.89248C36.3719 9.06762 37.2538 11.2084 38.0417 13.4433H37.1019C36.4345 13.4433 35.8396 13.0226 35.6171 12.3934L35.0171 10.6969H31.022L30.4234 12.3925C30.2011 13.0222 29.606 13.4433 28.9382 13.4433H28C28.8367 11.0667 29.7731 8.79245 30.7289 6.47434L32.0486 3.27148C32.2171 2.8635 32.5789 2.64803 32.9512 2.62509H33.0844C33.4567 2.64803 33.8176 2.8635 33.9844 3.27148ZM31.5316 9.25313H34.5065L33.0177 5.04324L31.5316 9.25313ZM4.10029 20.0849L4.11372 20.0792L4.11605 20.0782V20.0849L4.1184 20.0839L4.13225 20.0782L6.40199 19.1467L7.10567 18.8578C12.0174 16.8393 15.9216 12.9453 17.9468 8.03374L19.2005 4.99103C19.5397 4.16966 20.7036 4.16966 21.0395 4.99103L22.2833 8.01047C24.3052 12.922 28.2026 16.8194 33.1144 18.8412L36.1339 20.0849C36.9553 20.4241 36.9553 21.588 36.1339 21.9238L33.0911 23.1775C28.1827 25.2027 24.2852 29.1066 22.2666 34.0182L21.0395 37.0077C20.7003 37.8291 19.5364 37.8324 19.1972 37.0077L17.9501 33.9816C15.9282 29.0701 12.0274 25.1727 7.11565 23.1542L4.88928 22.2385L4.11605 21.9205C3.29994 21.5835 3.29468 20.4324 4.10029 20.0849Z"></path></g>
                </svg>
              </a>
              <div class="ai-mode-hover-tooltip">
                <div class="ai-mode-hover-tooltip-arrow"></div>
                <div class="ai-mode-hover-tooltip-content">
                  <div class="ai-mode-hover-tooltip-title">Meet Your AI Sourcing Agent</div>
                  <div class="ai-mode-hover-tooltip-desc">Your all-in-one sourcing agent. Research smarter, design faster, source better, and communicate easier.</div>
                </div>
              </div>
            </div>
            
            <span class="tab-divider ai-background"></span>
            
            <a href="#" class="search-tab-item ai-background" :class="{ 'active': activeTab === 'Products' }" @click.prevent="setActiveTab('Products')">Products</a>
            <a href="#" class="search-tab-item ai-background" :class="{ 'active': activeTab === 'Manufacturers' }" @click.prevent="setActiveTab('Manufacturers')">Manufacturers</a>
            <a href="#" class="search-tab-item ai-background" :class="{ 'active': activeTab === 'Worldwide' }" @click.prevent="setActiveTab('Worldwide')">Worldwide</a>
          </nav>
          
          <div class="home-search header-search-full-screen">
            <div class="theme-wrapper disable-pro multi-line-enabled">
              <div class="home-search-input-panel default" :class="{ 'ai-gradient-border': activeTab === 'AI' }">
                <div class="home-search-input-wrapper">
                  <div class="header-tab-input-container multiline-container">
                    <input 
                      type="text" 
                      v-model="searchQuery" 
                      class="header-tab-input-text custom-full-input" 
                      placeholder="What are you looking for?"
                      @keyup.enter="handleSearch"
                    />
                  </div>
                </div>
                <div class="fullscreen-tab-action-full-screen">
                  <div class="fullscreen-tab-action-full-screen-left" v-if="activeTab !== 'AI'">
                    <div class="switch-image-upload-multi-wrapper full-screen">
                      <div class="image-search-full-screen-container">
                        <span class="image-search-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24"></rect><path d="M12 2.75H20V4.125H16H12V2.75Z" fill="#111111"></path><path d="M15.5 13C15.5 14.933 13.933 16.5 12 16.5C10.067 16.5 8.5 14.933 8.5 13C8.5 11.067 10.067 9.5 12 9.5C13.933 9.5 15.5 11.067 15.5 13ZM14.125 13C14.125 11.8264 13.1736 10.875 12 10.875C10.8264 10.875 9.875 11.8264 9.875 13C9.875 14.1736 10.8264 15.125 12 15.125C13.1736 15.125 14.125 14.1736 14.125 13Z" fill="#111111"></path><path d="M3.25 5.5C2.83579 5.5 2.5 5.83579 2.5 6.25V19.75C2.5 20.1642 2.83579 20.5 3.25 20.5H20.75C21.1642 20.5 21.5 20.1642 21.5 19.75V6.25C21.5 5.83579 21.1642 5.5 20.75 5.5H3.25ZM3.875 6.875H20.125V19.125H3.875V6.875Z" fill="#111111"></path><circle cx="17.6705" cy="9.29944" r="1.19983" fill="#111111"></circle></svg>
                        </span>
                        <div class="text-animate-wrapper">
                          <span class="text-normal">Image Search</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="fullscreen-tab-action-full-screen-right">
                    <button type="button" class="full-screen-button black-button search-action-btn" :class="{ 'ai-glow': activeTab === 'AI' }" @click="handleSearch">
                      <svg v-if="activeTab !== 'AI'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-btn-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <svg v-else class="ai-sparkle-icon" viewBox="0 0 42 42" width="24" height="24" fill="currentColor"><path d="M40.4597 2.625C40.8946 2.625 41.2472 2.97758 41.2472 3.4125V12.6557C41.2472 13.0906 40.8946 13.4432 40.4597 13.4432H40.075C39.6401 13.4432 39.2875 13.0906 39.2875 12.6557V3.4125C39.2875 2.97757 39.6401 2.625 40.075 2.625H40.4597ZM33.9844 3.27148L35.2936 6.44984L35.4759 6.89241L35.4759 6.89248C36.3719 9.06762 37.2538 11.2084 38.0417 13.4433H37.1019C36.4345 13.4433 35.8396 13.0226 35.6171 12.3934L35.0171 10.6969H31.022L30.4234 12.3925C30.2011 13.0222 29.606 13.4433 28.9382 13.4433H28C28.8367 11.0667 29.7731 8.79245 30.7289 6.47434L32.0486 3.27148C32.2171 2.8635 32.5789 2.64803 32.9512 2.62509H33.0844C33.4567 2.64803 33.8176 2.8635 33.9844 3.27148ZM31.5316 9.25313H34.5065L33.0177 5.04324L31.5316 9.25313ZM4.10029 20.0849L4.11372 20.0792L4.11605 20.0782V20.0849L4.1184 20.0839L4.13225 20.0782L6.40199 19.1467L7.10567 18.8578C12.0174 16.8393 15.9216 12.9453 17.9468 8.03374L19.2005 4.99103C19.5397 4.16966 20.7036 4.16966 21.0395 4.99103L22.2833 8.01047C24.3052 12.922 28.2026 16.8194 33.1144 18.8412L36.1339 20.0849C36.9553 20.4241 36.9553 21.588 36.1339 21.9238L33.0911 23.1775C28.1827 25.2027 24.2852 29.1066 22.2666 34.0182L21.0395 37.0077C20.7003 37.8291 19.5364 37.8324 19.1972 37.0077L17.9501 33.9816C15.9282 29.0701 12.0274 25.1727 7.11565 23.1542L4.88928 22.2385L4.11605 21.9205C3.29994 21.5835 3.29468 20.4324 4.10029 20.0849Z"></path></svg>
                      <span>{{ activeTab === 'AI' ? 'Ask AI' : 'Search' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <div class="action-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Sign In</span>
          </div>
          <div class="action-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Messages</span>
          </div>
          <div class="action-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Orders</span>
          </div>
          <div class="action-item cart">
            <div class="cart-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="badge">0</span>
            </div>
            <span>Cart</span>
          </div>
        </div>
      </div>

      <!-- Secondary Nav -->
      <nav class="secondary-nav">
        <div class="container nav-container">
          <div class="nav-links">
            <div class="categories-dropdown-wrapper">
              <a href="#" class="categories-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                Categories
              </a>
              <div class="categories-dropdown-menu">
                <ul class="dropdown-list">
                  <li><a href="#">Consumer Electronics</a></li>
                  <li><a href="#">Apparel & Accessories</a></li>
                  <li><a href="#">Home & Garden</a></li>
                  <li><a href="#">Sports & Entertainment</a></li>
                  <li><a href="#">Machinery</a></li>
                  <li><a href="#">Beauty & Personal Care</a></li>
                  <li><div class="dropdown-divider"></div></li>
                  <li><a href="#" class="view-all-link"><strong>View All Categories ></strong></a></li>
                </ul>
              </div>
            </div>
            <div class="ta-dropdown-wrapper">
              <a href="#" class="active">Ready to Ship</a>
              <div class="ta-content">
                <div class="info">
                  <div class="img">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01d18R1Z1H1GuiHHzpS_!!6000000000697-55-tps-212-32.svg" alt="Trade Assurance Logo" loading="lazy">
                  </div>
                  <h3>Enjoy protection from payment to delivery</h3>
                  <a target="_blank" href="https://tradeassurance.alibaba.com/?tracelog=PC_header_landingpage" class="tnh-button">Learn more</a>
                </div>
                <div class="cards">
                  <a href="https://tradeassurance.alibaba.com/ta/Payment.htm?tracelog=PC_header_payment" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN010KADAP2638vcOIcv4_!!6000000007605-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Safe &amp; easy payments</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm?tracelog=PC_header_mb" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i3/O1CN01viHX2926YHrS5jYvf_!!6000000007673-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Money-back policy</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/ShippingAndLogistics.htm?tracelog=PC_header_shipping" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01Zsnn5f28yyAQPbYyz_!!6000000008002-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Shipping &amp; logistics services</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/AfterSales.htm?tracelog=PC_header_Aftersales" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN01hoxDoj1HV2eSjAU58_!!6000000000762-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>After-sales protections</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div class="ta-dropdown-wrapper">
              <a href="#">Personalized Design</a>
              <div class="ta-content">
                <div class="info">
                  <div class="img">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01d18R1Z1H1GuiHHzpS_!!6000000000697-55-tps-212-32.svg" alt="Trade Assurance Logo" loading="lazy">
                  </div>
                  <h3>Enjoy protection from payment to delivery</h3>
                  <a target="_blank" href="https://tradeassurance.alibaba.com/?tracelog=PC_header_landingpage" class="tnh-button">Learn more</a>
                </div>
                <div class="cards">
                  <a href="https://tradeassurance.alibaba.com/ta/Payment.htm?tracelog=PC_header_payment" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN010KADAP2638vcOIcv4_!!6000000007605-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Safe &amp; easy payments</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm?tracelog=PC_header_mb" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i3/O1CN01viHX2926YHrS5jYvf_!!6000000007673-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Money-back policy</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/ShippingAndLogistics.htm?tracelog=PC_header_shipping" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01Zsnn5f28yyAQPbYyz_!!6000000008002-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Shipping &amp; logistics services</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/AfterSales.htm?tracelog=PC_header_Aftersales" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN01hoxDoj1HV2eSjAU58_!!6000000000762-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>After-sales protections</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div class="ta-dropdown-wrapper">
              <a href="#">Trade Assurance</a>
              <div class="ta-content">
                <div class="info">
                  <div class="img">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01d18R1Z1H1GuiHHzpS_!!6000000000697-55-tps-212-32.svg" alt="Trade Assurance Logo" loading="lazy">
                  </div>
                  <h3>Enjoy protection from payment to delivery</h3>
                  <a target="_blank" href="https://tradeassurance.alibaba.com/?tracelog=PC_header_landingpage" class="tnh-button">Learn more</a>
                </div>
                <div class="cards">
                  <a href="https://tradeassurance.alibaba.com/ta/Payment.htm?tracelog=PC_header_payment" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN010KADAP2638vcOIcv4_!!6000000007605-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Safe &amp; easy payments</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm?tracelog=PC_header_mb" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i3/O1CN01viHX2926YHrS5jYvf_!!6000000007673-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Money-back policy</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/ShippingAndLogistics.htm?tracelog=PC_header_shipping" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01Zsnn5f28yyAQPbYyz_!!6000000008002-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Shipping &amp; logistics services</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/AfterSales.htm?tracelog=PC_header_Aftersales" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN01hoxDoj1HV2eSjAU58_!!6000000000762-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>After-sales protections</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div class="ta-dropdown-wrapper">
              <a href="#">Buyer Central</a>
              <div class="ta-content">
                <div class="info">
                  <div class="img">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01d18R1Z1H1GuiHHzpS_!!6000000000697-55-tps-212-32.svg" alt="Trade Assurance Logo" loading="lazy">
                  </div>
                  <h3>Enjoy protection from payment to delivery</h3>
                  <a target="_blank" href="https://tradeassurance.alibaba.com/?tracelog=PC_header_landingpage" class="tnh-button">Learn more</a>
                </div>
                <div class="cards">
                  <a href="https://tradeassurance.alibaba.com/ta/Payment.htm?tracelog=PC_header_payment" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN010KADAP2638vcOIcv4_!!6000000007605-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Safe &amp; easy payments</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm?tracelog=PC_header_mb" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i3/O1CN01viHX2926YHrS5jYvf_!!6000000007673-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Money-back policy</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/ShippingAndLogistics.htm?tracelog=PC_header_shipping" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01Zsnn5f28yyAQPbYyz_!!6000000008002-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Shipping &amp; logistics services</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/AfterSales.htm?tracelog=PC_header_Aftersales" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN01hoxDoj1HV2eSjAU58_!!6000000000762-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>After-sales protections</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div class="ta-dropdown-wrapper">
              <a href="#">Help Center</a>
              <div class="ta-content">
                <div class="info">
                  <div class="img">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01d18R1Z1H1GuiHHzpS_!!6000000000697-55-tps-212-32.svg" alt="Trade Assurance Logo" loading="lazy">
                  </div>
                  <h3>Enjoy protection from payment to delivery</h3>
                  <a target="_blank" href="https://tradeassurance.alibaba.com/?tracelog=PC_header_landingpage" class="tnh-button">Learn more</a>
                </div>
                <div class="cards">
                  <a href="https://tradeassurance.alibaba.com/ta/Payment.htm?tracelog=PC_header_payment" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN010KADAP2638vcOIcv4_!!6000000007605-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Safe &amp; easy payments</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm?tracelog=PC_header_mb" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i3/O1CN01viHX2926YHrS5jYvf_!!6000000007673-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Money-back policy</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/ShippingAndLogistics.htm?tracelog=PC_header_shipping" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i2/O1CN01Zsnn5f28yyAQPbYyz_!!6000000008002-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>Shipping &amp; logistics services</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                  <a href="https://tradeassurance.alibaba.com/ta/AfterSales.htm?tracelog=PC_header_Aftersales" target="_blank" class="ta-card">
                    <img src="https://s.alicdn.com/@img/imgextra/i4/O1CN01hoxDoj1HV2eSjAU58_!!6000000000762-55-tps-70-70.svg" class="img" alt="Trade Assurance Icon" loading="lazy">
                    <div class="text">
                      <h3>After-sales protections</h3>
                      <svg class="tnh-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="app-links">
            <a href="#">Get the App</a>
            <a href="#">English - USD</a>
          </div>
        </div>
      </nav>
    </header>

    <!-- AI SOURCING AGENT OVERLAY -->
    <div v-if="showAIModal" class="ai-chat-overlay container">
       <div class="ai-chat-header">
         <div class="ai-header-left">
           <svg class="ai-sparkle-icon" viewBox="0 0 42 42" width="24" height="24" fill="#111111" style="margin-right: 8px;"><path d="M40.4597 2.625C40.8946 2.625 41.2472 2.97758 41.2472 3.4125V12.6557C41.2472 13.0906 40.8946 13.4432 40.4597 13.4432H40.075C39.6401 13.4432 39.2875 13.0906 39.2875 12.6557V3.4125C39.2875 2.97757 39.6401 2.625 40.075 2.625H40.4597ZM33.9844 3.27148L35.2936 6.44984L35.4759 6.89241L35.4759 6.89248C36.3719 9.06762 37.2538 11.2084 38.0417 13.4433H37.1019C36.4345 13.4433 35.8396 13.0226 35.6171 12.3934L35.0171 10.6969H31.022L30.4234 12.3925C30.2011 13.0222 29.606 13.4433 28.9382 13.4433H28C28.8367 11.0667 29.7731 8.79245 30.7289 6.47434L32.0486 3.27148C32.2171 2.8635 32.5789 2.64803 32.9512 2.62509H33.0844C33.4567 2.64803 33.8176 2.8635 33.9844 3.27148ZM31.5316 9.25313H34.5065L33.0177 5.04324L31.5316 9.25313ZM4.10029 20.0849L4.11372 20.0792L4.11605 20.0782V20.0849L4.1184 20.0839L4.13225 20.0782L6.40199 19.1467L7.10567 18.8578C12.0174 16.8393 15.9216 12.9453 17.9468 8.03374L19.2005 4.99103C19.5397 4.16966 20.7036 4.16966 21.0395 4.99103L22.2833 8.01047C24.3052 12.922 28.2026 16.8194 33.1144 18.8412L36.1339 20.0849C36.9553 20.4241 36.9553 21.588 36.1339 21.9238L33.0911 23.1775C28.1827 25.2027 24.2852 29.1066 22.2666 34.0182L21.0395 37.0077C20.7003 37.8291 19.5364 37.8324 19.1972 37.0077L17.9501 33.9816C15.9282 29.0701 12.0274 25.1727 7.11565 23.1542L4.88928 22.2385L4.11605 21.9205C3.29994 21.5835 3.29468 20.4324 4.10029 20.0849Z"></path></svg>
           <h3>Ali Agent</h3>
           <span class="online-status">● Online</span>
         </div>
         <button class="close-ai-btn" @click="closeAIModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>
       </div>
       
       <div class="ai-chat-body" ref="chatScrollArea">
         <div class="chat-message bot">
           <div class="msg-avatar">AI</div>
           <div class="msg-content">Hello! I am your AI Sourcing Agent. I can help you find products, evaluate suppliers, and answer complex B2B sourcing questions. Let me process your request.</div>
         </div>
         
         <div v-for="(msg, index) in aiMessages" :key="index" class="chat-message" :class="msg.role">
           <div class="msg-avatar" v-if="msg.role === 'bot'">AI</div>
           <div class="msg-content" :class="{ 'user-msg': msg.role === 'user' }">{{ msg.text }}</div>
           <div class="msg-avatar user-avatar" v-if="msg.role === 'user'">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="image-search-icon__normal"><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
           </div>
         </div>
         
         <div v-if="isAITyping" class="chat-message bot typing-indicator">
            <div class="msg-avatar">AI</div>
            <div class="msg-content">Analyzing sourcing data<span class="dots">...</span></div>
         </div>
       </div>
    </div>

    <main class="main-content" :class="{ 'blur-bg': showAIModal }">
      <!-- HERO SECTION -->
      <section class="hero-section container">
        <div class="hero-sidebar animate-fade-in-left">
          <ul class="category-list">
            <li class="category-title">My Markets</li>
            <li v-for="cat in categories" :key="cat.id" class="category-item">
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </li>
            <li class="category-item all-categories">
              <span>All Categories</span>
            </li>
          </ul>
        </div>
        
        <div class="hero-banner animate-fade-in-up delay-100">
          <div class="banner-content">
            <h1>Global sourcing made easy</h1>
            <p>Connect with reliable suppliers worldwide.</p>
            <button class="cta-button">Start Sourcing</button>
          </div>
        </div>

        <div class="hero-right-cards">
            <div class="info-card user-card animate-fade-in-right delay-200">
                <div class="avatar-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h3>Welcome to KokiGembul.com</h3>
                <div class="auth-buttons">
                    <button class="btn btn-primary">Join for free</button>
                    <button class="btn btn-outline">Sign in</button>
                </div>
            </div>
            <div class="info-card promo-card animate-fade-in-right delay-300">
                <div class="promo-badge">Trade Assurance</div>
                <h4>Safe and easy payments</h4>
                <p>Protect your online orders</p>
            </div>
        </div>
      </section>

      <!-- PREFERRED SELECTION SECTION -->
      <section class="product-section container">
        <div class="section-header">
          <h2>Ready to Ship Products</h2>
          <a href="#" class="view-more">View More ></a>
        </div>
        
        <div class="product-grid">
          <div v-for="(product, index) in readyToShipProducts" :key="product.id" class="product-card animate-fade-in-up" :style="{ animationDelay: (index * 100) + 'ms' }">
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <div class="hover-overlay">
                 <button class="quick-view-btn">Quick View</button>
              </div>
            </div>
            <div class="product-details">
              <h3 class="product-title">{{ product.name }}</h3>
              <div class="product-price">{{ product.price }}</div>
              <div class="product-moq">Min. order: {{ product.moq }}</div>
              <div class="product-supplier">{{ product.supplier }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="product-section container">
        <div class="section-header">
          <h2>Customized Products</h2>
          <a href="#" class="view-more">View More ></a>
        </div>
        
        <div class="product-grid">
          <div v-for="(product, index) in customizedProducts" :key="product.id" class="product-card animate-fade-in-up" :style="{ animationDelay: (index * 100) + 'ms' }">
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <div class="badge premium-badge">Premium OEM</div>
            </div>
            <div class="product-details">
              <h3 class="product-title">{{ product.name }}</h3>
              <div class="product-price">{{ product.price }}</div>
              <div class="product-moq">Min. order: {{ product.moq }}</div>
              <div class="product-supplier">{{ product.supplier }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="alibaba-footer">
      <div class="container footer-content">
        <div class="footer-col">
          <h3>Customer Services</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Report Abuse</a></li>
            <li><a href="#">Submit a Dispute</a></li>
            <li><a href="#">Policies & Rules</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>About Us</h3>
          <ul>
            <li><a href="#">About KokiGembul.com</a></li>
            <li><a href="#">About KokiGembul Group</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Source on KokiGembul.com</h3>
          <ul>
            <li><a href="#">Resources</a></li>
            <li><a href="#">All Categories</a></li>
            <li><a href="#">Request for Quotation</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Trade Services</h3>
          <ul>
            <li><a href="#">Trade Assurance</a></li>
            <li><a href="#">Logistics Service</a></li>
            <li><a href="#">Payment Service</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom text-center">
        <p>© 1999-{{ new Date().getFullYear() }} KokiGembul.com. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ALIBABA THEME VARIABLES & RESET for this component */
.alibaba-layout {
  --ali-orange: #111111; /* Changed to Black for monochrome theme */
  --ali-orange-dark: #000000;
  --ali-dark: #111111;
  --ali-gray: #666666;
  --ali-light-gray: #f0f0f0;
  --ali-border: #eaeaea;
  --ali-bg: #fcfcfc;
  --ali-white: #ffffff;
  --ali-blue: #111111;
  
  font-family: 'Inter', system-ui, sans-serif; /* Matched Andrew route font */
  background-color: var(--ali-bg);
  color: var(--ali-dark);
  min-height: 100vh;
  margin: -2rem -4rem; /* Negate the padding from main #app to make it full width */
}

/* Base utility for overriding dark mode from main CSS if needed */
.alibaba-layout * {
  box-sizing: border-box;
}

.alibaba-layout a {
  text-decoration: none;
  color: inherit;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* TOP PROMO BANNER */
.top-promo-banner {
  background-color: var(--ali-dark);
  color: var(--ali-white);
  padding: 8px 0;
  font-size: 13px;
}

.top-promo-banner .container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.top-promo-banner a {
  color: #ff9900;
  font-weight: bold;
}

/* Ensure header covers content */
.alibaba-header {
  background-color: var(--ali-white);
  border-bottom: 1px solid var(--ali-border);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0 20px 0;
  gap: 30px;
}

.logo-area .brand-logo {
  font-size: 32px;
  font-weight: 800;
  color: var(--ali-orange);
  letter-spacing: -1px;
}

.logo-area .logo-dot {
  color: var(--ali-dark);
  font-size: 24px;
}

/* ------------------------------------- */
/* V2 TABBED SEARCH AREA                 */
/* ------------------------------------- */
.search-container-v2 {
  flex-grow: 1;
  max-width: 850px;
  display: flex;
  flex-direction: column;
}

/* Optional header background swap when AI is active (mimicking Alibaba darker/prominent header background) */
.alibaba-header:has(.search-container-v2.ai-mode-active) {
  /* You could apply background images here if desired, keeping simple for now */
}

/* Tabs */
.new-header-search-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.new-header-search-tab .ai-mode-entry {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    height: 38px;
    position: relative;
    text-decoration: none;
    transition: transform 0.2s;
}

.new-header-search-tab .ai-mode-entry:hover {
   transform: scale(1.02);
}

.new-header-search-tab .ai-mode-entry .ai-mode-text {
    color: #111;
    font-size: 18px; /* Original was 28px, scaled down for header context */
    font-weight: 800;
    line-height: 38px;
    white-space: nowrap;
    background: linear-gradient(90deg, #333333, #000000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s;
}

/* Active states for AI Mode vs Regular tabs */
.new-header-search-tab.with-ai-mode .ai-mode-entry .ai-mode-text {
    /* If we had a completely dark header background, this would turn white. 
       For this layout, we'll keep the gradient but make it glow */
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.new-header-search-tab .ai-mode-entry:hover .ai-mode-text {
    opacity: 0.8;
}

.ai-mode-icon {
    width: 24px;
    height: 24px;
    margin-left: 6px;
    fill: #111111;
}

/* Tooltip */
.ai-mode-entry-wrapper {
   position: relative;
}

.ai-mode-hover-tooltip {
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 8px;
    padding: 12px;
    width: 200px;
    z-index: 10;
    margin-top: 5px;
}

.ai-mode-entry-wrapper:hover .ai-mode-hover-tooltip {
    display: block;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.ai-mode-hover-tooltip-title {
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 4px;
}

.ai-mode-hover-tooltip-desc {
    font-size: 12px;
    color: var(--ali-gray);
    line-height: 1.4;
}

.tab-divider {
    background-color: #dcdcdc;
    display: inline-block;
    height: 16px;
    margin: 0 24px;
    width: 1px;
}

.new-header-search-tab .search-tab-item {
    color: #222;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    height: 34px;
    line-height: 34px;
    margin-right: 32px;
    position: relative;
    transition: color 0.2s;
}

.new-header-search-tab .search-tab-item:last-child {
    margin-right: 0;
}

.new-header-search-tab .search-tab-item:hover {
   color: var(--ali-orange);
}

.new-header-search-tab .search-tab-item.active {
    color: var(--ali-dark);
    font-weight: bold;
}

/* Underline active state */
.new-header-search-tab .search-tab-item.active:after {
    background-color: var(--ali-dark);
    border-radius: 3px;
    bottom: -2px;
    content: "";
    height: 3px;
    left: 0;
    position: absolute;
    width: 100%;
}

.new-header-search-tab.with-ai-mode .search-tab-item {
    color: var(--ali-gray);
}

.new-header-search-tab.with-ai-mode .search-tab-item.active {
    color: var(--ali-dark);
}

/* Full Screen Search Input Area */
.home-search-input-panel {
    display: flex;
    align-items: center;
    border: 2px solid var(--ali-orange);
    border-radius: 40px;
    background: var(--ali-white);
    height: 48px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
}

.ai-gradient-border {
    border-color: transparent !important;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: 
       linear-gradient(wrap, #fff, #fff), 
       linear-gradient(90deg, #555555, #111111, #333333); /* Animated glowing border effect */
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.home-search-input-wrapper {
   flex-grow: 1;
   height: 100%;
}

.header-tab-input-container {
    height: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
}

.custom-full-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
    color: var(--ali-dark);
}

.custom-full-input::placeholder {
   color: #999;
}

.fullscreen-tab-action-full-screen {
    display: flex;
    align-items: center;
    height: 100%;
}

.fullscreen-tab-action-full-screen-left {
    padding-right: 15px;
    display: flex;
    align-items: center;
}

.fullscreen-tab-action-full-screen-right {
    height: 100%;
}

.image-search-full-screen-container {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: #f7f7f7;
    padding: 6px 12px;
    border-radius: 20px;
    transition: background 0.2s;
}

.image-search-full-screen-container:hover {
    background: #ebebeb;
}

.text-normal {
    font-size: 13px;
    font-weight: 500;
}

.search-action-btn {
    background-color: var(--ali-dark);
    color: white;
    border: none;
    height: 100%;
    padding: 0 32px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 0 40px 40px 0;
    transition: all 0.2s;
}

.search-action-btn.ai-glow {
    background: linear-gradient(90deg, #111111, #333333);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.search-action-btn:hover {
    opacity: 0.9;
}

.search-btn-icon {
   width: 20px;
   height: 20px;
}

/* USER ACTIONS */
.user-actions {
  display: flex;
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ali-gray);
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
}

.action-item:hover {
  color: var(--ali-orange);
}

.cart-icon-wrapper {
  position: relative;
  display: inline-flex;
}

.cart-icon-wrapper .badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: var(--ali-orange);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 1px 5px;
  border-radius: 10px;
  border: 1px solid var(--ali-white);
  line-height: 1;
}

/* SECONDARY NAV */
.secondary-nav {
  border-top: 1px solid var(--ali-border);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-links a {
  font-size: 14px;
  color: var(--ali-dark);
  font-weight: 500;
  position: relative;
}

.nav-links a:hover {
  color: var(--ali-orange);
}

.nav-links a.active {
  color: var(--ali-orange);
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--ali-orange);
}

.categories-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold !important;
  height: 40px;
}

.categories-dropdown-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.categories-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 260px;
  background-color: var(--ali-white);
  border: 1px solid var(--ali-border);
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  padding: 12px 0;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.categories-dropdown-wrapper:hover .categories-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-list li a {
  display: block;
  padding: 10px 24px;
  color: var(--ali-dark);
  text-decoration: none;
  font-size: 14px;
  font-weight: normal;
  transition: background-color 0.2s, color 0.2s;
}

.dropdown-list li a:hover {
  background-color: var(--ali-light-gray);
  color: var(--ali-orange); /* Will be black in monochrome mode */
}

.dropdown-divider {
  height: 1px;
  background-color: var(--ali-border);
  margin: 8px 0;
}

.dropdown-list li a.view-all-link {
  color: var(--ali-orange); /* Keeping this themed for emphasis if needed, or falls to black */
}
.dropdown-list li a.view-all-link:hover {
  background-color: transparent;
  text-decoration: underline;
}

/* Trade Assurance Mega Menu Dropdown */
.ta-dropdown-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.ta-content {
  position: absolute;
  top: 100%;
  left: -200px;
  width: 700px;
  display: flex;
  background: var(--ali-white);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  border: 1px solid var(--ali-border);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  gap: 32px;
}

.ta-dropdown-wrapper:hover .ta-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.ta-content .info {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ta-content .info .img img {
  width: 140px;
  height: auto;
}

.ta-content .info h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
  color: var(--ali-dark);
}

.ta-content .info .tnh-button {
  border: 1.5px solid var(--ali-dark);
  border-radius: 20px;
  padding: 6px 16px;
  text-decoration: none;
  color: var(--ali-dark);
  font-weight: 600;
  font-size: 14px;
  align-self: flex-start;
  transition: all 0.2s;
}

.ta-content .info .tnh-button:hover {
  background: var(--ali-dark);
  color: var(--ali-white);
}

.ta-content .cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex: 1;
}

.ta-content .ta-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--ali-dark);
  transition: all 0.2s;
  background: var(--ali-bg);
  align-items: center;
  border: 1px solid transparent;
}

.ta-content .ta-card:hover {
  background: var(--ali-light-gray);
  border-color: var(--ali-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.ta-content .ta-card .img {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.ta-content .ta-card .text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.ta-content .ta-card .text h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.ta-content .ta-card .text .tnh-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.ta-content .ta-card:hover .text .tnh-icon {
  opacity: 1;
}

.app-links {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: var(--ali-gray);
}

/* MAIN CONTENT */
.main-content {
  padding: 24px 0 60px;
}

/* HERO SECTION */
.hero-section {
  display: grid;
  grid-template-columns: 240px 1fr 280px;
  gap: 20px;
  height: 400px;
  margin-bottom: 40px;
}

/* Hero Sidebar */
.hero-sidebar {
  background: var(--ali-white);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.category-list {
  list-style: none;
  padding: 10px 0;
  margin: 0;
}

.category-title {
  padding: 10px 16px;
  font-weight: bold;
  font-size: 16px;
  color: var(--ali-dark);
  border-bottom: 1px solid var(--ali-border);
  margin-bottom: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--ali-dark);
}

.category-item:hover {
  background-color: rgba(255, 106, 0, 0.05);
  color: var(--ali-orange);
}

.cat-icon {
  margin-right: 12px;
  font-size: 16px;
}

.cat-name {
  flex-grow: 1;
}

.chevron {
  color: var(--ali-gray);
}

.all-categories {
  font-weight: 500;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--ali-border);
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Add an animated premium pattern over banner */
.hero-banner::before {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-image: radial-gradient(circle at right top, rgba(255,255,255,0.2) 0%, transparent 40%);
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 400px;
}

.banner-content h1 {
  font-size: 42px;
  line-height: 1.2;
  margin: 0 0 16px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.banner-content p {
  font-size: 18px;
  margin: 0 0 32px;
  opacity: 0.9;
}

.cta-button {
  background-color: var(--ali-orange);
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(255, 106, 0, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  background-color: var(--ali-orange-dark);
  box-shadow: 0 6px 12px rgba(255, 106, 0, 0.4);
}

/* Hero Right Cards */
.hero-right-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: var(--ali-white);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-card {
  flex-grow: 1;
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--ali-light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ali-gray);
  margin-bottom: 12px;
}

.user-card h3 {
  margin: 0 0 20px;
  font-size: 16px;
  color: var(--ali-dark);
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.btn {
  padding: 10px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  border: none;
}

.btn-primary {
  background-color: var(--ali-orange);
  color: white;
}

.btn-primary:hover {
  background-color: var(--ali-orange-dark);
}

.btn-outline {
  background-color: transparent;
  color: var(--ali-orange);
  border: 1px solid var(--ali-orange);
}

.btn-outline:hover {
  background-color: rgba(255, 106, 0, 0.05);
}

.promo-card {
  background: linear-gradient(180deg, #fffcf5 0%, #fff 100%);
  border: 1px solid #ffeed2;
}

.promo-badge {
  background: rgba(255, 196, 0, 0.2);
  color: #c98e00;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 12px;
}

.promo-card h4 {
  margin: 0 0 6px;
  font-size: 15px;
}

.promo-card p {
  margin: 0;
  font-size: 13px;
  color: var(--ali-gray);
}

/* PRODUCT SECTION */
.product-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: bold;
  color: var(--ali-dark);
  margin: 0;
}

.view-more {
  color: var(--ali-gray);
  font-size: 14px;
}

.view-more:hover {
  color: var(--ali-orange);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* PRODUCT CARD */
.product-card {
  background: var(--ali-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.product-image-container {
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.hover-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .hover-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: white;
  color: var(--ali-dark);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.product-card:hover .quick-view-btn {
  transform: translateY(0);
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
}

.premium-badge {
  background-color: #ffd700;
  color: #333;
}

.product-details {
  padding: 16px;
}

.product-title {
  font-size: 14px;
  font-weight: normal;
  color: var(--ali-dark);
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px; /* roughly 2 lines */
  line-height: 1.4;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: var(--ali-dark);
  margin-bottom: 4px;
}

.product-moq {
  font-size: 12px;
  color: var(--ali-gray);
  margin-bottom: 12px;
}

.product-supplier {
  font-size: 12px;
  color: var(--ali-gray);
  border-top: 1px solid var(--ali-light-gray);
  padding-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.product-supplier::before {
  content: '🏢';
}

/* FOOTER */
.alibaba-footer {
  background-color: var(--ali-white);
  border-top: 1px solid var(--ali-border);
  padding-top: 40px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.footer-col h3 {
  font-size: 16px;
  color: var(--ali-dark);
  margin: 0 0 20px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col li {
  margin-bottom: 12px;
}

.footer-col a {
  color: var(--ali-gray);
  font-size: 14px;
}

.footer-col a:hover {
  color: var(--ali-orange);
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid var(--ali-border);
  padding: 20px 0;
  color: var(--ali-gray);
  font-size: 13px;
}

.text-center {
  text-align: center;
}

/* AI CHAT OVERLAY */
.ai-chat-overlay {
  background: var(--ali-white);
  border: 1px solid var(--ali-border);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  margin-top: 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 90;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 60vh;
  max-height: 600px;
  animation: slideDown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.ai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(90deg, #fffcf5 0%, #fff 100%);
  border-bottom: 1px solid #ffeed2;
}

.ai-header-left {
  display: flex;
  align-items: center;
}

.ai-header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--ali-dark);
  margin-right: 12px;
}

.online-status {
  font-size: 12px;
  color: #22c55e;
  font-weight: 500;
}

.close-ai-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--ali-gray);
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-ai-btn:hover {
  background: var(--ali-light-gray);
  color: var(--ali-dark);
}

.ai-chat-body {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-behavior: smooth;
}

.chat-message {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.chat-message.bot {
  align-self: flex-start;
}

.chat-message.user {
  align-self: flex-end;
  justify-content: flex-end;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4c00, #ff007b);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.user-avatar {
  background: var(--ali-dark);
}

.msg-content {
  background: var(--ali-white);
  padding: 14px 18px;
  border-radius: 16px;
  border-top-left-radius: 2px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ali-dark);
  border: 1px solid var(--ali-border);
  white-space: pre-wrap; /* For markdown spacing if returned by AI */
}

.user-msg {
  border-top-left-radius: 16px;
  border-top-right-radius: 2px;
  background: var(--ali-orange);
  color: white;
  border: none;
}

.typing-indicator .msg-content {
  color: var(--ali-gray);
  font-style: italic;
}

.dots {
  animation: typing 1.5s infinite;
}

@keyframes typing {
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
}

/* Blur main content when AI is prominent */
.blur-bg {
  filter: blur(4px);
  opacity: 0.6;
  pointer-events: none;
  transition: all 0.3s ease;
}

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) {
  .hero-section {
    grid-template-columns: 240px 1fr;
  }
  .hero-right-cards {
    display: none;
  }
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-sidebar {
    display: none;
  }
  .hero-section {
    grid-template-columns: 1fr;
  }
  .header-container {
    flex-wrap: wrap;
  }
  .search-container {
    order: 3;
    max-width: 100%;
    width: 100%;
  }
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  .user-actions span {
    display: none;
  }
  .nav-links {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }
  .app-links {
    display: none;
  }
}
</style>
