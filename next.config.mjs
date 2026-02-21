/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: 'http://localhost:3001/api/admin/:path*',
      },
    ];
  },
  turbopack: {},
  images: {
    unoptimized: true,
  },

};

export default nextConfig;
