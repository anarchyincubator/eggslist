export default {
  publicRuntimeConfig: {
    url: process.env.BACKEND_URL,
  },
  head: {
    title: "Eggslist - Find Farmers Near You",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no",
      },
      {
        hid: "description",
        name: "description",
        content:
          "Egglist is your virtual Farmer’s Market, where you can buy, sell, and connect with local farmers and gardeners to keep your food fresh and local!",
      },
      { name: "format-detection", content: "telephone=no" },
      {
        hid: "og:type",
        name: "og:type",
        content: "website",
      },
      {
        hid: "og:title",
        name: "og:title",
        content: "Eggslist - Find Farmers Near You",
      },
      {
        hid: "og:description",
        name: "og:description",
        content:
          "Egglist is your virtual Farmer’s Market, where you can buy, sell, and connect with local farmers and gardeners to keep your food fresh and local!",
      },
      {
        hid: "og:image",
        name: "og:image",
        content: process.env.OG_IMAGE_URL || "/main.jpg",
      },
      {
        hid: "og:image:width",
        name: "og:image:width",
        content: "1200",
      },
      {
        hid: "og:image:height",
        name: "og:image:height",
        content: "630",
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "large",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  ssr: false,
  analyze: true,
  target: "static",
  css: ["@/assets/sass/main.scss"],
  styleResources: {
    scss: [
      "@/assets/sass/variables.scss",
      "@/assets/sass/responsive.scss",
      "@/assets/sass/helpers.scss",
    ],
  },
  loading: { color: "transparent" },

  plugins: [
    { src: "~/plugins/windowSizePlugin.js", mode: "client" },
    { src: "~/plugins/v-outside.js", mode: "client" },
    { src: "~/plugins/vueSwiper.js", mode: "client" },
    { src: "~/plugins/v-scroll-lock.js", mode: "client" },
    { src: "~/plugins/nuxtClientInit.js", mode: "client" },
    { src: "~/plugins/v-mask.js", mode: "client" },
    { src: "~/plugins/vueObserver.js", mode: "client" },
    { src: "~/plugins/vue-editor.js", mode: "client" },
  ],

  components: true,

  device: {
    refreshOnResize: true,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "cookie-universal-nuxt",
    "@nuxtjs/dayjs",
    "@nuxtjs/style-resources",
    "@nuxtjs/proxy",
    ["vue-currency-input/nuxt", { globalOptions: { currency: "USD" } }],
  ],
  axios: {
    baseURL: process.env.BACKEND_URL,
    credentials: true,
    proxyHeaders: false,
  },
  /*axios: {
    prefix: "/api",
    proxy: true,
    proxyHeaders: false,
    credentials: true,
  },
  proxy: {
    "/api": {
      target: "https://eggslist-dev.ferialabs.com/api",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
    },
  },*/

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
