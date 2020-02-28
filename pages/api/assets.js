// Local imports
import createEndpoint from './helpers/createEndpoint'
import httpStatus from '../../helpers/httpStatus'





export const handler = (request, response) => {
  const assets = []

  response.status(httpStatus.OK).json({
    data: assets,
    meta: {
      total: assets.length,
    },
  })
}





export default createEndpoint({
  allowedMethods: ['get'],
  handler,
})
