// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const RaidAlert = props => {
	const {
		onEnded,
		parsedMessage,
		user,
	} = props

	return (
		<Alert
			data-props={JSON.stringify(props)}
			type="raid"
			onEnded={onEnded}>
			<span>
				<strong>{user.name}</strong>{' is raiding with '}<strong>{parsedMessage.tags['msg-param-viewerCount']}</strong>{' potential Codémon!'}
			</span>
		</Alert>
	)
}

RaidAlert.propTypes = {
	onEnded: PropTypes.func.isRequired,
	parsedMessage: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
}





export { RaidAlert }
