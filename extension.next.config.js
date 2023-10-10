/** @type {import('next').NextConfig} */
console.log(`BUILD_TYPE`, process.env.BUILD_TYPE)
const nextConfig = {
    output: 'export',
    // Optional: Add a trailing slash to all paths `/about` -> `/about/`
    // trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    distDir: 'extension/dist',
    cleanDistDir: true,
    // after build, we need to move inline script from main.html into a single js file,
    // otherwise, chrome will not allow inline script to run
    assetPrefix: ".",
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    webpack: (config, options) => {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        }
        return config
    },
}

module.exports = nextConfig