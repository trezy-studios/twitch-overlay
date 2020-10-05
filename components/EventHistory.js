// Module imports
import React, {
	useContext,
} from 'react'





// Local imports
import { EventQueueContext } from '../context/EventQueueContext'





// Local constants
const MAX_EVENTS_TO_DISPLAY = 7





// eslint-disable-next-line react/jsx-no-literals
export const EventHistory = () => {
	const { history } = useContext(EventQueueContext)

	return (
		<ol className="event-history">
			{history.slice(0, MAX_EVENTS_TO_DISPLAY).map(event => {
				const {
					id,
					type,
					user,
				} = event

				return (
					<li key={id}>
						<div>
							<i className={['icon', type].join(' ')} />
							{user.name}
						</div>
					</li>
				)
			})}
		</ol>
	)
}
