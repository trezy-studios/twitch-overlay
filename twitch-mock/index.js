// Module imports
const Logger = require('ians-logger')
const uuid = require('uuid/v4')
const WebSocket = require('ws')





// Local constants
const {
  PORT = 3001,
} = process.env
const channels = {}
const server = new WebSocket.Server({ port: PORT })





const log = (message, meta = {}, type = 'log') => {
  Logger[type](message)

  Object.entries(meta).forEach(([key, value]) => {
    console.log(`> ${key}:`, value)
  })

  console.log('')
}

const parseMessage = (message, socketDataStore) => {
  const {
    username,
  } = socketDataStore
  let command = message.split(':')[0].trim()

  if (command === 'CAP REQ') {
    return {
      command,
      data: message.replace(/^CAP REQ :/u, '').split(' '),
      set: true,
      type: 'capabilities',
    }
  }

  if (message.startsWith('JOIN')) {
    const channel = message.replace(/^JOIN /u, '').trim().replace(/^#/u, '')

    if (!channels[channel]) {
      channels[channel] = {
        users: [],
      }
    }

    channels[channel].users.push(username)

    return {
      command,
      response: `:${username}!${username}@${username}.tmi.twitch.tv JOIN #${channel}`,
      type: 'channels',
    }
  }

  if (message.startsWith('NICK')) {
    return {
      command,
      data: message.replace(/^NICK /u, ''),
      set: true,
      type: 'username',
    }
  }

  if (message.startsWith('PASS')) {
    return {
      command,
      data: message.replace(/^PASS /u, ''),
      set: true,
      type: 'token',
    }
  }

  return {
    command,
    message,
    response: `:tmi.twitch.tv 421 ${username} ${command} :Unknown command`,
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
      response = false,
      set = false,
      type,
    } = parseMessage(message, socketDataStore)

    log('Message from client', {
      id,
      message,
    }, 'info')

    if (response) {
      socket.send(response)
    }

    if (set) {
      socketDataStore[type] = data
    }

    if (!socketDataStore.isAcknowledged) {
      const {
        capabilities,
        token,
        username,
      } = socketDataStore

      if (capabilities && token && username) {
        log('Acknowledging client', { id })
        socket.send(`:tmi.twitch.tv CAP * ACK :${capabilities.join(' ')}`)
        socketDataStore.isAcknowledged = true
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
