// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const BitsAlert = props => {
	const {
		bits,
		onEnded,
		username,
	} = props

	return (
		<Alert
			data-props={JSON.stringify(props)}
			type="bits"
			onEnded={onEnded}>
			<span>
				<strong>{username}</strong>{' has cheered '}<strong>{bits}</strong>{`${bits === 1 ? ' bit' : ' bits'}!`}
			</span>
		</Alert>
	)
}

BitsAlert.propTypes = {
	bits: PropTypes.number.isRequired,
	onEnded: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
}





export { BitsAlert }
