/* eslint-env node */

// Module imports
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')





module.exports = withSass(withCSS({
  publicRuntimeConfig: {
    TILTIFY_ACCESS_TOKEN: '@tiltify-access-token',
    TWITCH_ACCESS_TOKEN: '@twitch-access-token',
    TWITCH_CHANNEL: '@twitch-channel',
    TWITCH_USERNAME: '@twitch-username',
  },
}))
