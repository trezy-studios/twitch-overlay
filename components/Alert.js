// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const Alert = props => {
  const {
    children,
    onEnded,
    type,
  } = props

  return (
    <div className="alert">
      <video
        autoPlay
        onEnded={onEnded}>
        <source
          src={`public/media/${type}-alert.webm`}
          type="video/webm" />
        <source
          src="/media/follow-alert.webm"
          type="video/webm" />
      </video>

      {children}
    </div>
  )
}

Alert.defaultProps = {
  onEnded: () => {},
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  onEnded: PropTypes.func,
  type: PropTypes.string.isRequired,
}





export { Alert }
