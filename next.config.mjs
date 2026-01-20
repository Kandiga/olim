/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    formats: ['image/webp'],
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better compatibility with static hosting
};

export default nextConfig;
