/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.digitaloceanspaces.com" },
      { protocol: "https", hostname: "**.cdn.digitaloceanspaces.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" }
    ]
  }
};
export default nextConfig;
