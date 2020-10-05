// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const SubscriptionAlert = props => {
	const {
		onEnded,
		parsedMessage,
		user,
	} = props

	const plan = parsedMessage.tags['msg-param-sub-plan']
	const planName = parsedMessage.tags['msg-param-sub-plan-name']

	return (
		<Alert
			data-props={JSON.stringify(props)}
			type="subscription"
			onEnded={onEnded}>
			<span>
				{(plan === 'Prime') && (
					<>
						<strong>{user.name}</strong>{' has subscribed with '}<strong>{'Twitch Prime'}</strong>{'!'}
					</>
				)}

				{(['1000', '2000', '3000'].includes(plan)) && (
					<>
						<strong>{user.name}</strong>{' has become a '}<strong>{planName}</strong>{'!'}
					</>
				)}
			</span>
		</Alert>
	)
}

SubscriptionAlert.propTypes = {
	onEnded: PropTypes.func.isRequired,
	parsedMessage: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
}





export { SubscriptionAlert }
