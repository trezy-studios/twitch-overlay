// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const BitsEvent = props => {
  const {
    bits,
    displayName,
  } = props

  return (
    <li className="event bits-event">
      <div className="icon" />

      <p>
        <span className="username">{displayName}</span>{' cheered for '}<em><strong>{bits}</strong>{' bits'}</em>{'!'}
      </p>
    </li>
  )
}

BitsEvent.propTypes = {
  bits: PropTypes.number.isRequired,
  displayName: PropTypes.string.isRequired,
}





export default BitsEvent
