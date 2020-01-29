// Module imports
import React from 'react'





const RaidEvent = props => {
  const {
    viewers,
    displayName,
  } = props
  
  return (
    <li className="event raid-event">
      <div className="icon" />

      <p>
        <span className="username">{displayName}</span> raided with <em><strong>{viewers} viewers</strong></em>!
      </p>
    </li>
  )
}





export default RaidEvent
