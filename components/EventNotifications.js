// Module imports
import React, {
  useContext,
} from 'react'





// Local imports
import { EventHistoryContext } from '../context/EventHistoryContext'
import { BitsAlert } from './BitsAlert'
import { hasNext } from './event-system/queue'
import EventHost from './event-system/EventHost'





// eslint-disable-next-line react/prop-types
EventHost.register('bits', props => {
  const {
    data,
    next,
  } = props
  const { addEvent } = useContext(EventHistoryContext)

  const handleNext = ({ target }) => {
    if (hasNext()) {
      target.play()
    }

    addEvent(data)
    next()
  }

  return (
    <BitsAlert
      bits={data.bits}
      username={data['display-name']}
      onEnded={handleNext} />
  )
})





export const EventNotifications = () => (
  <div className="event-notifications">
    <EventHost />
  </div>
)
