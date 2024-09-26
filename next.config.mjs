/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    config.watchOptions = {
      ignored: /node_modules/,
      poll: 1000,
      aggregateTimeout: 300,
    };
    
    if (dev) {
      config.devtool = 'cheap-module-source-map'; // Faster than the default
    }

    return config;
  },
  env: {
    NEXT_PUBLIC_FLASK_API_URL: process.env.NEXT_PUBLIC_FLASK_API_URL,
  },
};

export default nextConfig;