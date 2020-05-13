// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Local imports
import { EventHistory } from '../components/EventHistory'
import { EventHistoryContextProvider } from '../context/EventHistoryContext'
import { EventNotifications } from '../components/EventNotifications'
import { OverlayDeco } from '../components/OverlayDeco'
import { TaskInfo } from '../components/TaskInfo'
import { TwitchChat } from '../components/TwitchChat'
import { useTwitchEvents } from '../hooks/useTwitchEvents'





const Overlay = props => {
  const { useMockServer } = props

  useTwitchEvents({ useMockServer })

  return (
    <EventHistoryContextProvider>
      <TaskInfo />
      <TwitchChat />
      <OverlayDeco />
      <EventNotifications />
      <EventHistory />
    </EventHistoryContextProvider>
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
