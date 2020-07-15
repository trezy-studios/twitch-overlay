/* eslint-env node */
// Module imports
import React, {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { parse as parseIRCMessage } from 'irc-message'
import moment from 'moment'
import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'





// Local imports
import { useFetch } from '../hooks/useFetch'





// Local constants
const TwitchContext = React.createContext({
	badges: {},
	deleteMessage: () => {},
	events: [],
	isConnecting: false,
	isConnected: false,
	messages: [],
})





// Local variables
let socket = null





const TwitchContextProvider = props => {
	const { children } = props
	const [events, setEvents] = useState([])
	const [messages, setMessages] = useState([])
	const [isConnecting, setIsConnecting] = useState(true)
	const [isConnected, setIsConnected] = useState(false)

	const addEvent = useCallback(event => {
		setEvents(oldEvents => ([
			...oldEvents,
			event,
		]))
	}, [setEvents])

	const addMessage = useCallback(message => {
		setMessages(oldMessages => ([
			...oldMessages,
			message,
		]))
	}, [setMessages])

	const deleteMessage = useCallback(messageID => {
		setMessages(oldMessages => oldMessages.filter(({ id }) => (id !== messageID)))
	}, [setMessages])

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
	}, [addEvent])

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
			id: tags.id,
			message,
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
		deleteMessage,
		events,
		isConnecting,
		isConnected,
		messages,
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
