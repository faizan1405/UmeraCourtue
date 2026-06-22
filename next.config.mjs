/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/shipping-policy',
        destination: '/shipping-returns',
        permanent: true,
      },
      {
        source: '/return-policy',
        destination: '/shipping-returns',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/shipping-returns',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
