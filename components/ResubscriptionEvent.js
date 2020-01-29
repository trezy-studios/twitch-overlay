// Module imports
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
        <span className="username">{displayName}</span> just resubscribed (<em><strong>{months} months</strong></em>)!
      </p>
    </li>
  )
}





export default ResubscriptionEvent
