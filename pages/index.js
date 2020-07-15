// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Local imports
import { ChatContextProvider } from '../context/ChatContext'
import { EventHistory } from '../components/EventHistory'
import { EventHistoryContextProvider } from '../context/EventHistoryContext'
import { EventNotifications } from '../components/EventNotifications'
import { OverlayDeco } from '../components/OverlayDeco'
import { QueueContextProvider } from '../context/QueueContext'
// import { TaskInfo } from '../components/TaskInfo'
import { TwitchChat } from '../components/TwitchChat'





const Overlay = props => {
	const { useMockServer } = props

	return (
		<QueueContextProvider>
			<EventHistoryContextProvider>
				<TaskInfo />
				<TwitchChat
					useMockServer={useMockServer} />
				<OverlayDeco />
				<EventNotifications
					useMockServer={useMockServer} />
				<EventHistory />
			</EventHistoryContextProvider>
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
