/* eslint-disable react/jsx-no-bind */
import React from 'react'
import EventHost from './event-system/EventHost'
// import SubscriptionEvent from './SubscriptionEvent'
// import HostEvent from './HostEvent'
// import RaidEvent from './RaidEvent'
// import TiltifyDonationEvent from './TiltifyDonationEvent'
import { Alert } from './Alert'

// EventHost.register('subscription', SubscriptionEvent)
// EventHost.register('resubscription', React.forwardRef((props, ref) => <Alert ref={ref} type="resubscription" username={JSON.stringify(props)} />))
// eslint-disable-next-line react/prop-types
EventHost.register('bits', props => (<Alert bits={props.data.userstate.bits} next={props.next} type="bits" username={props.data.userstate['display-name']} />))
// EventHost.register('host', HostEvent)
// EventHost.register('raid', RaidEvent)
// EventHost.register('tiltify-donation', TiltifyDonationEvent)

export const EventNotifications = () => (
  <div className="event-notifications">
    <EventHost />
  </div>
)
