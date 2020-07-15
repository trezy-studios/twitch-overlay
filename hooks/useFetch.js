// Module imports
import { useCallback } from 'react'





// Local imports
import { useAsync } from './useAsync'





export const useFetch = (options = {}, asyncOptions = {}) => {
	const {
		url,
	} = options

	const handler = useCallback(() => fetch(url, options).then(response => response.json()), [])

	return useAsync({
		...asyncOptions,
		handler,
	})
}
