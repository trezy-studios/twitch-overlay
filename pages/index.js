// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Local imports
import { EventHistory } from '../components/EventHistory'
import { EventNotifications } from '../components/EventNotifications'
import { EventQueueContextProvider } from '../context/EventQueueContext'
import { OverlayDeco } from '../components/OverlayDeco'
// import { TaskInfo } from '../components/TaskInfo'
import { TwitchChat } from '../components/TwitchChat'
import { TwitchContextProvider } from '../context/TwitchContext'





const Overlay = props => {
	const { useMockServer } = props

	return (
		<EventQueueContextProvider>
			<TwitchContextProvider>
				{/* <TaskInfo /> */}
				<TwitchChat
					useMockServer={useMockServer} />
				<OverlayDeco />
				<EventNotifications
					useMockServer={useMockServer} />
				<EventHistory />
			</TwitchContextProvider>
		</EventQueueContextProvider>
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
