/* eslint-env node */

// Module imports
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')





module.exports = withSass(withCSS())
