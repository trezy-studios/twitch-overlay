// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const SubscriptionEvent = props => {
  const { displayName } = props

  return (
    <li className="event subscription-event">
      <div className="icon" />

      <p>
        <span className="username">{displayName}</span>{' just '}<em><strong>{'subscribed'}</strong></em>{'!'}
      </p>
    </li>
  )
}

SubscriptionEvent.propTypes = {
  displayName: PropTypes.string.isRequired,
}





export default SubscriptionEvent
