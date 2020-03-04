import React from 'react'
import eventQueue from '.'

const EVENT_AWAIT_NEXT = Symbol('EVENT_AWAIT_NEXT')
const componentRegistry = {}

const EventHost = () => {
  const [event, setEvent] = React.useState(EVENT_AWAIT_NEXT)
  const vref = React.createRef()
  React.useEffect(() => {
    console.log(vref)
    if (vref.current) {
      console.log(vref)
      vref.current.addEventListener('ended', () => {
        setEvent(EVENT_AWAIT_NEXT)
      })
    }
  }, [])
  if (event === EVENT_AWAIT_NEXT) {
    if (eventQueue.hasNext()) {
      setEvent(eventQueue.next())
    } else {
      eventQueue.eventQueueWatchOnce(() => {
        setEvent(eventQueue.next())
      })
    }
    return null
  }
  if (event) {
    if (!event.data.duration) {
      event.data.duration = 1000
    }
    if (componentRegistry[event.type]) {
      const Component = componentRegistry[event.type]
      return <Component {...event.data} ref={vref} />
    }
    return (
      <>
        <code>{`missing component for event type ${event.type} please do EventHost.register('${event.type}', Component)`}</code>
        <h1>
          {'did you mean to put one of the following?'}
        </h1>
        <ul>
          {Object.keys(componentRegistry).map(key => (<li key={key}><code>{key}</code></li>))}
        </ul>
      </>
    )
  }
  return null
}

EventHost.register = (type, component) => {
  componentRegistry[type] = component
}

export default EventHost
