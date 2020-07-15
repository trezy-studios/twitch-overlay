// Style imports
import '../scss/reset.scss'
import '../scss/app.scss'





// Module imports
import PropTypes from 'prop-types'
import React from 'react'





const App = ({ Component, pageProps }) => (
	<Component {...pageProps} />
)

App.propTypes = {
	Component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.node,
	]).isRequired,
	pageProps: PropTypes.object.isRequired,
}





export default App
