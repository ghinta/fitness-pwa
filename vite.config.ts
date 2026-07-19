import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const deploymentBase = '/fitness-pwa/';

export default defineConfig({
  base: deploymentBase,
  plugins: [
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeManifestIcons: false,
      scope: deploymentBase,
      manifest: {
        id: deploymentBase,
        name: 'Fitness PWA',
        short_name: 'Fitness',
        description:
          'Offline-fähige Trainingsdokumentation für HIT-Krafttraining',
        lang: 'de',
        start_url: `${deploymentBase}#/`,
        scope: deploymentBase,
        display: 'standalone',
        background_color: '#f5f7f2',
        theme_color: '#173f35',
        icons: [
          {
            src: `${deploymentBase}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${deploymentBase}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${deploymentBase}icons/icon-maskable-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: `${deploymentBase}icons/icon-maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /\/(?:exports?|backups?)(?:\/|$)/i,
          /\.json(?:$|\?)/i,
        ],
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        globIgnores: ['**/*export*.json', '**/*backup*.json'],
        runtimeCaching: [],
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false,
        disableDevLogs: true,
      },
    }),
  ],
});
