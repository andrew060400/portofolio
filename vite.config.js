import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Sitemap({
            hostname: 'https://andrewirawan.com', // Replace with the actual canonical domain later
            dynamicRoutes: [
                '/',
                '/about',
                '/andrew',
                '/ats-resume-checker',
                '/alibaba',
                '/daily-verse',
                '/animation-bible'
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // vite-ssg options
    ssgOptions: {
        script: 'async',
        formatting: 'minify',
        dirStyle: 'nested'
    }
})
