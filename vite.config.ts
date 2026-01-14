import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We remove includeAssets for icons since we are using external URLs
      manifest: {
        name: 'Neon Tamagotchi VN',
        short_name: 'NeonPet',
        description: 'Nuôi thú ảo phong cách Cyberpunk Pixel-art',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.href.includes('raw.githubusercontent.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Cache for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  define: {
    'process.env': process.env
  }
})