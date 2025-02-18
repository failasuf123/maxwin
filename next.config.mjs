// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  