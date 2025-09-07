import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable telemetry to prevent mkdir errors
  telemetry: false,
  
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
