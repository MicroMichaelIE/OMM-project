import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.svg',
                'robots.txt',
                'apple-touch-icon.png',
            ],
            devOptions: {
                enabled: true,
            },
            workbox: {
                cleanupOutdatedCaches: false,
                globPatterns: ['**\/*.{js,css,html,ico,png,svg}'],
                skipWaiting: true,
                clientsClaim: true,
                runtimeCaching: [
                    {
                        handler: 'CacheFirst',
                        urlPattern: /\/api\/.*\/*.json/,
                        method: 'POST',
                        options: {
                            backgroundSync: {
                                name: 'myQueueName',
                                options: {
                                    maxRetentionTime: 24 * 60,
                                },
                            },
                        },
                    },
                    {
                        handler: 'NetworkFirst',
                        urlPattern: /\/api\/.*\/*/,
                        options: {
                            backgroundSync: {
                                name: 'Memes',
                                options: {
                                    maxRetentionTime: 24 * 60,
                                },
                            },
                        },
                    },
                ],
            },
        }),
    ],
})
