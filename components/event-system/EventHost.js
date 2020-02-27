import React from 'react'
import eventQueue from '.'

const EVENT_AWAIT_NEXT = Symbol('EVENT_AWAIT_NEXT')
const componentRegistry = {}
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
  if (event) {
    if (!event.data.duration) {
      event.data.duration = 1000
    }
    setTimeout(() => setEvent(EVENT_AWAIT_NEXT), event.data.duration)
    if (componentRegistry[event.type]) {
      const Component = componentRegistry[event.type]
      return <Component {...event.data} />
    }
    return <code>{'missing component for event type '}{event.type}{'please do EventHost.register(\''}{event.type}{'\',Component)'}</code>
  }
  return <div />
}
EventHost.register = (type, component) => {
  componentRegistry[type] = component
}
export default EventHost
