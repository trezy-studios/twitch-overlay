// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const RaidEvent = props => {
  const {
    displayName,
    viewers,
  } = props

  return (
    <li className="event raid-event">
      <div className="icon" />

      <p>
        <span className="username">{displayName}</span>{' raided with '}<em><strong>{`${viewers} viewers`}</strong></em>{'!'}
      </p>
    </li>
  )
}

RaidEvent.propTypes = {
  displayName: PropTypes.string.isRequired,
  viewers: PropTypes.number.isRequired,
}





export default RaidEvent
