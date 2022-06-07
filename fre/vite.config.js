
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
  const dev = mode === 'development'
  const config = {
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
  }

  if (!dev) {
    config['base'] = '/assets'
  }

  return defineConfig(config)
}