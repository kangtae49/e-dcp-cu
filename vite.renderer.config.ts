import { defineConfig } from 'vite';
// import path from "node:path";
const path = require('path');
import svgr from 'vite-plugin-svgr'
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
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
});
