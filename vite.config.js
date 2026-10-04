import { defineConfig } from 'vite';

// Relative asset paths: the build works on GitHub Pages (/bavys-landing/) and on a
// custom domain alike; the hash router needs no server rewrites.
export default defineConfig({
  base: './',
});
