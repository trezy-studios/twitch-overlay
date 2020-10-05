// Module imports
import React, {
	useCallback,
	useContext,
} from 'react'





// Local imports
import {
	// PRIORITIES,
	EventQueueContext,
} from '../context/EventQueueContext'
import { BitsAlert } from './BitsAlert'
import { RaidAlert } from './RaidAlert'
import { ResubscriptionAlert } from './ResubscriptionAlert'
import { SubscriptionAlert } from './SubscriptionAlert'





const EventNotifications = () => {
	const {
		currentItem,
		next,
	} = useContext(EventQueueContext)

	const onEnded = useCallback(() => next(), [next])

	const eventComponentProps = {
		...currentItem,
		onEnded,
	}

	return (
		<div className="event-notifications">
			{(currentItem?.type === 'bits') && (
				<BitsAlert {...eventComponentProps} />
			)}

			{(currentItem?.type === 'raid') && (
				<RaidAlert {...eventComponentProps} />
			)}

			{(currentItem?.type === 'resubscription') && (
				<ResubscriptionAlert {...eventComponentProps} />
			)}

			{(currentItem?.type === 'sub') && (
				<SubscriptionAlert {...eventComponentProps} />
			)}
		</div>
	)
}





export { EventNotifications }
