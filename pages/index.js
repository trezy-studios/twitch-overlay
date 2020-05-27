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





const Overlay = props => {
  const { useMockServer } = props

  return (
    <EventHistoryContextProvider>
      <TaskInfo />
      <TwitchChat
        useMockServer={useMockServer} />
      <OverlayDeco />
      <EventNotifications
        useMockServer={useMockServer} />
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
