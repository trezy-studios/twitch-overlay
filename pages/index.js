// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Local imports
import { EventHistory } from '../components/EventHistory'
import { EventNotifications } from '../components/EventNotifications'
import { OverlayDeco } from '../components/OverlayDeco'
import { TaskInfo } from '../components/TaskInfo'
import { TwitchChat } from '../components/TwitchChat'
import { useTwitchEvents } from '../hooks/useTwitchEvents'





const Overlay = props => {
  const { useMockServer } = props

  useTwitchEvents({ useMockServer })

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
