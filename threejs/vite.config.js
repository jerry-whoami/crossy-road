import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',
  publicDir: '../static/',
  base: './',

  server: {
    host: true,            // Listen on 0.0.0.0 to allow external access (needed for Docker)
    port: 5173,            // Default Vite port; can be changed if needed
    strictPort: true,      // Fail if port is already in use
    open: false,           // Do not auto-open browser in Docker
    watch: {
      usePolling: true     // Required for live reload in some Docker environments (especially on Linux/macOS with volume mounts)
    }
  },
});
