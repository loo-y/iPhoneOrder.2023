/** @type {import('next').NextConfig} */
const extensionNextConfig = require('./extension.next.config')

const nextConfig = process.env.BUILD_TYPE == `extension` ? extensionNextConfig : {
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