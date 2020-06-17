// Module imports
import React, {
  useCallback,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'





const PRIORITIES = {
  VERY_LOW: 5,
  LOW: 4,
  MEDIUM_LOW: 3,
  MEDIUM: 2,
  MEDIUM_HIGH: 1,
  HIGH: 0,
}
const PRIORITY_VALUES = Object.values(PRIORITIES).sort()
const QueueContext = React.createContext({
  addItem: () => {},
  currentItem: null,
  next: () => {},
  priorityQueues: {},
  queue: [],
})





const QueueContextProvider = props => {
  const { children } = props

  const [currentItem, setCurrentItem] = useState(null)
  const { current: priorityQueues } = useRef(PRIORITY_VALUES.reduce((accumulator, priority) => ({
    ...accumulator,
    [priority]: [],
  }), {}))

  const addItem = useCallback((item, priority = PRIORITIES.MEDIUM) => {
    if (!currentItem) {
      return setCurrentItem(item)
    }

    return priorityQueues[priority].push(item)
  }, [setCurrentItem])

  const next = useCallback(() => {
    let queueToProcess = null

    for (const priority in PRIORITY_VALUES) {
      if (priorityQueues[priority].length) {
        queueToProcess = priorityQueues[priority]
        break
      }
    }

    setCurrentItem(queueToProcess?.shift() || null)
  }, [setCurrentItem])

  return (
    <QueueContext.Provider
      value={{
        addItem,
        currentItem,
        next,
        priorityQueues,
        get queue () {
          return PRIORITY_VALUES.map(priority => priorityQueues[priority]).flat()
        },
      }}>
      {children}
    </QueueContext.Provider>
  )
}

QueueContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export {
  PRIORITIES,
  QueueContext,
  QueueContextProvider,
}
