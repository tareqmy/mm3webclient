import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build'
    },
    server: {
        host: true,
        port: 3000
    },
    preview: {
        host: true,
        port: 3000
    },
    test: {
        environment: 'jsdom',
        globals: true
    }
});
