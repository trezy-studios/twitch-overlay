/* eslint-env node */

// Module imports
import { useEffect } from 'react'
import tmi from 'tmi.js'





// Local imports
import {
  eventQueuePush,
  PRIORITY,
} from '../components/event-system/queue'





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
      twitchClient.on('cheer', (channel, userstate) => {
        const bits = Number(userstate.bits)

        eventQueuePush('bits', {
          duration: 5000,
          data: {
            bits,
            type: 'bits',
            username: userstate.username,
          },
        }, PRIORITY.MEDIUM_LOW)
      })

      twitchClient.on('raided', (channel, username, viewers) => {
        eventQueuePush('raid', {
          duration: 5000,
          data: {
            type: 'raid',
            username,
            viewers,
          },
        }, PRIORITY.MEDIUM_LOW)
      })

      // eslint-disable-next-line max-params
      twitchClient.on('resub', (channel, username, months, message, userstate, method) => {
        eventQueuePush('resubscription', {
          duration: 5000,
          data: {
            months,
            plan: method.plan,
            planName: method.planName,
            type: 'resubscription',
            username,
          },
        }, PRIORITY.MEDIUM_LOW)
      })

      twitchClient.on('subscription', (channel, username, method) => {
        eventQueuePush('subscription', {
          duration: 5000,
          data: {
            plan: method.plan,
            planName: method.planName,
            type: 'subscription',
            username,
          },
        }, PRIORITY.MEDIUM_LOW)
      })

      return () => {
        twitchClient.removeAllListeners()
        twitchClient.disconnect()
      }
    }

    return () => {}
  }, dependencies)
}
