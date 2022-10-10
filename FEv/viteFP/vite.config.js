import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import GlobalPolyFill from '@esbuild-plugins/node-globals-polyfill';
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  // optimizeDeps: {
  //     esbuildOptions: {
  //         define: {
  //             global: "globalThis",
  //         },
  //         plugins: [
  //             GlobalPolyFill({
  //                 process: true,
  //                 buffer: true,
  //             })
  //         ],
  //     },
  // },
  // resolve: {
  //   alias: {
  //     process: "process/browser",
  //     stream: "stream-browserify",
  //     zlib: "browserify-zlib",
  //     util: "util",
  //     web3: path.resolve(__dirname, "./node_modules/web3/dist/web3.min.js"),
  //   },
  // }
})
