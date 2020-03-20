/* eslint-env node */

// Module imports
import React, {
  createRef,
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import tmi from 'tmi.js'





// Local imports
import { Alert } from '../components/Alert'
import { EventHistory } from '../components/EventHistory'
import { EventNotifications } from '../components/EventNotifications'
import { OverlayDeco } from '../components/OverlayDeco'
import { TaskInfo } from '../components/TaskInfo'
import { TwitchChat } from '../components/TwitchChat'





// Local constants
const initialEvents = [
  {
    username: process.env.TWITCH_USERNAME,
    type: 'follow',
  },
]





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
let twitchClient = null





const Overlay = props => {
  const [events, setEvents] = useState(initialEvents)
  const { useMockServer } = props
  const alertRef = createRef(null)

  useEffect(() => {
    if (events.length && alertRef.current) {
      alertRef.current.addEventListener('ended', () => {
        setEvents(previousEvents => {
          previousEvents.shift()
          return [...previousEvents]
        })
      })
    }
  }, [events])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (useMockServer) {
        tmiOptions.connection = { server: 'tmi.fdgt.dev' }
      }

      twitchClient = new tmi.Client(tmiOptions)

      if (useMockServer) {
        window.twitchClient = twitchClient
      }

      twitchClient.connect()
    }
  }, [])

  return (
    <>
      {Boolean(events.length) && (
        <Alert
          ref={alertRef}
          {...events[0]} />
      )}
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
