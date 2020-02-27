/* eslint-disable react/jsx-no-bind */
import React from 'react'
import EventHost from './event-system/EventHost'
import SubscriptionEvent from './SubscriptionEvent'
import ResubscriptionEvent from './ResubscriptionEvent'
import BitsEvent from './BitsEvent'
import HostEvent from './HostEvent'
import RaidEvent from './RaidEvent'
import TiltifyDonationEvent from './TiltifyDonationEvent'

EventHost.register('subscription', SubscriptionEvent)
EventHost.register('resubscription', ResubscriptionEvent)
EventHost.register('bits', BitsEvent)
EventHost.register('host', HostEvent)
EventHost.register('raid', RaidEvent)
EventHost.register('tiltify-donation', TiltifyDonationEvent)

export const EventNotifications = () => (
  <div className="event-notifications">
    <EventHost />
  </div>
)
