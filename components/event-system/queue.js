const HOW_MANY_PRIORITIES_ARE_THERE_NITRO = 6
const eventQueue = Array.from(Array(HOW_MANY_PRIORITIES_ARE_THERE_NITRO), () => [])
const eventContentListeners = []
let eventContentOnce = []

function eventQueueEmpty () {
  for (const queue of eventQueue) {
    if (queue.length) {
      return false
    }
  }
  return true
}

function notifyOfContent () {
  for (const callback of eventContentListeners) {
    try {
      callback()
    } catch (_e) {
      _e.message = 'NOOP'
    }
  }
  for (const callback of eventContentOnce) {
    try {
      callback()
    } catch (_e) {
      _e.message = 'NOOP'
    }
  }
  eventContentOnce = []
}

export function hasNext () {
  return !eventQueueEmpty()
}

export const eventQueueShift = () => {
  for (const priorityQueue of eventQueue) {
    if (priorityQueue.length) {
      return priorityQueue.shift()
    }
  }
  return null
}

export function next () {
  return eventQueueShift() || null
}

export const eventQueuePeek = () => {
  for (const priorityQueue of eventQueue) {
    if (priorityQueue.length) {
      return priorityQueue[0]
    }
  }
  return null
}

export function peekNext () {
  return eventQueuePeek() || null
}

export function eventQueuePush (event, data, priority) {
  if (eventQueue[priority]) {
    const emptyBeforePush = eventQueueEmpty()
    eventQueue[priority].push({ type: event, data })
    if (emptyBeforePush) {
      notifyOfContent()
    }
  } else {
    throw new Error(`unable to sent notification with priority ${priority}`)
  }
}

export function eventQueueWatch (callback) {
  eventContentListeners.push(callback)
}

export function eventQueueWatchOnce (callback) {
  eventContentOnce.push(callback)
}
export const PRIORITY = {
  VERY_LOW: 5,
  LOW: 4,
  MEDIUM_LOW: 3,
  MEDIUM: 2,
  MEDIUM_HIGH: 1,
  HIGH: 0,
}
