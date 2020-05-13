// Module imports
import React, {
  useContext,
} from 'react'





// Local imports
import { EventHistoryContext } from '../context/EventHistoryContext'





// Local constants
const MAX_EVENTS_TO_DISPLAY = 7





// eslint-disable-next-line react/jsx-no-literals
export const EventHistory = () => {
  const { events } = useContext(EventHistoryContext)

  return (
    <ol className="events-history">
      {events.slice(0, MAX_EVENTS_TO_DISPLAY).map(event => {
        const {
          id,
          type,
        } = event

        return (
          <li key={id}>
            <i className={['icon', type].join(' ')} />
            {event['display-name']}
          </li>
        )
      })}
    </ol>
  )
}
