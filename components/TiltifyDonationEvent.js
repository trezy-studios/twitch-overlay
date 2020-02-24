// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const TiltifyDonationEvent = props => {
  const {
    amount,
    comment,
    name,
  } = props

  const [dollars, cents] = amount.toString().split('.')
  let amountString = dollars

  if (cents) {
    amountString += `.${cents.padEnd(2, '0')}`
  }

  return (
    <li className="event tiltify-donation-event">
      <div className="icon" />

      <p><span className="username">{name}</span>{' just donated '}<em><strong>{`$${amountString}`}</strong></em>{'!'}</p>

      <p>{`"${comment}"`}</p>
    </li>
  )
}

TiltifyDonationEvent.propTypes = {
  amount: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}





export default TiltifyDonationEvent
