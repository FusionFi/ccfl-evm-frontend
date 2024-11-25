/** @type {import('next').NextConfig} */
const path = require('path');
const { i18n } = require('./next-i18next.config');
const nextConfig = {
  i18n,
  webpack: function (config, options) {
		config.experiments = {
			topLevelAwait: true,
			asyncWebAssembly: true,
			layers: true, // optional, required with some bundlers/frameworks
		};
    config.resolve.fallback = {
      "mongodb-client-encryption": false ,
      "aws4": false
    }
		return config;
  },
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss";`,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

module.exports = nextConfig;
