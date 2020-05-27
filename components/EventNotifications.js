// Module imports
import React, {
  useContext,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import {
  eventQueuePush,
  hasNext,
  PRIORITY,
} from './event-system/queue'
import { EventHistoryContext } from '../context/EventHistoryContext'
import { BitsAlert } from './BitsAlert'
import { RaidAlert } from './RaidAlert'
import { ResubscriptionAlert } from './ResubscriptionAlert'
import { SubscriptionAlert } from './SubscriptionAlert'
import { useTwitchEvents } from '../hooks/useTwitchEvents'
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





const EventNotifications = props => {
  const { useMockServer } = props

  useTwitchEvents({
    onCheer: (channel, userstate) => {
      const bits = Number(userstate.bits)

      eventQueuePush('bits', {
        duration: 5000,
        data: {
          bits,
          type: 'bits',
          username: userstate.username,
        },
      }, PRIORITY.MEDIUM_LOW)
    },
    onRaid: (channel, username, viewers) => {
      eventQueuePush('raid', {
        duration: 5000,
        data: {
          type: 'raid',
          username,
          viewers,
        },
      }, PRIORITY.MEDIUM_LOW)
    },
    // eslint-disable-next-line max-params
    onResub: (channel, username, months, message, userstate, method) => {
      eventQueuePush('resubscription', {
        duration: 5000,
        data: {
          months,
          plan: method.plan,
          planName: method.planName,
          type: 'resubscription',
          username,
        },
      }, PRIORITY.MEDIUM_LOW)
    },
    onSub: (channel, username, method) => {
      eventQueuePush('subscription', {
        duration: 5000,
        data: {
          plan: method.plan,
          planName: method.planName,
          type: 'subscription',
          username,
        },
      }, PRIORITY.MEDIUM_LOW)
    },
    useMockServer,
  })

  return (
    <div className="event-notifications">
      <EventHost />
    </div>
  )
}

EventNotifications.defaultProps = {
  useMockServer: false,
}

EventNotifications.propTypes = {
  useMockServer: PropTypes.bool,
}





export { EventNotifications }
