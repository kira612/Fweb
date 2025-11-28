/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '**',
            },
        ],
    },
    webpack: (config, { webpack }) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        }
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /^bufferutil$|^utf-8-validate$/,
            })
        );
        return config
    },
};

module.exports = nextConfig;
