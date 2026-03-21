import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import sirv from 'sirv'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Use relative paths for better portability on GitHub Pages
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'games/**/*',
          dest: 'games'
        }
      ]
    }),
    {
      name: 'serve-games',
      configureServer(server) {
        server.middlewares.use('/games', sirv('games', { dev: true }))
      }
    }
  ]
})
