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
    <ol className="event-history">
      {events.slice(0, MAX_EVENTS_TO_DISPLAY).map(event => {
        const {
          id,
          type,
          username,
        } = event

        return (
          <li key={id}>
            <div>
              <i className={['icon', type].join(' ')} />
              {username}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
