
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
  const dev = mode === 'development'

  return defineConfig({
    base: dev ? '' : '/assets',
    build: {
      assetsDir: '',
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      target: 'es2020',
      format: 'esm',
    },
    plugins: [
      
    ]
  })
}