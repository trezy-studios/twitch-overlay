// Module imports
import React, {
  useContext,
} from 'react'





// Local imports
import { EventHistoryContext } from '../context/EventHistoryContext'
import { BitsAlert } from './BitsAlert'
import { RaidAlert } from './RaidAlert'
import { ResubscriptionAlert } from './ResubscriptionAlert'
import { SubscriptionAlert } from './SubscriptionAlert'
import { hasNext } from './event-system/queue'
import EventHost from './event-system/EventHost'





// eslint-disable-next-line react/prop-types
EventHost.register('bits', props => {
  const {
    data,
    next,
  } = props
  const { addEvent } = useContext(EventHistoryContext)

  const handleNext = ({ target }) => {
    if (hasNext()) {
      target.play()
    }

    addEvent(data)
    next()
  }

  return (
    <BitsAlert
      bits={data.bits}
      username={data.username}
      onEnded={handleNext} />
  )
})

EventHost.register('raid', props => {
  const {
    data,
    next,
  } = props
  const { addEvent } = useContext(EventHistoryContext)

  const handleNext = ({ target }) => {
    if (hasNext()) {
      target.play()
    }

    addEvent(data)
    next()
  }

  return (
    <RaidAlert
      username={data.username}
      viewers={data.viewers}
      onEnded={handleNext} />
  )
})

EventHost.register('resubscription', props => {
  const {
    data,
    next,
  } = props
  const { addEvent } = useContext(EventHistoryContext)

  const handleNext = ({ target }) => {
    if (hasNext()) {
      target.play()
    }

    addEvent(data)
    next()
  }

  return (
    <ResubscriptionAlert
      months={data.months}
      plan={data.plan}
      planName={data.planName}
      username={data.username}
      onEnded={handleNext} />
  )
})

EventHost.register('subscription', props => {
  const {
    data,
    next,
  } = props
  const { addEvent } = useContext(EventHistoryContext)

  const handleNext = ({ target }) => {
    if (hasNext()) {
      target.play()
    }

    addEvent(data)
    next()
  }

  return (
    <SubscriptionAlert
      plan={data.plan}
      planName={data.planName}
      username={data.username}
      onEnded={handleNext} />
  )
})





export const EventNotifications = () => (
  <div className="event-notifications">
    <EventHost />
  </div>
)
