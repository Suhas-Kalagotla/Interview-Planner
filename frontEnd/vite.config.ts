import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env': env,
        },
        server: {
            host: 'localhost',
            port: 3001,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        plugins: [
            react(),
            {
              name: 'custom-csp-plugin',
              generateBundle() {
                // Set the CSP header for the specific domain
                this.emitFile({
                  type: 'asset',
                  fileName: 'csp-header.js',
                  source: `document.head.appendChild(Object.assign(document.createElement('meta'), {httpEquiv: 'Content-Security-Policy', content: 'script-src self https://accounts.google.com'}));`,
                });
              },
            },
          ],
    };
});
