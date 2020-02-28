// Module imports
import PropTypes from 'prop-types'
import React, {
  forwardRef,
} from 'react'





const Alert = forwardRef((props, ref) => {
  const {
    type,
    username,
  } = props

  return (
    <div className="alert">
      <video
        ref={ref}
        autoPlay>
        <source
          src={`/media/${type}-alert.webm`}
          type="video/webm" />
      </video>

      {(type === 'follow') && (
        <span>
          <strong>{username}</strong>{' has followed!'}
        </span>
      )}
    </div>
  )
})

Alert.defaultProps = {
  username: null,
}

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  username: PropTypes.string,
}





export { Alert }
