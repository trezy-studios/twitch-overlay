// Module imports
import React from 'react'





const HostEvent = props => {
  const {
    displayName,
    hostType,
    viewers,
  } = props
  
  return (
    <li className="event host-event">
      <div className="icon" />
      
      <p>
        {(hostType === 'AUTO') && (
          <>
            <span className="username">{displayName}</span> autohosted!
          </>
        )}
        
        {(hostType === 'WITHOUT_VIEWERS') && (
          <>
            <span className="username">{displayName}</span> hosted!
          </>
        )}
        
        {(hostType === 'WITH_VIEWERS') && (
          <>
            <span className="username">{displayName}</span> hosted with <em>{viewers} viewers</em>!
          </>
        )}
      </p>
    </li>
  )
}





export default HostEvent
