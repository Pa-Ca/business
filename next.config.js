const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["paca-ui"],
  webpack: (config, {}) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./node_modules/paca-ui/src/stories/assets/images/"),
            to: path.resolve(__dirname, "./public/images/"),
          },
        ],
      })
    );

    return config;
  },
};

module.exports = nextConfig;
