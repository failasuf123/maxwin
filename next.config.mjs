/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pix5.agoda.net","pix4.agoda.net","pix3.agoda.net","pix2.agoda.net","pix1.agoda.net","q-xx.bstatic.com"], // Tambahkan domain untuk next/image
  },
  async rewrites() {
    return [
      {
        source: "/agoda-partner-verification",
        destination: "/AgodaPartnerVerification.htm",
      },
    ];
  },
};

export default nextConfig;
