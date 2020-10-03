// Module imports
import React, {
	useCallback,
	useContext,
	useRef,
} from 'react'





// Local imports
import { TwitchChatMessageGroup } from './TwitchChatMessageGroup'
import { TwitchContext } from '../context/TwitchContext'





const TwitchChat = () => {
	const {
		messageGroups,
		deleteMessageGroup,
	} = useContext(TwitchContext)
	const colorCache = useRef({})

	const createRemover = useCallback(messageGroupID => () => {
		deleteMessageGroup(messageGroupID)
	}, [deleteMessageGroup])

	return (
		<div className="twitch-chat">
			<ol>
				{messageGroups.map(messageGroup => (
					<TwitchChatMessageGroup
						key={messageGroup.id}
						colorCache={colorCache.current}
						remove={createRemover(messageGroup.id)}
						{...messageGroup} />
				))}
			</ol>
		</div>
	)
}





export { TwitchChat }
