import { defineStore } from 'pinia'

export const usePortfolioStore = defineStore('portfolio', {
    state: () => ({
        profile: {
            name: 'Andrew Irawan',
            role: 'Software Engineer',
            bio: 'IT professional with experience in frontend development, team supervision, and project management at PT Azlogistik Dot Com.\n\nInformatics graduate from Universitas Widya Kartika with strong technical, coordination, and delivery-focused execution skills, complemented by a continuous learning mindset to adapt to evolving technologies.',
            quote: 'Solving technical challenges quickly and leveraging modern tools and AI to improve efficiency.'
        },
        stats: [
            { label: 'Degree', value: "S1 Teknik Informatika" },
            { label: 'GPA', value: "3.92 / 4.00" },
            { label: 'Frontend', value: "Next JS, React JS" },
            { label: 'Backend', value: "PHP, REST API, MVC" },
            { label: 'Integration', value: "JSON, Auth, 3rd Party" },
            { label: 'Workflow', value: "Git, Postman, AI Tools" },
            { label: 'Top Languages', value: "PHP, Golang, Java" },
            { label: 'Database', value: "MySQL, PosgreSQL" },
        ],
        experiences: [
            {
                id: 1,
                title: 'Project Manager, 2023-2026',
                subtitle: 'PT. Azlogistik Dot Com',
                description: 'Developed project timelines, allocated developer resources according to management deadlines, and tracked execution to ensure on-schedule delivery.',
                image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=1470&auto=format&fit=crop',
            },
            {
                id: 2,
                title: 'Supervisor, 2022-2026',
                subtitle: 'PT. Azlogistik Dot Com',
                description: 'Tracked team progress, identified risks and development bottlenecks, and drove cross-department followups to accelerate issue resolution and safeguard project timelines.',
                image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1470&auto=format&fit=crop',
            },
            {
                id: 3,
                title: 'Frontend Developer, 2022-2026',
                subtitle: 'PT. Azlogistik Dot Com',
                description: 'Translated Figma designs into scalable frontend components using Next.js, integrated RESTful APIs, and collaborated with backend teams working with PHP, CodeIgniter, and SilverStripe to ensure seamless application performance.',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop',
            }
        ],
        portfolioProjects: [
            {
                id: 1,
                title: 'AI Resume ATS Scanner',
                subtitle: 'Interactive Vue.js + Google Gemini AI App',
                description: 'A fully functional Intelligent ATS Career Studio built with Vue 3 and integrated with the Gemini 2.5 Flash LLM. Features client-side PDF parsing and contextual conversation state for immediate AI-driven resume feedback.',
                image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1565&auto=format&fit=crop',
                link: '/ats-resume-checker'
            },
            {
                id: 2,
                title: 'Global B2B Marketplace Clone',
                subtitle: 'Alibaba Redesign & Mega-Menus',
                description: 'A responsive frontend clone of Alibaba with fully interactive 100% width mega-menus, sleek CSS animations, and integrated Gemini AI sourcing agent mockup.',
                image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1470&auto=format&fit=crop',
                link: '/alibaba'
            },
            {
                id: 3,
                title: 'Christian Daily Verse App',
                subtitle: 'AI-Powered Daily Scripture & Reflection',
                description: 'A serene and beautifully crafted app delivering personalized daily Bible verses and reflections powered by Gemini AI, designed to inspire and uplift.',
                image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1470&auto=format&fit=crop',
                link: '/daily-verse'
            }
        ],
        contact: {
            address: 'Jl. Lebak Rejo Utara VI No.18, Kota Surabaya, Indonesia',
            phone: '0877-6507-1995',
            email: 'andrew060400@gmail.com'
        },
        dailyVerses: JSON.parse(localStorage.getItem('dailyVerses') || '{}')
    }),
    actions: {
        setDailyVerse(lang, dateString, verseData) {
            this.dailyVerses[lang] = {
                date: dateString,
                data: verseData
            }
            localStorage.setItem('dailyVerses', JSON.stringify(this.dailyVerses))
        },
        clearAllVerses() {
            this.dailyVerses = {}
            localStorage.removeItem('dailyVerses')
        }
    }
})
