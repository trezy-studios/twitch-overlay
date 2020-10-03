// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Local imports
import { EventHistory } from '../components/EventHistory'
import { EventHistoryContextProvider } from '../context/EventHistoryContext'
import { EventNotifications } from '../components/EventNotifications'
import { OverlayDeco } from '../components/OverlayDeco'
import { QueueContextProvider } from '../context/QueueContext'
// import { TaskInfo } from '../components/TaskInfo'
import { TwitchChat } from '../components/TwitchChat'
import { TwitchContextProvider } from '../context/TwitchContext'





const Overlay = props => {
	const { useMockServer } = props

	return (
		<QueueContextProvider>
			<TwitchContextProvider>
				<EventHistoryContextProvider>
					{/* <TaskInfo /> */}
					<TwitchChat
						useMockServer={useMockServer} />
					<OverlayDeco />
					<EventNotifications
						useMockServer={useMockServer} />
					<EventHistory />
				</EventHistoryContextProvider>
			</TwitchContextProvider>
		</QueueContextProvider>
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
