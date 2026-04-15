/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  allowedDevOrigins: [
    "192.168.18.149",
    "interorbital-harvestless-tifany.ngrok-free.dev",
    "topics-spirituality-supply-thereof.trycloudflare.com",
  ],

  webpack: (config) => {
    config.resolve.alias["@"] = require("path").resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;