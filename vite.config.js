import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// esto es para que funcione con github pages.
/*export default defineConfig({
  plugins: [react()],
  base: '/pmv-short-menu/',
})*/

export default defineConfig({
  plugins: [react()],
})