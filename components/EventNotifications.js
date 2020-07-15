// Module imports
import React, {
	useContext,
	// useEffect,
} from 'react'
import { v4 as uuid } from 'uuid'
import PropTypes from 'prop-types'





// Local imports
import { EventHistoryContext } from '../context/EventHistoryContext'
import { BitsAlert } from './BitsAlert'
import {
	PRIORITIES,
	QueueContext,
} from '../context/QueueContext'
import { RaidAlert } from './RaidAlert'
import { ResubscriptionAlert } from './ResubscriptionAlert'
import { SubscriptionAlert } from './SubscriptionAlert'
import { useTwitchEvents } from '../hooks/useTwitchEvents'





const EventNotifications = props => {
	const {
		addItem,
		currentItem,
		next,
	} = useContext(QueueContext)
	const { addEvent } = useContext(EventHistoryContext)
	const { useMockServer } = props

	useTwitchEvents({
		onCheer: (channel, userstate) => {
			addItem({
				bits: Number(userstate.bits),
				id: userstate.id,
				type: 'bits',
				username: userstate.username,
			}, PRIORITIES.MEDIUM_LOW)
		},
		onRaid: (channel, username, viewers) => {
			addItem({
				id: uuid(),
				type: 'raid',
				username,
				viewers,
			}, PRIORITIES.MEDIUM_LOW)
		},
		// eslint-disable-next-line max-params
		onResub: (channel, username, months, message, userstate, method) => {
			addItem({
				id: uuid(),
				months,
				plan: method.plan,
				planName: method.planName,
				type: 'resubscription',
				username,
			}, PRIORITIES.MEDIUM_LOW)
		},
		onSub: (channel, username, method) => {
			addItem({
				id: uuid(),
				plan: method.plan,
				planName: method.planName,
				type: 'subscription',
				username,
			}, PRIORITIES.MEDIUM_LOW)
		},
		useMockServer,
	})

	const onEnded = () => {
		addEvent(currentItem)
		next()
	}

	return (
		<div className="event-notifications">
			{(currentItem?.type === 'bits') && (
				<BitsAlert
					bits={currentItem.bits}
					username={currentItem.username}
					onEnded={onEnded} />
			)}

			{(currentItem?.type === 'raid') && (
				<RaidAlert
					username={currentItem.username}
					viewers={currentItem.viewers}
					onEnded={onEnded} />
			)}

			{(currentItem?.type === 'resubscription') && (
				<ResubscriptionAlert
					months={currentItem.months}
					plan={currentItem.plan}
					planName={currentItem.planName}
					username={currentItem.username}
					onEnded={onEnded} />
			)}

			{(currentItem?.type === 'subscription') && (
				<SubscriptionAlert
					plan={currentItem.plan}
					planName={currentItem.planName}
					username={currentItem.username}
					onEnded={onEnded} />
			)}
		</div>
	)
}

EventNotifications.defaultProps = {
	useMockServer: false,
}

EventNotifications.propTypes = {
	useMockServer: PropTypes.bool,
}





export { EventNotifications }
