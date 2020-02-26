import React from 'react'
import eventQueue from '.'

const EVENT_AWAIT_NEXT = Symbol('EVENT_AWAIT_NEXT')
// eslint-disable-next-line react/prefer-stateless-function
const EventHost = () => {
  const [event, setEvent] = React.useState(EVENT_AWAIT_NEXT)
  if (event === EVENT_AWAIT_NEXT) {
    if (eventQueue.hasNext()) {
      setEvent(eventQueue.next())
    } else {
      eventQueue.eventQueueWatchOnce(() => {
        setEvent(eventQueue.next())
      })
    }
    return <div />
  }
  console.log(event)
  if (event) {
    if (!event.data.duration) {
      throw new Error('unable to find duration of event.')
    }
    setTimeout(() => setEvent(EVENT_AWAIT_NEXT), event.data.duration)
    return <div>{JSON.stringify(event.data)}</div>
  }
  return <div />
}

export default EventHost
