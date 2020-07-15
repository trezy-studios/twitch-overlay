// Module imports
import React, {
  useCallback,
  useContext,
  useRef,
} from 'react'





// Local imports
import { TwitchChatMessage } from './TwitchChatMessage'
import { TwitchContext } from '../context/TwitchContext'





const TwitchChat = () => {
  const {
    messages,
    deleteMessage,
  } = useContext(TwitchContext)
  const colorCache = useRef({})

  const createRemover = useCallback(messageID => () => {
    deleteMessage(messageID)
  }, [deleteMessage])

  return (
    <div className="twitch-chat">
      <ol>
        {messages.map((message, index) => {
          const previousMessageSender = messages[index - 1]?.user.name
          const isFromPreviousMessageSender = (previousMessageSender === message.user.name)

          return (
            <TwitchChatMessage
              key={message.id}
              colorCache={colorCache.current}
              isFromPreviousMessageSender={isFromPreviousMessageSender}
              message={message}
              remove={createRemover(message.id)} />
          )
        })}
      </ol>
    </div>
  )
}





export { TwitchChat }
