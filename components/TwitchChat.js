// Module imports
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  animated,
  useTransition,
} from 'react-spring'
import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'





// Local imports
import { useTwitchEvents } from '../hooks/useTwitchEvents'





// Local constants
const BOT_NAME_BLACKLIST = [
  'PretzelRocks',
  'Moobot',
]
const CHANNEL_ID = 72632519
const MAX_MESSAGES = 10
const NAME_COLOR_LIGHTEN_INCREMENT = 10





const TwitchChat = props => {
  const { useMockServer } = props
  const [badges, setBadges] = useState(null)
  const [messages, setMessages] = useState([])
  const colorCache = useRef({})
  const currentColorCache = colorCache.current
  const transitions = useTransition(messages, message => message.id, {
    from: {
      opacity: '0',
      transform: 'translateY(100%)',
    },
    enter: {
      opacity: '1',
      transform: 'translateY(0)',
    },
  })

  useEffect(() => {
    (async () => {
      const responses = await Promise.all([
        fetch('https://badges.twitch.tv/v1/badges/global/display'),
        fetch(`https://badges.twitch.tv/v1/badges/channels/${CHANNEL_ID}/display`),
      ])
      const [
        globalBadges,
        channelBadges,
      ] = await Promise.all(responses.map(response => response.json()))
      setBadges({
        ...globalBadges.badge_sets,
        ...channelBadges.badge_sets,
      })
    })()
  }, [])

  useTwitchEvents({
    onChat: (channel, userstate, message, self) => {
      const isBot = BOT_NAME_BLACKLIST.includes(userstate['display-name'])
      const isCommand = message.startsWith('!')

      if (self || isBot || isCommand) {
        return
      }

      const messageData = {
        badges: userstate.badges,
        color: tinycolor(userstate.color),
        from: userstate['display-name'],
        message,
        id: userstate.id,
      }

      setMessages(oldMessages => ([
        ...oldMessages,
        messageData,
      ].slice(-MAX_MESSAGES)))
    },
    useMockServer,
  })

  return (
    <div className="twitch-chat">
      <ol>
        {transitions.map((transitionData, index) => {
          const {
            item: messageData,
            key: messageKey,
            props: messageProps,
          } = transitionData
          const {
            badges: userBadges,
            from,
            message,
          } = messageData
          const previousMessageSender = messages[index - 1]?.from
          const isFromPreviousMessageSender = (previousMessageSender === from)
          let { color } = messageData

          if (!isFromPreviousMessageSender) {
            const colorHash = `#${color.toHex()}`

            if (currentColorCache[colorHash]) {
              color = tinycolor(currentColorCache[colorHash])
            } else {
              while (!tinycolor.isReadable('#1a1a1a', color)) {
                color.lighten(NAME_COLOR_LIGHTEN_INCREMENT)
              }

              currentColorCache[colorHash] = `#${color.toHex()}`
            }
          }

          return (
            <animated.li
              key={messageKey}
              style={messageProps}>
              {!isFromPreviousMessageSender && (
                <header style={{ color: `#${color.toHex()}` }}>
                  {from}
                  <div className="badges">
                    {Boolean(userBadges) && Object.entries(userBadges).map(([badge, version]) => {
                      const badgeURL = badges[badge].versions[version]

                      if (!badgeURL) {
                        return null
                      }

                      return (
                        <div
                          key={badge}
                          className="socket">
                          <div
                            className="badge"
                            style={{
                              backgroundImage: `url('${badges[badge].versions[version].image_url_1x}')`,
                            }} />
                        </div>
                      )
                    })}
                  </div>
                </header>
              )}

              <div className="body">
                {message}
              </div>
            </animated.li>
          )
        })}
      </ol>
    </div>
  )
}

TwitchChat.defaultProps = {
  useMockServer: false,
}

TwitchChat.propTypes = {
  useMockServer: PropTypes.bool,
}





export { TwitchChat }
