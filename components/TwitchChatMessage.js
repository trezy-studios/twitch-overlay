// Module imports
import React from 'react'
import PropTypes from 'prop-types'





const TwitchChatMessage = props => {
	const {
		message: {
			message,
		},
	} = props

	return (
		<div className="body">
			{message}
		</div>
	)
}

TwitchChatMessage.propTypes = {
	message: PropTypes.object.isRequired,
}





export { TwitchChatMessage }
