import legacy from '@vitejs/plugin-legacy'

export default {
  base:'/assets/',
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