import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['example.com', 'images.unsplash.com', 'maps.googleapis.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/ml/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy to Flask ML service
      },
    ];
  },
};

export default nextConfig;
