// Style imports
import '../scss/reset.scss'
import '../scss/app.scss'





// Module imports
import React, {
  createRef,
  useEffect,
  useState,
} from 'react'
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
const twitchClient = new tmi.Client({
  channels: ['#TrezyCodes'],
  connection: {
    port: 3001,
    server: 'localhost',
  },
  options: {
    debug: true,
  },
})





const Overlay = () => {
  const [events, setEvents] = useState(initialEvents)
  const alertRef = createRef(null)

  useEffect(() => {
    if (events.length && alertRef.current) {
      alertRef.current.addEventListener('ended', () => {
        setEvents(previousEvents => {
          previousEvents.shift()
          setEvents([...previousEvents])
        })
      })
    }
  }, [events])

  useEffect(() => {
    if (typeof window !== 'undefined') {
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





export default Overlay
