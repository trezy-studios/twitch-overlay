// Module imports
import React, {
	useContext,
	useEffect,
	useState,
} from 'react'
import {
	animated,
	useSpring,
} from 'react-spring'
import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'
import useResizeAware from 'react-resize-aware'





// Local imports
import { TwitchChatMessage } from './TwitchChatMessage'
import { TwitchContext } from '../context/TwitchContext'





// Local constants
const BOT_NAME_BLACKLIST = [
	'PretzelRocks',
	'Moobot',
]
const FADE_DELAY = 5000
const HIDE_DELAY = 10000
const NAME_COLOR_LIGHTEN_INCREMENT = 10





const TwitchChatMessageGroup = props => {
	const {
		colorCache,
		messages,
		remove,
		user,
	} = props
	const { badges } = useContext(TwitchContext)
	const [shouldFade, setShouldFade] = useState(false)
	const [shouldHide, setShouldHide] = useState(false)

	const [resizeListener, { height }] = useResizeAware()
	const spring = useSpring({
		from: {
			height: 0,
			opacity: 0,
		},
		to: async next => {
			let opacity = 1

			if (shouldFade) {
				opacity = 0.2
			}

			if (shouldHide) {
				opacity = 0
			}

			await next({
				height: height || 0,
				opacity,
			})
		},
	})

	let { color } = user

	let colorHash = `#${color.toHex()}`

	if (colorCache[colorHash]) {
		color = tinycolor(colorCache[colorHash])
	} else {
		while (!tinycolor.isReadable('#1a1a1a', color)) {
			color.lighten(NAME_COLOR_LIGHTEN_INCREMENT)
		}

		colorCache[colorHash] = `#${color.toHex()}`
	}

	useEffect(() => {
		setShouldFade(false)
		setShouldHide(false)
	}, [
		messages.length,
		setShouldFade,
		setShouldHide,
	])

	useEffect(() => {
		const timeoutID = setTimeout(() => {
			setShouldFade(true)
		}, FADE_DELAY)

		return () => clearTimeout(timeoutID)
	}, [
		messages.length,
		setShouldFade,
	])

	useEffect(() => {
		const timeoutIDs = []
		timeoutIDs.push(setTimeout(() => {
			setShouldHide(true)

			timeoutIDs.push(setTimeout(() => {
				remove()
			}, HIDE_DELAY))
		}, HIDE_DELAY))

		return () => timeoutIDs.forEach(clearTimeout)
	}, [,
		messages.length,
		setShouldHide,
	])

	return (
		<animated.li style={spring}>
			<div>
				{resizeListener}
				<header style={{ color: `#${color.toHex()}` }}>
					{user.name}
					<div className="badges">
						{user.badges.map(badgeData => {
							const [badge, version] = badgeData.split('/')
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

				<ol>
					{messages.map(message => (
						<li key={message.id}>
							<TwitchChatMessage
								showSender
								colorCache={colorCache.current}
								message={message} />
						</li>
					))}
				</ol>
			</div>
		</animated.li>
	)
}

TwitchChatMessageGroup.defaultProps = {
	remove: () => {},
}

TwitchChatMessageGroup.propTypes = {
	colorCache: PropTypes.object.isRequired,
	messages: PropTypes.array.isRequired,
	remove: PropTypes.func,
}





export { TwitchChatMessageGroup }
