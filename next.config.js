/* const withPlugins = require('next-compose-plugins');
* const optimizedImages = require('next-optimized-images');
* /* const nextImages = require('next-images') */

/** @type {import('next').NextConfig} */
// const nextConfig = withPlugins([
//     [optimizedImages, {
//         mozjpeg: {
//             quality: 80,
//         },
//         pngquant: {
//             speed: 3,
//             strip: true,
//             verbose: true,
//         },
//         imagesPublicPath: '/_next/static/images/',
//     }],
//     {
//         /* The following is needed with subdomains 
//          * basePath: '/<path>',
//          * assetPrefix: '/<path>/', */
//         reactStrictMode: true,
//     },
// ]);

const nextConfig = {
    reactStrictMode: true,
    images: {
        loader: "custom",
    },
    env: {
        SITE_URL: "https://ahmed-shariff.github.io/"
    }
};

module.exports = nextConfig;
