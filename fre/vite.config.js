import legacy from '@vitejs/plugin-legacy'

export default {
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