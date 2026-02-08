import { defineConfig } from 'vite';
import path from 'path';
import svgr from 'vite-plugin-svgr'
import viteTsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react({
      tsDecorators: true,
      // babel: {
      //   plugins: [
      //     // 'babel-plugin-transform-typescript-metadata',
      //     ['babel-plugin-react-compiler'],
      //     // ['@babel/plugin-proposal-decorators', { legacy: true }],
      //     // ['@babel/plugin-proposal-class-properties', { loose: true }],
      //   ],
      // },
    }),
    svgr({
           include: "**/*.svg?react",
    }),
    viteTsconfigPaths(),

  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, '..', 'src'),
    },
  },
  define: {
    global: 'window'
  }
});
