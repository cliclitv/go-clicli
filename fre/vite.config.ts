
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
  const dev = mode === 'development'
  const config = {
    build: {
      assetsDir: '',
    },
    server: {
      port: 3000
    },
    resolve: {
      alias: {
        'fre': 'preact/compat',      //格式一定要写对喽不然没有代码提示或者报错
      }
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      target: 'es2020',
      format: 'esm',
      jsxInject: `import { h } from 'preact'`
    },
    plugins: [

    ]
  }

  if (!dev) {
    config['base'] = '/assets/'
  }

  return defineConfig(config as any)
}