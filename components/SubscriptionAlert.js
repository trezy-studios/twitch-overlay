// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const SubscriptionAlert = props => {
  const {
    onEnded,
    plan,
    planName,
    username,
  } = props

  return (
    <Alert
      data-props={JSON.stringify(props)}
      type="subscription"
      onEnded={onEnded}>
      <span>
        {(plan === 'Prime') && (
          <>
            <strong>{username}</strong>{' has subscribed with '}<strong>{'Twitch Prime'}</strong>{'!'}
          </>
        )}

        {(['1000', '2000', '3000'].includes(plan)) && (
          <>
            <strong>{username}</strong>{' has become a '}<strong>{planName}</strong>{'!'}
          </>
        )}
      </span>
    </Alert>
  )
}

SubscriptionAlert.propTypes = {
  onEnded: PropTypes.func.isRequired,
  plan: PropTypes.string.isRequired,
  planName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}





export { SubscriptionAlert }
