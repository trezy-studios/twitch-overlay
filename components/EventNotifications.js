// Module imports
import React from 'react'





// Local imports
import { BitsAlert } from './BitsAlert'
import { hasNext } from './event-system/queue'
import EventHost from './event-system/EventHost'





// eslint-disable-next-line react/prop-types
EventHost.register('bits', props => {
  const {
    data,
    next,
  } = props

  const handleNext = ({ target }) => {
    if (hasNext()) {
      target.play()
    }

    next()
  }

  return (
    <BitsAlert
      bits={data.userstate.bits}
      username={data.userstate['display-name']}
      onEnded={handleNext} />
  )
})





export const EventNotifications = () => (
  <div className="event-notifications">
    <EventHost />
  </div>
)
