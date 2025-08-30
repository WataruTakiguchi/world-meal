// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        pathname: "/images/media/meals/**",
      },
      // REST Countries の flags.png は flagcdn.com を指すことが多い
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      // 稀に Wikimedia 経由もあるため保険で許可
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
