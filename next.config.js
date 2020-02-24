/* eslint-env node */

// Module imports
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')





module.exports = withSass(withCSS({
  webpack: config => {
    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /node_modules/u,
      loader: 'eslint-loader',
      test: /\.js$/u,
    })

    return config
  },
}))
