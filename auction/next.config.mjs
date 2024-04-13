/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "assets.aceternity.com",
      "images.unsplash.com",
      "my-auction-bucket.s3.ap-southeast-1.amazonaws.com",
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
