/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.ANALYTICS_TEST_MODE === 'true' ? '.next-metrics-test' : '.next',
  images: { unoptimized: true },
  trailingSlash: true,
  async headers() {
    return ['/analise/:path*', '/api/metrics/:path*'].map(source => ({ source, headers: [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
    ] }))
  },
}

export default nextConfig
