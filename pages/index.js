/* eslint-env node */

// Module imports
import React, {
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line import/no-unresolved
import tmi from 'tmi.js'





// Local imports
import { EventHistory } from '../components/EventHistory'
import { EventNotifications } from '../components/EventNotifications'
import { OverlayDeco } from '../components/OverlayDeco'
import { TaskInfo } from '../components/TaskInfo'
import { TwitchChat } from '../components/TwitchChat'
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





const Overlay = props => {
  const { useMockServer } = props

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (useMockServer) {
        tmiOptions.connection = { server: 'tmi.fdgt.dev' }
      }

      const twitchClient = new tmi.Client(tmiOptions)

      if (useMockServer) {
        window.twitchClient = twitchClient
      }

      twitchClient.connect()
      // eslint-disable-next-line max-params
      twitchClient.on('resub', (_channel, _username, _months, _message, userstate, _methods) => {
        // Do your stuff.
        const months = Number(userstate['msg-param-cumulative-months'])
        eventQueuePush('resubscription', {
          duration: 5000,
          data: {
            _channel, _username, _months, _message, months, _methods,
          },
        })
      }, PRIORITY.HIGH)

      // eslint-disable-next-line max-params
      twitchClient.on('subgift', (_channel, _username, _streakMonths, _recipient, _methods, userstate) => {
        // Do your stuff.
        const senderCount = Number(userstate['msg-param-sender-count'])
        eventQueuePush('subgift', {
          duration: 5000,
          data: {
            senderCount, _channel, _username, _streakMonths, _recipient, _methods, userstate,
          },
        })
      })

      // eslint-disable-next-line no-unused-vars
      twitchClient.on('giftpaidupgrade', (_channel, _username, _sender, _userstate) => {
        // Do your stuff.
        eventQueuePush('giftpaidupgrade', {
          duration: 5000,
          data: {},
        })
      })
    }
  }, [])

  return (
    <>
      <TaskInfo />
      <TwitchChat />
      <OverlayDeco />
      <EventNotifications />
      <EventHistory />
    </>
  )
}

Overlay.getInitialProps = ({ query }) => ({
  useMockServer: query.useMockServer === 'true',
})

Overlay.defaultProps = {
  useMockServer: false,
}

Overlay.propTypes = {
  useMockServer: PropTypes.bool,
}





export default Overlay
