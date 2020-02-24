/* eslint-disable */
// Style imports
import '../scss/reset.scss'
import '../scss/legacy.scss'





// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import TwitchJs from 'twitch-js'





// Local imports
import Events from '../components/Events'





const blocklist = [
  'moobot',
  'pretzelrocks',
]
let mostRecentTiltifyDonationID = null
let mostRecentTiltifyDonationTimestamp = null
const eventsContainer = [
  // {
  //   id: faker.random.uuid(),
  //   bits: 100,
  //   type: 'bits',
  //   displayName: 'Bob',
  // },
  // {
  //   hostType: 'AUTO',
  //   id: faker.random.uuid(),
  //   type: 'host',
  //   displayName: 'Bob',
  // },
  // {
  //   hostType: 'WITH_VIEWERS',
  //   id: faker.random.uuid(),
  //   type: 'host',
  //   displayName: 'Bob',
  //   viewers: 100,
  // },
  // {
  //   hostType: 'WITHOUT_VIEWERS',
  //   id: faker.random.uuid(),
  //   type: 'host',
  //   displayName: 'Bob',
  // },
  // {
  //   displayName: 'Bob',
  //   id: faker.random.uuid(),
  //   type: 'raid',
  //   viewers: 100,
  // },
]
const messagesContainer = []

let twitchAPI = null
let twitchChat = null
let twitchClient = null
let queryParams = null

if (typeof window !== 'undefined') {
  queryParams = (location.search || '').replace(/^\?/, '').split('&').reduce((accumulator, pair) => {
    const [key, value] = pair.split('=')

    accumulator[key] = value

    return accumulator
  }, {
    channel: localStorage.getItem('channel'),
    tiltify_access_token: localStorage.getItem('tiltify_access_token'),
    twitch_access_token: localStorage.getItem('twitch_access_token'),
  })

  const {
    api,
    chat,
  } = twitchClient = new TwitchJs({
    token: queryParams.twitch_access_token,
    username: 'TrezyCodes',
  })
  twitchAPI = api
  twitchChat = chat
}





const Chat = props => {
  const {
    isConnected,
    isJoined,
    messages,
  } = props

  return (
    <ol
      className="chat"
      data-loading={!isConnected || !isJoined}>
      <div className="connected-message">
        <span>Connected!</span>
      </div>

      <div className="loading-message">
        <div className="loading-spinner" />

        <span>Loading...</span>
      </div>

      {messages.map(({ avatar, body, id, badges, displayName }) => (
        <li
          className="message-wrapper"
          data-broadcaster={badges.broadcaster}
          data-moderator={badges.moderator}
          key={`${displayName}+${id}`}>
          <div className="message">
            <div
              className="avatar"
              style={{ backgroundImage: `url(https://trezy.sh/avatar-placeholder-${avatar}.png)` }}/>

            <h2>@{displayName}</h2>

            <p>{body}</p>
          </div>

          <ul className="badges">
            {Object.entries(badges).map(([badge, value]) => {
              let badgeName = badge

              if (typeof value !== 'boolean') {
                badgeName += `${-value}`
              }

              return (
                <li
                  className={`badge ${badgeName}`}
                  key={badgeName} />
              )
            })}
          </ul>
        </li>
      ))}

      <li className="empty-message">
        No messages yet.
      </li>
    </ol>
  )
}





