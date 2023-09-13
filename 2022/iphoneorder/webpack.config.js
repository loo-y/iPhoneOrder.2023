const path = require('path')

module.exports = {
    entry: './dist/index',
    output: {
        path: path.resolve(__dirname, 'dist/publish'),
        filename: 'iPhoneOrder.js',
    },
}
