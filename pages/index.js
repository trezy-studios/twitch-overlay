// Style imports
import '../scss/reset.scss'
import '../scss/app.scss'





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
import { TwitchChat } from '../components/TwitchChat'
import { eventQueuePush, PRIORITY } from '../components/event-system/queue'





// Local variables
const tmiOptions = {
  channels: ['#TrezyCodes'],
  identity: {},
  options: {
    debug: true,
  },
}





const Overlay = props => {
  const {
    token,
    useMockServer,
    username,
  } = props

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (useMockServer) {
        tmiOptions.connection = {
          port: 3001,
          server: 'localhost',
        }
      }

      if (username) {
        tmiOptions.identity.username = username
      }

      if (token) {
        tmiOptions.identity.password = token
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
      // eslint-disable-next-line no-unused-vars
      twitchClient.on('cheer', (_channel, userstate, _message) => {
        // Do your stuff.
        eventQueuePush('bits', {
          duration: 5000,
          data: {
            bits: userstate.bits,
            userstate,
          },
        }, PRIORITY.HIGH)
      })
    }
  }, [])

  return (
    <>
      <TwitchChat />
      <OverlayDeco />
      <EventNotifications />
      <EventHistory />
    </>
  )
}

Overlay.getInitialProps = ({ query }) => ({
  ...query,
  useMockServer: query.useMockServer === 'true',
})

Overlay.defaultProps = {
  token: '',
  useMockServer: false,
  username: '',
}

Overlay.propTypes = {
  token: PropTypes.string,
  useMockServer: PropTypes.bool,
  username: PropTypes.string,
}





export default Overlay
