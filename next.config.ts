import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w0.peakpx.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bookstation.ie',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'anitrendz.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd28hgpri8am2if.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'resizing.flixster.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dailyanimeart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-cdn.ubuy.com.mm',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'us-a.tapas.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imusic.b-cdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
