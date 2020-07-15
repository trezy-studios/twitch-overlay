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
import { TwitchContext } from '../context/TwitchContext'





// Local constants
const BOT_NAME_BLACKLIST = [
  'PretzelRocks',
  'Moobot',
]
const CHANNEL_ID = 72632519
const FADE_DELAY = 5000
const HIDE_DELAY = 10000
const MAX_MESSAGES = 10
const NAME_COLOR_LIGHTEN_INCREMENT = 10





const TwitchChatMessage = props => {
  const {
    colorCache,
    isFromPreviousMessageSender,
    message: {
      message,
      user,
    },
    remove,
  } = props
  const {
    badges: userBadges,
    name: from,
  } = user
  let { color } = user
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

  useEffect(() => {
    setTimeout(() => {
      setShouldFade(true)
    }, FADE_DELAY)
  }, [setShouldFade])

  useEffect(() => {
    if (shouldFade) {
      setTimeout(() => {
        setShouldHide(true)
      }, HIDE_DELAY)
    }
  }, [shouldFade])

  useEffect(() => {
    if (shouldHide) {
      setTimeout(() => {
        remove()
      }, HIDE_DELAY)
    }
  }, [shouldHide])

  if (!isFromPreviousMessageSender) {
    const colorHash = `#${color.toHex()}`

    if (colorCache[colorHash]) {
      color = tinycolor(colorCache[colorHash])
    } else {
      while (!tinycolor.isReadable('#1a1a1a', color)) {
        color.lighten(NAME_COLOR_LIGHTEN_INCREMENT)
      }

      colorCache[colorHash] = `#${color.toHex()}`
    }
  }

  return (
    <animated.li style={spring}>
      <div>
        {resizeListener}

        {!isFromPreviousMessageSender && (
          <header style={{ color: `#${color.toHex()}` }}>
            {from}
            <div className="badges">
              {userBadges.map(badgeData => {
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
        )}

        <div className="body">
          {message}
        </div>
      </div>
    </animated.li>
  )
}

TwitchChatMessage.defaultProps = {
  remove: () => {},
}

TwitchChatMessage.propTypes = {
  colorCache: PropTypes.object.isRequired,
  isFromPreviousMessageSender: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  remove: PropTypes.func,
}





export { TwitchChatMessage }
