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

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
  key: "X-Frame-Options",
  value: "SAMEORIGIN",
},
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value:
              "max-age=63072000; includeSubDomains; preload",
          },

        ],
      },
    ];
  },
};

module.exports = nextConfig;