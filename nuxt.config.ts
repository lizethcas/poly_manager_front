import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  colorMode: {
    preference: "light",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@hebilicious/vue-query-nuxt",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-vue3-google-signin",
    "@nuxt/test-utils/module",
  ],
  googleSignIn: {
    clientId:
      "195812559091-8c722bpk25h4phufb8caogvavsr1j866.apps.googleusercontent.com",
  },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },

  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap",
        },
      ],
    },
    baseURL: "/",
  },
  css: ["~/assets/css/main.css", "vue-toastification/dist/index.css"],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      vuetify({ autoImport: true }), // Agrega vuetify directamente aquí
    ],
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },
  runtimeConfig: {
    autoImports: ["defineStore", "storeToRefs"], // Esto normalmente no se coloca en runtimeConfig, verifica si es necesario.
  },

  imports: {
    dirs: ["composables/**", "components/**"],
  },
  ssr: false,
  spaLoadingTemplate: true
});
