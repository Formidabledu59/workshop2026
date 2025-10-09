/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/workshop2026",
    // assetPrefix: "/workshop2026/",           // local build, doesn't works for now
    output: "export",
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
