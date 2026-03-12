import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createUnhead } from '@unhead/vue'

import App from './App.vue'
import routerOptions from './router' // We need to export router routes instead of the instantiated router
import './assets/main.css'

// `export const createApp` is required by vite-ssg
export const createApp = ViteSSG(
  App,
  { 
    routes: routerOptions.options.routes, // Extract routes from existing router file
    base: import.meta.env.BASE_URL 
  },
  ({ app, router, routes, isClient, initialState }) => {
    // Install plugins
    const pinia = createPinia()
    app.use(pinia)
    
    // Install Unhead for Meta Tags
    const head = createUnhead()
    app.use(head)
  }
)
