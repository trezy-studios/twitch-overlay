// Module imports
import PropTypes from 'prop-types'
import React from 'react'
import { hasNext } from './event-system/queue'





const Alert = props => {
  const {
    type,
    username,
  } = props
  const _handleNext = ({ target }) => {
    if (hasNext()) {
      target.play()
    }
    props.next()
  }
  return (
    <div className="alert" data-props={JSON.stringify(props)}>
      <video
        autoPlay
        // eslint-disable-next-line react/jsx-no-bind
        onEnded={_handleNext}>
        <source
          src={`public/media/${type}-alert.webm`}
          type="video/webm" />
        <source
          src="/media/follow-alert.webm"
          type="video/webm" />
      </video>

      {(type === 'follow') && (
        <span>
          <strong>{username}</strong>{' has followed!'}
        </span>
      )}
      {(type === 'bits') && (
        <span>
          <strong>{username}</strong>{' has cheered '}<strong>{props.bits}</strong>{`${props.bits === '1' ? 'bit' : 'bits'}!`}
        </span>
      )}
    </div>
  )
}

Alert.defaultProps = {
  bits: '0',
  username: null,
}

Alert.propTypes = {
  bits: PropTypes.string,
  next: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  username: PropTypes.string,
}





export { Alert }
