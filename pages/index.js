// Style imports
import '../scss/reset.scss'
import '../scss/app.scss'

// Module imports
import React from 'react'
import { TwitchChat } from '../components/TwitchChat'
import { OverlayDeco } from '../components/OverlayDeco'
import { EventNotifications } from '../components/EventNotifications'
import { EventHistory } from '../components/EventHistory'

const Overlay = () => (
  <>
    <TwitchChat />
    <OverlayDeco />
    <EventNotifications />
    <EventHistory />
  </>
)

export default Overlay
