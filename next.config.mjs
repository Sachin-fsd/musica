/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["c.saavncdn.com", "anothercdn.net"], // add all image hostnames here
    },
};

export default nextConfig;
