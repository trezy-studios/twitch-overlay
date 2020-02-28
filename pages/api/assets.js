// Local imports
import createEndpoint from './helpers/createEndpoint'
import httpStatus from '../../helpers/httpStatus'
import getAllFiles from 'get-all-files'
import path from 'path'

const patterns = [
  // image patterns
  '/images/*-event-icon.png',
  '/images/*-badge.png',
  '/images/avatar-placeholder-*.png',

  // static images
  '/images/badge-socket.png',
  '/images/event-background.png',
  '/images/loading-spinner.png',
  '/images/message-background.png',

  // media patterns
  '/media/*-alert.webm',
]


export const handler = async (request, response) => {
  const publicPath = path.resolve('./public')
  const assets = (await getAllFiles(publicPath, patterns.map(pattern => `**${pattern}`))).map(filepath => `/${path.relative(publicPath, filepath).replace(/\\/ug, '/')}`)
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
