import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable telemetry to prevent mkdir errors
  telemetry: false,
  
  // Image configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    // Disable turbopack if causing issues
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // Add better error handling for development
      config.infrastructureLogging = {
        level: 'warn',
      }
    }
    return config
  },
};

export default nextConfig;
