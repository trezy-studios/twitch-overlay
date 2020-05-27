/* eslint-env node */

// Module imports
import { useEffect } from 'react'
import tmi from 'tmi.js'





// Local constants
const tmiOptions = {
  channels: [
    process.env.TWITCH_CHANNEL,
  ],
  identity: {
    password: process.env.TWITCH_ACCESS_TOKEN,
    username: process.env.TWITCH_USERNAME,
  },
  options: {
    debug: true,
  },
}





// Local variables
let connectionCount = 0
let twitchClient = null





export const useTwitchEvents = (options, dependencies = []) => {
  const {
    onChat,
    onCheer,
    onRaid,
    onResub,
    onSub,
    useMockServer,
  } = options

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!twitchClient) {
        if (useMockServer) {
          tmiOptions.connection = {
            // secure: true,
            server: 'irc.fdgt.dev',
            // server: '161.35.98.228',
          }
        }

        twitchClient = new tmi.Client(tmiOptions)

        // if (useMockServer) {
        window.twitchClient = twitchClient
        // }

        twitchClient.connect()
      }

      if (onChat) {
        twitchClient.on('chat', onChat)
      }

      if (onCheer) {
        twitchClient.on('cheer', onCheer)
      }

      if (onRaid) {
        twitchClient.on('raided', onRaid)
      }

      if (onResub) {
        twitchClient.on('resub', onResub)
      }

      if (onSub) {
        twitchClient.on('subscription', onSub)
      }

      connectionCount += 1

      return () => {
        connectionCount -= 1

        if (onChat) {
          twitchClient.off('chat', onChat)
        }

        if (onCheer) {
          twitchClient.off('cheer', onCheer)
        }

        if (onRaid) {
          twitchClient.off('raided', onRaid)
        }

        if (onResub) {
          twitchClient.off('resub', onResub)
        }

        if (onSub) {
          twitchClient.off('subscription', onSub)
        }

        if (!connectionCount) {
          twitchClient.disconnect()
        }
      }
    }

    return () => {}
  }, dependencies)
}
