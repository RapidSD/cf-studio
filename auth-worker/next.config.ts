import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:8787']
    }
  },
  // Configure functions for Edge Runtime APIs
  // This is needed for OpenNext to correctly bundle edge functions
  functions: {
    'app/api/auth/login/route': { runtime: 'edge' },
    'app/api/auth/logout/route': { runtime: 'edge' },
    'app/api/auth/refresh/route': { runtime: 'edge' },
    'app/api/auth/verify/route': { runtime: 'edge' },
    'app/api/setup/route': { runtime: 'edge' }
  }
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
