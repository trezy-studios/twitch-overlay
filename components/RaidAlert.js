// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const RaidAlert = props => {
	const {
		onEnded,
		username,
		viewers,
	} = props

	return (
		<Alert
			data-props={JSON.stringify(props)}
			type="raid"
			onEnded={onEnded}>
			<span>
				<strong>{username}</strong>{' is raiding with '}<strong>{viewers}</strong>{' potential Codémon!'}
			</span>
		</Alert>
	)
}

RaidAlert.propTypes = {
	onEnded: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	viewers: PropTypes.string.isRequired,
}





export { RaidAlert }
