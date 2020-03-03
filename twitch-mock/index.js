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
  let messageType = message.split(':')[0].trim()

  if (messageType === 'CAP REQ') {
    return {
      command: messageType,
      data: message.replace(/^CAP REQ :/u, '').split(' '),
      type: 'capabilities',
    }
  }

  if (message.startsWith('PASS')) {
    return {
      command: messageType,
      data: message.replace(/^PASS /u, ''),
      type: 'token',
    }
  }

  if (message.startsWith('NICK')) {
    return {
      command: messageType,
      data: message.replace(/^NICK /u, ''),
      type: 'username',
    }
  }

  return {
    command: messageType,
    message,
    type: 'unknown',
  }
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
    const { id } = socketDataStore
    const {
      command,
      data,
      type,
    } = parseMessage(message)

    log('Message from client', {
      id,
      message,
    }, 'info')

    if (type === 'unknown') {
      socket.send(`:tmi.twitch.tv 421 <${socketDataStore.username}> ${command} :Unknown command`)
    } else {
      socketDataStore[type] = data

      const {
        capabilities,
        isAcknowledged,
        token,
        username,
      } = socketDataStore

      if (!isAcknowledged && capabilities && token && username) {
        log('Acknowledging client', { id })
        socket.send(`:tmi.twitch.tv CAP * ACK :${capabilities.join(' ')}`)
      }
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
