import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './', // relative asset paths — required for GitHub Pages subpath deploys (e.g. user.github.io/RepoName/)
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // Aggressive image optimization
        ViteImageOptimizer({
          png: {
            quality: 80,
          },
          jpeg: {
            quality: 82,
            progressive: true,
          },
          jpg: {
            quality: 82,
            progressive: true,
          },
          webp: {
            quality: 85,
          },
          avif: {
            quality: 80,
          },
        }),
        // PWA with aggressive caching
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            // Don't precache videos (too large), use runtime caching instead
            globPatterns: ['**/*.{js,css,html,ico,png,jpg,webp,avif,svg}'],
            // Ignore large video files from precaching
            globIgnores: ['**/*.mp4', '**/*.webm'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                  },
                },
              },
              {
                urlPattern: /\.(?:mp4|webm)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'videos-cache',
                  expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                  },
                  rangeRequests: true,
                },
              },
            ],
          },
          manifest: {
            name: 'My Valentine',
            short_name: 'Valentine',
            description: 'A digital love letter',
            theme_color: '#C08081',
            background_color: '#FAF9F6',
            display: 'standalone',
            icons: [
              {
                src: 'chocolate-box.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
        }),
        // Brotli compression
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 1024,
        }),
        // Gzip fallback
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
        }),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimize chunk splitting for better caching
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor': ['react', 'react-dom'],
              'motion': ['framer-motion'],
            },
          },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
      },
    };
});
