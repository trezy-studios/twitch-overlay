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
    <div className="alert" data-props={JSON.stringify(props)}>
      <video
        ref={ref}
        autoPlay>
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
})

Alert.defaultProps = {
  bits: '0',
  username: null,
}

Alert.propTypes = {
  bits: PropTypes.string,
  type: PropTypes.string.isRequired,
  username: PropTypes.string,
}





export { Alert }
