// Module imports
const Logger = require('ians-logger')
const uuid = require('uuid/v4')
const WebSocket = require('ws')





// Local constants
const {
  PORT = 3001,
} = process.env
const server = new WebSocket.Server({ port: PORT })





const log = (message, meta = {}, type = 'log') => {
  Logger[type](message)

  Object.entries(meta).forEach(([key, value]) => {
    console.log(`> ${key}:`, value)
  })

  console.log('')
}

const parseMessage = message => {
  let messageType = message.split(' ')[0]

  if (message.startsWith('CAP REQ')) {
    return {
      data: message.replace(/^CAP REQ :/u, '').split(' '),
      type: 'capabilities',
    }
  }

  if (message.startsWith('PASS')) {
    return {
      data: message.replace(/^PASS /u, ''),
      type: 'token',
    }
  }

  if (message.startsWith('NICK')) {
    return {
      data: message.replace(/^NICK /u, ''),
      type: 'username',
    }
  }

  return message
}

server.on('connection', socket => {
  const socketDataStore = {
    capabilities: null,
    id: uuid(),
    isAcknowledged: false,
    token: null,
    username: null,
  }

  log('New client connected', { id: socketDataStore.id }, 'info')

  socket.on('message', message => {
    const {
      data,
      type,
    } = parseMessage(message)

    socketDataStore[type] = data

    const {
      capabilities,
      id,
      isAcknowledged,
      token,
      username,
    } = socketDataStore

    log('Message from client', {
      id,
      message,
    }, 'info')

    if (!isAcknowledged && capabilities && token && username) {
      log('Acknowledging client', { id })
      socket.send(`:tmi.twitch.tv CAP * ACK :${capabilities.join(' ')}`)
    }
  })

  setInterval(() => {
    const { id } = socketDataStore
    const timeoutID = setTimeout(() => {
      log('Client didn\'t PONG in time - terminating connection', { id }, 'error')
      socket.terminate()
    }, 1000)

    socket.on('message', message => {
      if (message === 'PONG :tmi.twitch.tv') {
        clearTimeout(timeoutID)
        log('Client responded to ping', { id }, 'info')
      }
    })

    log('Pinging client', { id }, 'info')
    socket.send('PING')
  }, (1000 * 60 * 5))
})

log(`Server started. Listening on port ${PORT}...`)
