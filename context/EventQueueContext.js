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
const EventQueueContext = React.createContext({
	addEvent: () => {},
	currentItem: null,
	history: [],
	next: () => {},
	priorityQueues: {},
	queue: [],
})





const EventQueueContextProvider = props => {
	const { children } = props
	const [currentItem, setCurrentItem] = useState(null)
	const [history, setHistory] = useState([])

	const { current: priorityQueues } = useRef(PRIORITY_VALUES.reduce((accumulator, priority) => ({
		...accumulator,
		[priority]: [],
	}), {}))

	const addEvent = useCallback((item, priority = PRIORITIES.MEDIUM) => {
		console.log('addEvent has currentItem', Boolean(currentItem), currentItem)

		if (!currentItem) {
			return setCurrentItem(item)
		}

		return priorityQueues[priority].push(item)
	}, [
		currentItem,
		setCurrentItem,
	])

	const next = useCallback(() => {
		let queueToProcess = null

		if (currentItem) {
			setHistory(oldHistory => ([
				currentItem,
				...oldHistory,
			]))
		}

		for (const priority in PRIORITY_VALUES) {
			if (priorityQueues[priority].length) {
				queueToProcess = priorityQueues[priority]
				break
			}
		}

		const newItem = queueToProcess?.shift()

		setCurrentItem(newItem || null)
	}, [
		currentItem,
		setCurrentItem,
		setHistory,
	])

	return (
		<EventQueueContext.Provider
			value={{
				addEvent,
				currentItem,
				history,
				next,
				priorityQueues,
				get queue () {
					return PRIORITY_VALUES.map(priority => priorityQueues[priority]).flat()
				},
			}}>
			{children}
		</EventQueueContext.Provider>
	)
}

EventQueueContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export {
	PRIORITIES,
	EventQueueContext,
	EventQueueContextProvider,
}
