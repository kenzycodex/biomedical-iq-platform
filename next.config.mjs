/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  env: {
    NEXT_PUBLIC_FLASK_API_URL: process.env.NEXT_PUBLIC_FLASK_API_URL,
  },
}

export default nextConfig;