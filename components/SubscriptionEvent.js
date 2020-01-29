// Module imports
import React from 'react'





const SubscriptionEvent = props => {
  const {
    displayName,
    months,
  } = props
  
  return (
    <li className="event subscription-event">
      <div className="icon" />

      <p>
        <span className="username">{displayName}</span> just <em><strong>subscribed</strong></em>!
      </p>
    </li>
  )
}





export default SubscriptionEvent
