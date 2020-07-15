/* eslint-env node */

module.exports = {
  env: {
    TILTIFY_ACCESS_TOKEN: process.env.TILTIFY_ACCESS_TOKEN,
    TWITCH_ACCESS_TOKEN: process.env.TWITCH_ACCESS_TOKEN,
    TWITCH_CHANNEL: process.env.TWITCH_CHANNEL,
    TWITCH_USERNAME: process.env.TWITCH_USERNAME,
  },

  target: 'serverless',

  webpack: config => {
    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /node_modules/u,
      loader: 'eslint-loader',
      test: /\.js$/u,
    })

    return config
  },
}
