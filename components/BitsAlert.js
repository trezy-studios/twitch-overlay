// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const BitsAlert = props => {
	const {
		onEnded,
		parsedMessage,
		user,
	} = props

	const { bits } = parsedMessage

	return (
		<Alert
			data-props={JSON.stringify(props)}
			type="bits"
			onEnded={onEnded}>
			<span>
				<strong>{user.name}</strong>{' has cheered '}<strong>{bits}</strong>{`${bits === 1 ? ' bit' : ' bits'}!`}
			</span>
		</Alert>
	)
}

BitsAlert.propTypes = {
	onEnded: PropTypes.func.isRequired,
	parsedMessage: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
}





export { BitsAlert }
