/* eslint-env node */
// Module imports
import React, {
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import { parse as parseIRCMessage } from 'irc-message'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'





// Local imports
import { EventQueueContext } from 'context/EventQueueContext'
import { useFetch } from 'hooks/useFetch'





// Local constants
const MAX_MESSAGE_GROUP_SIZE = 5
const TwitchContext = React.createContext({
	badges: {},
	deleteMessageGroup: () => {},
	isConnecting: false,
	isConnected: false,
	messageGroups: [],
})





// Local variables
let socket = null





const TwitchContextProvider = props => {
	const { children } = props
	const [messageGroups, setMessageGroups] = useState([])
	const [isConnecting, setIsConnecting] = useState(true)
	const [isConnected, setIsConnected] = useState(false)
	const { addEvent } = useContext(EventQueueContext)

	const addMessage = useCallback(message => {
		setMessageGroups(oldMessageGroups => {
			const lastMessageGroup = oldMessageGroups[oldMessageGroups.length - 1]
			const userOwnsLastMessageGroup = lastMessageGroup?.user.name === message.user.name
			const lastMessageGroupIsFull = lastMessageGroup?.messages.length >= MAX_MESSAGE_GROUP_SIZE
			const newMessageGroups = [...oldMessageGroups]

			if (!userOwnsLastMessageGroup || lastMessageGroupIsFull) {
				newMessageGroups.push({
					id: uuid(),
					user: message.user,
					messages: [message],
				})
			} else {
				lastMessageGroup.messages.push(message)
				lastMessageGroup.user = message.user
			}

			return newMessageGroups
		})
	}, [setMessageGroups])

	const deleteMessageGroup = useCallback(messageGroupID => {
		setMessageGroups(oldMessageGroups => oldMessageGroups.filter(({ id }) => (id !== messageGroupID)))
	}, [setMessageGroups])

	const handlePRIVMSG = useCallback(parsedMessage => {
		const {
			params: [, message],
			prefix,
			tags,
		} = parsedMessage
		const isFromSelf = prefix.replace(/\w+?!(\w+?)@\w+?\.tmi\.twitch\.tv/u, '$1') === 'TrezyCodes'
		const timestamp = isFromSelf ? undefined : parseInt(tags['tmi-sent-ts'], 10)

		let badges = []

		if (typeof tags.badges === 'string') {
			badges = tags.badges.split(',')
		}

		addMessage({
			id: tags.id,
			message,
			timestamp: moment(timestamp),
			user: {
				badges,
				color: tinycolor(tags.color),
				name: tags['display-name'],
			},
		})
	}, [addMessage])

	const handleUSERNOTICE = useCallback(parsedMessage => {
		const {
			params: [, message],
			tags,
		} = parsedMessage

		let badges = []

		if (typeof tags.badges === 'string') {
			badges = tags.badges.split(',')
		}

		addEvent({
			details: {
				name: tags['msg-param-sub-plan-name'],
				plan: tags['msg-param-sub-plan'],
			},
			id: tags.id || uuid(),
			message,
			parsedMessage,
			timestamp: moment(parseInt(tags['tmi-sent-ts'], 10)),
			type: tags['msg-id'],
			user: {
				badges,
				color: tinycolor(tags.color),
				name: tags['display-name'],
			},
		})
	}, [addEvent])

	const handleSocketMessage = useCallback(({ data }) => {
		const parsedMessage = parseIRCMessage(data)

		switch (parsedMessage.command) {
		case '376':
			setIsConnected(true)
			setIsConnecting(false)
			break

		case 'PRIVMSG':
			handlePRIVMSG(parsedMessage)
			break

		case 'PING':
			socket.send('PONG')
			break

		case 'USERNOTICE':
			handleUSERNOTICE(parsedMessage)
			break

		default:
		}
	}, [
		handlePRIVMSG,
		handleUSERNOTICE,
		setIsConnected,
		setIsConnecting,
	])

	const handleSocketClose = useCallback(() => {
		setIsConnected(false)
	}, [setIsConnected])

	const handleSocketOpen = useCallback(() => {
		socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership')
		socket.send('PASS oauth:definitely-a-token')
		socket.send('NICK justinfan12345')
		socket.send('JOIN #trezycodes')

		function blep() {
			setTimeout(() => {
				const messages = [
					// 'PRIVMSG trezycodes :extendsub',
					// 'PRIVMSG trezycodes :giftpaidupgrade',
					// 'PRIVMSG trezycodes :primepaidupgrade',
					'PRIVMSG trezycodes :raid',
					// 'PRIVMSG trezycodes :resubscription',
					// 'PRIVMSG trezycodes :subgift',
					'PRIVMSG trezycodes :subscription',
					`PRIVMSG trezycodes :bits --bitscount ${parseInt(Math.random() * 1000, 10)}`
				]
				socket.send(messages[Math.floor(Math.random() * messages.length)])
				blep()
			}, Math.random() * 10000)
		}

		blep()

		setIsConnecting(false)
		setIsConnected(true)
	}, [
		setIsConnecting,
		setIsConnected,
	])

	const { value: globalBadges } = useFetch({ url: 'https://badges.twitch.tv/v1/badges/global/display' })
	const { value: channelBadges } = useFetch({ url: `https://badges.twitch.tv/v1/badges/channels/${process.env.NEXT_PUBLIC_TWITCH_CHANNEL_ID}/display` })

	const badges = {
		...(globalBadges || {}).badge_sets,
		...(channelBadges || {}).badge_sets,
	}

	useEffect(() => {
		socket = new WebSocket(process.env.NEXT_PUBLIC_TWITCH_CHAT_WEBSOCKET_URL)
		socket.onclose = handleSocketClose
		socket.onmessage = handleSocketMessage
		socket.onopen = handleSocketOpen

		return () => socket.close()
	}, [])

	const providerValue = {
		badges,
		deleteMessageGroup,
		isConnecting,
		isConnected,
		messageGroups,
	}

	return (
		<TwitchContext.Provider value={providerValue}>
			{children}
		</TwitchContext.Provider>
	)
}

TwitchContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export {
	TwitchContext,
	TwitchContextProvider,
}
