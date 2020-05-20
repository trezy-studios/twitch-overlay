// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { Alert } from './Alert'





const ResubscriptionAlert = props => {
  const {
    months,
    onEnded,
    plan,
    planName,
    username,
  } = props

  return (
    <Alert
      data-props={JSON.stringify(props)}
      type="resubscription"
      onEnded={onEnded}>
      <div>
        {(plan === 'Prime') && (
          <>
            <div>
              <strong>{username}</strong>{' has subscribed with '}<strong>{'Twitch Prime'}</strong>{'!'}
            </div>

            <div>
              {'They\'ve been subscribed for '}<strong>{`${months} months`}</strong>{'!'}
            </div>
          </>
        )}

        {(['1000', '2000', '3000'].includes(plan)) && (
          <>
            <strong>{username}</strong>{' has been a '}<strong>{planName}</strong>{` for ${months} months!`}
          </>
        )}
      </div>
    </Alert>
  )
}

ResubscriptionAlert.propTypes = {
  months: PropTypes.number.isRequired,
  onEnded: PropTypes.func.isRequired,
  plan: PropTypes.string.isRequired,
  planName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}





export { ResubscriptionAlert }
