// Module imports
import React, {
  useState,
} from 'react'
import PropTypes from 'prop-types'




const EventHistoryContext = React.createContext({
  events: [],
  addEvent: () => {},
})





const EventHistoryContextProvider = props => {
  const { children } = props

  const [events, setEvents] = useState([])

  const addEvent = event => {
    setEvents(previousEvents => ([
      ...previousEvents,
      event,
    ]))
  }

  return (
    <EventHistoryContext.Provider
      value={{
        addEvent,
        events,
      }}>
      {children}
    </EventHistoryContext.Provider>
  )
}

EventHistoryContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export {
  EventHistoryContext,
  EventHistoryContextProvider,
}
