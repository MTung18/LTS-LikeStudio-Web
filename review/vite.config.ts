import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import dns from "dns";
import vue from "@vitejs/plugin-vue";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["@bryntum/grid", "@bryntum/grid-vue-3"],
  },
  server: {
    port: 8085,
  },
  build: {
    /** If you set esmExternals to true, this plugins assumes that 
      all external dependencies are ES modules */
    target: "esnext",
    commonjsOptions: {
      esmExternals: true,
    },
  },
  css: {
    devSourcemap: true,
  },
});
