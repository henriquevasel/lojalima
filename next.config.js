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
            value: "DENY",
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
         {
            key: "Content-Security-Policy",
            value: `
            default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
            img-src * data: blob:;
            media-src * data: blob:;
            connect-src *;
            script-src * 'unsafe-inline' 'unsafe-eval';
            style-src * 'unsafe-inline';
            frame-src *;
            `.replace(/\\n/g, ""),
},
        ],
      },
    ];
  },
};

module.exports = nextConfig;