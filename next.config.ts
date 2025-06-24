import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'axbsyayhkkqldcocpyjo.supabase.co', // Hata mesajındaki hostname
        port: '',
        pathname: '/storage/v1/object/public/**', // Sadece bu path'deki resimlere izin ver
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Unsplash için path daha genel olabilir
      },

    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },


};

export default nextConfig;

