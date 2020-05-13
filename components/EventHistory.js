// Module imports
import React, {
  useContext,
} from 'react'





// Local imports
import { EventHistoryContext } from '../context/EventHistoryContext'





// eslint-disable-next-line react/jsx-no-literals
export const EventHistory = () => {
  const { events } = useContext(EventHistoryContext)

  return (
    <ol className="events-history">
      {events.map(event => {
        const {
          id,
          type,
        } = event

        return (
          <li key={id}>
            <i className={['icon', type].join(' ')} />
            {`${type} Event!`}
          </li>
        )
      })}
    </ol>
  )
}
