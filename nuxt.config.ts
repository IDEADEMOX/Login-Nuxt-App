import "dotenv/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // 启用内置nitro数据库支持
  // nitro: {
  //   experimental: {
  //     database: true,
  //   },
  //   database: {
  //     default: {
  //       connector: "postgresql",
  //       options: {
  //         url: process.env.DATABASE_URL,
  //       },
  //     },
  //   },
  // },
});
