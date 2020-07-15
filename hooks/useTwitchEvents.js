/* eslint-env node */

// Module imports
import { useEffect } from 'react'
import tmi from 'tmi.js'





// Local constants
const twitchClients = {
	mock: {
		client: null,
		connectionCount: 0,
	},
	real: {
		client: null,
		connectionCount: 0,
	},
}
const tmiOptions = {
	channels: [
		process.env.TWITCH_CHANNEL,
	],
	identity: {
		password: process.env.TWITCH_ACCESS_TOKEN,
		username: process.env.TWITCH_USERNAME,
	},
	options: {
		debug: true,
	},
}





export const useTwitchEvents = (options, dependencies = []) => {
	const {
		onChat,
		onCheer,
		onRaid,
		onResub,
		onSub,
		useMockServer,
	} = options

	let twitchConnection = twitchClients.real

	if (useMockServer) {
		tmiOptions.connection = { server: 'irc.fdgt.dev' }
		twitchConnection = twitchClients.mock
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			console.log(twitchConnection.client)
			if (!twitchConnection.client) {
				twitchConnection.client = new tmi.Client(tmiOptions)

				if (useMockServer) {
					window.twitchClient = twitchConnection.client
				}

				twitchConnection.client.connect()
			}

			const twitchClient = twitchConnection.client
			window.twitchClient = twitchConnection.client

			if (onChat) {
				twitchClient.on('chat', onChat)
			}

			if (onCheer) {
				twitchClient.on('cheer', onCheer)
			}

			if (onRaid) {
				twitchClient.on('raided', onRaid)
			}

			if (onResub) {
				twitchClient.on('resub', onResub)
			}

			if (onSub) {
				twitchClient.on('subscription', onSub)
			}

			twitchConnection.connectionCount += 1

			return () => {
				twitchConnection.connectionCount -= 1

				if (onChat) {
					twitchClient.removeListener('chat', onChat)
				}

				if (onCheer) {
					twitchClient.removeListener('cheer', onCheer)
				}

				if (onRaid) {
					twitchClient.removeListener('raided', onRaid)
				}

				if (onResub) {
					twitchClient.removeListener('resub', onResub)
				}

				if (onSub) {
					twitchClient.removeListener('subscription', onSub)
				}

				if (twitchConnection.connectionCount === 0) {
					twitchClient.disconnect()
				}
			}
		}

		return () => {}
	}, dependencies)
}
