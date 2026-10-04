import { defineConfig } from 'vite';

// The site sits at the root of its domain with clean URLs (/games/velyka-dzhenga),
// so asset paths are absolute. Every page is prerendered after the build (scripts/prerender.mjs).
export default defineConfig({
  base: '/',
});
