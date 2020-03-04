// Module imports
const faker = require('faker')
const Logger = require('ians-logger')
const uuid = require('uuid/v4')
const WebSocket = require('ws')





// Local constants
const {
  PORT = 3001,
} = process.env
const channels = {}
const HOST = 'tmi.twitch.tv'
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
      response: [
        `:${username}!${username}@${username}.${HOST} JOIN #${channel}`,
        `:${username}.${HOST} 353 ${username} = #${channel} :${username}`,
        `:${username}.${HOST} 366 ${channels[channel].users.join(' ')} #${channel} :End of /NAMES list`,
        `@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=72632519;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #${channel}`,
      ].join('\r\n'),
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

  if (message.startsWith('PONG')) {
    clearTimeout(socketDataStore.pongTimeoutID)

    return {
      command: 'PONG',
      type: 'pong',
    }
  }

  if (message.startsWith('PRIVMSG')) {
    const [, channel, data] = /^PRIVMSG #(\w+) :(.*)$/u.exec(message)
    const username = faker.internet.userName()
    let response = null

    if (data.startsWith('bits')) {
      response = `@badge-info=subscriber/14;badges=broadcaster/1,subscriber/0,premium/1;color=#0092C7;display-name=${username};emotes=;flags=;id=${uuid()};mod=0;room-id=72632519;subscriber=1;tmi-sent-ts=${Date.now()};turbo=0;user-id=${uuid()};bits=100;user-type= :${username}!${username}@${username}.tmi.twitch.tv PRIVMSG #${channel} :${data.replace(/^bits /u, '')}!`
    }

    return {
      command: 'PRIVMSG',
      response,
      type: 'message',
    }
  }

  return {
    command,
    message,
    response: `:${HOST} 421 ${username} ${command} :Unknown command`,
    type: 'unknown',
  }
}

server.on('connection', socket => {
  const socketDataStore = {
    capabilities: null,
    id: uuid(),
    isAcknowledged: false,
    pongTimeoutID: null,
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
        socket.send(`:${HOST} CAP * ACK :${capabilities.join(' ')}`)
        socket.send([
          `:${HOST} 001 ${username} :Welcome, GLHF!`,
          `:${HOST} 002 ${username} :Your host is ${HOST}`,
          `:${HOST} 003 ${username} :This server is rather new`,
          `:${HOST} 004 ${username} :-`,
          `:${HOST} 375 ${username} :-`,
          `:${HOST} 372 ${username} :You are in a maze of twisty passages, all alike.`,
          `:${HOST} 376 ${username} :>`,
        ].join('\r\n'))
        socket.send('PING')
        socketDataStore.isAcknowledged = true
      }
    }
  })

  setInterval(() => {
    const { id } = socketDataStore
    socketDataStore.pongTimeoutID = setTimeout(() => {
      log('Client didn\'t PONG in time - terminating connection', { id }, 'error')
      socket.terminate()
    }, 1000)

    log('Pinging client', { id }, 'info')
    socket.send('PING')
  }, (1000 * 60 * 5))
})

log(`Server started. Listening on port ${PORT}...`)
