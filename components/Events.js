// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import BitsEvent from './BitsEvent'
import HostEvent from './HostEvent'
import RaidEvent from './RaidEvent'
import ResubscriptionEvent from './ResubscriptionEvent'
import SubscriptionEvent from './SubscriptionEvent'
import TiltifyDonationEvent from './TiltifyDonationEvent'





const Events = props => {
  const { events } = props

  return (
    <ol className="events">
      {events.map(event => {
        if (event.type === 'bits') {
          return (
            <BitsEvent
              key={event.id}
              {...event} />
          )
        }

        if (event.type === 'host') {
          return (
            <HostEvent
              key={event.id}
              {...event} />
          )
        }

        if (event.type === 'raid') {
          return (
            <RaidEvent
              key={event.id}
              {...event} />
          )
        }

        if (event.type === 'resubscription') {
          return (
            <ResubscriptionEvent
              key={event.id}
              {...event} />
          )
        }

        if (event.type === 'subscription') {
          return (
            <SubscriptionEvent
              key={event.id}
              {...event} />
          )
        }

        if (event.type === 'tiltify-donation') {
          console.log('event', event)
          return (
            <TiltifyDonationEvent
              key={event.id}
              {...event} />
          )
        }

        return null
      })}
    </ol>
  )
}

Events.propTypes = {
  events: PropTypes.array.isRequired,
}





export default Events
