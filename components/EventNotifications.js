/* eslint-disable react/jsx-no-bind */
import React from 'react'
import EventHost from './event-system/EventHost'
import eventQueue from './event-system'

let id = 0
export const EventNotifications = () => {
  // eslint-disable-next-line no-return-assign
  const _handleAddTestEventLOW = () => eventQueue.eventQueuePush('test', { duration: 5000, id: (id += 1), priority: 'LOW' }, eventQueue.PRIORITY.LOW)
  // eslint-disable-next-line no-return-assign
  const _handleAddTestEventMEDIUM = () => eventQueue.eventQueuePush('test', { duration: 5000, id: (id += 1), priority: 'MEDIUM' }, eventQueue.PRIORITY.MEDIUM)
  // eslint-disable-next-line no-return-assign
  const _handleAddTestEventHIGH = () => eventQueue.eventQueuePush('test', { duration: 5000, id: (id += 1), priority: 'HIGH' }, eventQueue.PRIORITY.HIGH)

  return (
    <div className="event-notifications">
      <EventHost />
      <br />
      <button
        type="button"
        onClick={_handleAddTestEventLOW}>
        {'TEST EVENT LOW PRIORITY'}
      </button>
      <br />
      <button
        type="button"
        onClick={_handleAddTestEventHIGH}>
        {'TEST EVENT HIGH PRIORITY'}
      </button>
      <br />
      <button
        type="button"
        onClick={_handleAddTestEventMEDIUM}>
        {'TEST EVENT MEDIUM PRIORITY'}
      </button>
    </div>
  )
}
