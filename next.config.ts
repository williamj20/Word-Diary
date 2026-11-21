import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  logging: {
    // Recovery links contain bearer tokens. Keep them out of dev access logs.
    incomingRequests: { ignore: [/^\/auth\/confirm(?:\?|$)/] },
  },
};

export default nextConfig;
