import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/icon.svg', 'icons/icon-maskable.svg'],
      manifest: {
        name: 'Fitness PWA',
        short_name: 'Fitness',
        description:
          'Offline-fähige Trainingsdokumentation für HIT-Krafttraining',
        lang: 'de',
        start_url: './#/',
        scope: './',
        display: 'standalone',
        background_color: '#f5f7f2',
        theme_color: '#173f35',
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
      },
    }),
  ],
});
