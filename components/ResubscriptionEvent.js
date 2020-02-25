// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const ResubscriptionEvent = props => {
  const {
    displayName,
    months,
  } = props

  return (
    <li className="event resubscription-event">
      <div className="icon" />

      <p>
        <span className="username">{displayName}</span>{' just resubscribed ('}<em><strong>{`${months} months`}</strong></em>{')!'}
      </p>
    </li>
  )
}

ResubscriptionEvent.propTypes = {
  displayName: PropTypes.string.isRequired,
  months: PropTypes.number.isRequired,
}





export default ResubscriptionEvent
