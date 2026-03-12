import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

// Use createMemoryHistory during SSR/SSG, and createWebHistory for the browser.
const historyMode = typeof window === 'undefined' ? createMemoryHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL)

// Controller: Routers point paths to correct Views
const router = createRouter({
    history: historyMode,
    routes: [
        {
            path: '/',
            redirect: '/andrew'
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/andrew',
            name: 'andrew',
            component: () => import('../views/AndrewView.vue')
        },
        {
            path: '/ats-resume-checker',
            name: 'ats-resume',
            component: () => import('../views/AtsResumeChecker.vue')
        },
        {
            path: '/alibaba',
            name: 'alibaba',
            component: () => import('../views/AlibabaClone.vue')
        },
        {
            path: '/daily-verse',
            name: 'daily-verse',
            component: () => import('../views/DailyVerseView.vue')
        },
        {
            path: '/animation-bible',
            name: 'animation-bible',
            component: () => import('../views/AnimationBibleView.vue')
        }
    ]
})

export default router
