// Style imports
import '../scss/reset.scss'
import '../scss/app.scss'





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
import { TwitchChat } from '../components/TwitchChat'





// Local constants
const initialEvents = [
  {
    username: 'TrezyCodes',
    type: 'follow',
  },
]





// Local variables
const tmiOptions = {
  channels: ['#TrezyCodes'],
  identity: {},
  options: {
    debug: true,
  },
}
let twitchClient = null





const Overlay = props => {
  const [events, setEvents] = useState(initialEvents)
  const {
    token,
    useMockServer,
    username,
  } = props
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
        tmiOptions.connection = { server: 'fdgt.dev' }
        }

      if (username) {
        tmiOptions.identity.username = username
      }

      if (token) {
        tmiOptions.identity.password = token
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
