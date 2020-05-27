// Module imports
import React, {
  Fragment,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'





// Local imports
import { useTwitchEvents } from '../hooks/useTwitchEvents'





// Local constants
const BOT_NAME_BLACKLIST = [
  'PretzelRocks',
  'Moobot',
]
const MESSAGE_DURATION = 10000
const NAME_COLOR_LIGHTEN_INCREMENT = 10





const TwitchChat = props => {
  const { useMockServer } = props
  const [messages, setMessages] = useState([])
  const colorCache = useRef({})
  const currentColorCache = colorCache.current

  useTwitchEvents({
    onChat: (channel, userstate, message, self) => {
      const isBot = BOT_NAME_BLACKLIST.includes(userstate['display-name'])
      const isCommand = message.startsWith('!')

      if (self || isBot || isCommand) {
        return
      }

      const messageData = {
        color: tinycolor(userstate.color),
        from: userstate['display-name'],
        message,
        id: userstate.id,
      }

      setMessages(oldMessages => ([
        ...oldMessages,
        messageData,
      ]))

      setTimeout(() => {
        setMessages(oldMessages => {
          // eslint-disable-next-line arrow-body-style
          const filteredMessages = oldMessages.filter(({ id }) => {
            return id !== messageData.id
          })

          return filteredMessages
        })
      }, MESSAGE_DURATION)
    },
    useMockServer,
  })

  return (
    <div className="twitch-chat">
      <dl>
        {messages.map((messageData, index) => {
          const {
            from,
            id,
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
            <Fragment key={id}>
              {!isFromPreviousMessageSender && (
                <dt style={{ color: `#${color.toHex()}` }}>
                  {from}
                </dt>
              )}
              <dd>{message}</dd>
            </Fragment>
          )
        })}
      </dl>
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
