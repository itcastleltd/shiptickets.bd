/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://wa.me https://*.wa.me; img-src 'self' data: https: https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://www.googletagmanager.com https://wa.me https://*.wa.me;" },
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
