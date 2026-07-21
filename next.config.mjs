/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/politicas',
        destination: '/politica',
        permanent: true,
      },
      {
        source: '/politica-de-privacidade',
        destination: '/politica',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Apenas liberar iframes do YouTube — sem restringir outros recursos
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://maps.google.com https://www.google.com;",
          },
        ],
      },
    ]
  },
}

export default nextConfig