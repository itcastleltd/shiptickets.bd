/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/ship/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
      {
        source: '/:file(Logo|og_image|saint-martin-hero|placeholder|icon).:ext(jpg|jpeg|png|svg|webp)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
      {
        source: '/:file(llms|llms-full|ai|robots).:ext(txt)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
    ]
  },
  async redirects() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'shiptickets.bd' }],
      destination: 'https://www.shiptickets.bd/:path*',
      permanent: true,
    }]
  },
  typescript: {
    // ignoreBuildErrors: true, // Removed — enables strict type checking
  },
  images: {
    unoptimized: false,
    formats: ['image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1366, 1792, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
