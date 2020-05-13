/* eslint-env node */

// Module imports
import { useEffect } from 'react'
import tmi from 'tmi.js'





// Local imports
import { eventQueuePush, PRIORITY } from '../components/event-system/queue'





// Local variables
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





export const useTwitchEvents = (options, dependencies = []) => {
  const { useMockServer } = options

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (useMockServer) {
        tmiOptions.connection = {
          server: 'tmi.fdgt.dev',
        }
      }

      const twitchClient = new tmi.Client(tmiOptions)

      if (useMockServer) {
        window.twitchClient = twitchClient
      }

      twitchClient.connect()

      // eslint-disable-next-line max-params
      twitchClient.on('cheer', (channel, userstate, message) => {
        const bits = Number(userstate.bits)

        eventQueuePush('bits', {
          duration: 5000,
          data: {
            ...userstate,
            bits,
            channel,
            message,
            type: 'bits',
          },
        }, PRIORITY.MEDIUM_LOW)
      })

      return () => {
        twitchClient.removeAllListeners('cheer')
        twitchClient.disconnect()
      }
    }

    return () => {}
  }, dependencies)
}
