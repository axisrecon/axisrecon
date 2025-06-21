import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', // Netlify handles this automatically
  
  // Add resolve configuration for better path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@categories': path.resolve(__dirname, './src/formulas/categories'),
      '@formulas': path.resolve(__dirname, './src/formulas'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts')
    },
    // Ensure proper file extension resolution
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  
  server: {
    historyApiFallback: true
  },
  
  build: {
    // Ensure proper build configuration
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure proper asset handling
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      },
      
      // Ensure external dependencies are handled correctly
      external: [],
      
      // Better tree shaking and module resolution
      treeshake: {
        moduleSideEffects: false
      }
    },
    
    // Ensure all imports are properly resolved
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  
  // Add optimizeDeps for better dependency handling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
      'jspdf',
      'jspdf-autotable'
    ]
  }
})