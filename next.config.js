/** @type {import('next').NextConfig} */ // This JSDoc comment enables type-checking in your editor
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https', 
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'www.dropbox.com',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;