// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const ResubscriptionAlert = props => {
	const {
		onEnded,
		parsedMessage,
		user,
	} = props

	const months = parsedMessage.tags['msg-param-months']
	const plan = parsedMessage.tags['msg-param-sub-plan']
	const planName = parsedMessage.tags['msg-param-sub-plan-name']

	return (
		<Alert
			data-props={JSON.stringify(props)}
			type="resubscription"
			onEnded={onEnded}>
			<div>
				{(plan === 'Prime') && (
					<>
						<div>
							<strong>{user.name}</strong>{' has subscribed with '}<strong>{'Twitch Prime'}</strong>{'!'}
						</div>

						<div>
							{'They\'ve been subscribed for '}<strong>{`${months} months`}</strong>{'!'}
						</div>
					</>
				)}

				{(['1000', '2000', '3000'].includes(plan)) && (
					<>
						<strong>{user.name}</strong>{' has been a '}<strong>{planName}</strong>{` for ${months} months!`}
					</>
				)}
			</div>
		</Alert>
	)
}

ResubscriptionAlert.propTypes = {
	onEnded: PropTypes.func.isRequired,
	parsedMessage: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
}





export { ResubscriptionAlert }
