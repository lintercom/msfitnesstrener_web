import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    base: process.env.VITE_BASE_URL || '/',
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    publicDir: 'public',
    build: {
      copyPublicDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-utils': ['@emailjs/browser', 'jszip'],
            // Admin chunk - lazy loaded
            'admin': [
              './pages/admin/AdminDashboard.tsx',
              './pages/admin/sections/AdminAdvancedSettings.tsx',
              './pages/admin/sections/AdminContent.tsx',
              './pages/admin/sections/AdminServices.tsx',
              './pages/admin/sections/AdminGallery.tsx',
              './pages/admin/sections/AdminBlog.tsx',
            ],
          },
        },
      },
    },
  };
});