const Home = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const [isConnected, setIsConnected] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [events, setEvents] = useState(eventsContainer)
  const [messages, setMessages] = useState(messagesContainer)

  const addEvent = event => {
    eventsContainer.push(event)
    setEvents([...eventsContainer])
  }

  const handleBits = message => {
    const {
      bits,
      event,
      tags: { displayName },
    } = message

    addEvent({
      id: performance.now(),
      bits,
      type: 'bits',
      displayName,
    })
  }

  const handleCLEARCHAT = message => {
    const {
      event,
      username,
    } = message

    if (event === 'USER_BANNED') {
      messagesContainer = messagesContainer.filter(message => message.username !== username)
      setMessages([...messagesContainer])
      console.log(`Removed messages from ${username}`)
    }
  }

  const handleHost = message => {
    const {
      event,
      numberOfViewers,
      tags: { displayName },
    } = message

    addEvent({
      hostType: event.split('/')[1],
      id: performance.now(),
      viewers: numberOfViewers,
      type: 'host',
      displayName,
    })
  }

  const handleMessage = message => {
    const {
      message: body,
      tags: {
        badges,
        displayName,
        id: userID,
        username,
      },
    } = message

    if (!blocklist.includes(displayName.toLowerCase())) {
      messagesContainer.push({
        avatar: Math.ceil(Math.random() * 6),
        badges,
        body,
        displayName,
        id: performance.now(),
        userID,
        username,
      })

      setMessages([...messagesContainer])
    }
  }

  const handlePRIVMSG = message => {
    switch (event) {
      case 'CHEER':
        handleBits(message)
        break

      case 'HOSTED/WITH_VIEWERS':
      case 'HOSTED/WITHOUT_VIEWERS':
      case 'HOSTED/AUTO':
        handleHost(message)
        break

      default:
        handleMessage(message)
    }
  }

  const handleRaid = message => {
    const {
      parameters: {
        displayName,
        viewerCount: viewers,
      },
    } = message

    addEvent({
      displayName,
      type: 'raid',
      viewers,
    })
  }

  const handleResubscription = message => {
    console.log('handleResubscription', message)
    const {
      parameters: { cumulativeMonths: months },
      tags: { displayName },
    } = message

    addEvent({
      displayName,
      type: 'resubscription',
      months,
    })
  }

  const handleSubscription = message => {
    console.log('handleSubscription', message)
    const {
      tags: { displayName },
    } = message

    addEvent({
      displayName,
      type: 'subscription',
    })
  }

  const handleUSERNOTICE = message => {
    switch (message.event) {
      case 'RAID':
        handleRaid(message)
        break

      case 'RESUBSCRIPTION':
        handleResubscription(message)
        break

      case 'SUBSCRIPTION':
        handleSubscription(message)
        break

      default:
        console.log('Unhandled USERNOTICE:', message)
    }
  }

  // Connect to Twitch IRC servers
  useEffect(() => {
    (async () => {
      await twitchChat.connect()
      setIsConnected(true)
    })()
  }, [])

  // Join the chat channel
  useEffect(() => {
    if (isConnected) {
      (async () => {
        try {
          await twitchChat.join(`#${queryParams.channel.toLowerCase()}`)
          setIsJoined(true)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [isConnected])

  // Set up chat and events
  useEffect(() => {
    if (isConnected && isJoined) {
      twitchChat.on('*', message => {
        const {
          command,
          event,
        } = message

        switch (command) {
          case 'PRIVMSG':
            handlePRIVMSG(message)
            break

          case 'USERNOTICE':
            handleUSERNOTICE(message)
            break

          case 'CLEARCHAT':
            handleCLEARCHAT(message)
            break

          default:
            console.log('unhandled event', message)
        }
      })
    }
  }, [isConnected, isJoined])

  // Set up Tiltify polling
  useEffect(() => {
    let shouldContinue = true

    const getDonations = async () => {
      let donationsURL = `https://tiltify.com/api/v3/campaigns/38994/donations`

      if (mostRecentTiltifyDonationID) {
        donationsURL += `?after=${mostRecentTiltifyDonationID}`
      }

      const response = await fetch(donationsURL, {
        headers: { Authorization: `Bearer ${queryParams.tiltify_access_token}` },
      })

      const { data } = await response.json()

      data.sort((a, b) => {
        if (a.completedAt > b.completedAt) {
          return 1
        }

        if (a.completedAt < b.completedAt) {
          return -1
        }

        return 0
      })

      data.forEach(donation => {
        const {
          amount,
          comment,
          completedAt,
          id,
          name,
        } = donation

        if (!mostRecentTiltifyDonationTimestamp || completedAt > mostRecentTiltifyDonationTimestamp) {
          mostRecentTiltifyDonationID = id
          mostRecentTiltifyDonationTimestamp = completedAt
        }

        addEvent({
          amount,
          comment,
          name,
          type: 'tiltify-donation',
        })
      })

      if (shouldContinue) {
        setTimeout(getDonations, 5000)
      }
    }

    getDonations()

    return () => {
      shouldContinue = false
    }
  })

  return (
    <div className="overlay">
      <div className="screenshare">
        <div className="pixel-crest" />

        <h1>Privacy, please.</h1>
      </div>

      <div className="camera" />

      <Events events={events} />

      <Chat
        isConnected={isConnected}
        isJoined={isJoined}
        messages={messages} />

      <div className="vertical-bar" />
      <div className="horizontal-bar" />
    </div>
  )
}





export default Home
