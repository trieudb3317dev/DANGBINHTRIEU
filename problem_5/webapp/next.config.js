/** Next.js config to allow remote images from Cloudinary */
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
    // or use remotePatterns for more control:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '/**',
    //   },
    // ],
  },
};
