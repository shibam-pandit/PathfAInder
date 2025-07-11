/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['playwright-core', 'playwright-aws-lambda'],
};

export default nextConfig;
