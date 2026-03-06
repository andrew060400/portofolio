import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Controller: Routers point paths to correct Views
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
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
        }
    ]
})

export default router
