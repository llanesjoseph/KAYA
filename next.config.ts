import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable type checking for better build safety
  // typescript: { ignoreBuildErrors: true }, // REMOVED - enable proper type checking
  // eslint: { ignoreDuringBuilds: true }, // REMOVED - enable linting

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'recharts',
      'date-fns',
    ],
  },

  // Standalone output for better deployment and smaller bundles
  output: 'standalone',

  // Transpile GenKit packages (server-side only)
  transpilePackages: [
    '@genkit-ai/googleai',
    'genkit',
    '@genkit-ai/core',
    '@genkit-ai/next',
    '@genkit-ai/firebase',
  ],

  webpack: (config, { isServer }) => {
    // Exclude server-side dependencies from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      };

      // Exclude GenKit from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'genkit': 'commonjs genkit',
        '@genkit-ai/googleai': 'commonjs @genkit-ai/googleai',
        '@genkit-ai/core': 'commonjs @genkit-ai/core',
        '@genkit-ai/firebase': 'commonjs @genkit-ai/firebase',
      });
    }

    config.module.rules.push({
      test: /handlebars/,
      loader: 'null-loader',
    });

    return config;
  },
};

export default nextConfig;
