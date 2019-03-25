// Intended to be used with https://github.com/websockets/ws
const Readiable = require('./Readiable')
const WebSocket = require('ws');

class WebPipe {
  constructor(exws, channelId) {
    this._exws = exws
    this._channelId = channelId

    this._asyncArray = new AsyncArray()

    session.on(channelId, payload => {
      this._asyncArray.push(payload)
    })
  }

  async read() {
    const payload = await this._asyncArray.shift()
    return payload
  }

  write(payload) {
    this._exws.send({
      channelId: this.channelId,
      payload
    })
  }
}

class WebPipeSession extends Readiable, Disposable {
  constructor(exws, isServer) {
    this.exws = exws
    this.isServer = isServer
    exws.on('data', (data) => {
      const {channelId, payload} = data
      this.emit(chanelId, payload)
    })

    exws.on('close', () => {
      this.dispose()
    })
  }

  create() {
    let channelId = this.isServer ? _nextChannelId++ : null
    new WebPipe(this, channelId)
  }
}

class WebPipeClient {

}

class WebPipeServer extends Readiable, Disposable {
  constructor(options) {
    this._wss = null

    this._rebuildWss(options)
  }

  async _rebuildWss(options) {
    this._wss.close()
    
    this._wss = new WebSocket.Server(options);
    this._wss.on('connection',  ws => {
      const exws = new EXWS(ws)
      new WebChannelSession(this, exws)
    });
    this._wss.on('listening', () => {
      this.ready()
    })
    this._wss.on('close', () => {
      this._rebuildWss(options)
    })
  }
}


const generateHashCode = require('../functions/generateHashCode')
const {fromEvent} = require('rxjs');


class VirtualWebSocketChannel extends Readiable {
    constructor(vws, handler_OR_channelKey) {
      super()

      const isHandler = typeof handler_OR_channelKey === 'function'
      const isChannelKey = typeof handler_OR_channelKey === 'string'

      const handler = isHandler && handler_OR_channelKey
      const channelKey = isChannelKey && handler_OR_channelKey

      if(channelKey) {
        this._channelKey = channelKey
        this.ready()
      } else (handler) {
        this._channel = generateHashCode()
        this.send('open')
      }
      
        super(async () => {
            this.untilOpen = this.promiseTo('open')

            this.subscribeTo(vws.observe('event'), (data) => this._handleEvent(data))
            this.subscribeTo(vws.observe('close'), () => this.end)
            if (typeof handlerOrChannel === 'string') {
                const channel = handlerOrChannel
                this._channel = channel
                // ... 'open' allready recieved ... //
                this.send('open/complete')
                this.emit('open', this)
                await this.untilEnd
            } else if (typeof handlerOrChannel === 'function') {
                const handler = handlerOrChannel
                this._channel = generateHashCode()
                this.send('open')
                await Promise.race([ this.unitlEnd(), this.promiseTo('open/complete') ])
                this.emit('open', this)
                await Promise.race([ this.unitlEnd(), await handler(this) ])
                this.close()
            } else {
                // ... this should never happen ... //
            }
        }, vws)
    }

    _handleEvent(data) {
        const { channel, eventName, payload } = data
        if (channel !== this._channel) { return }
        this.emit(eventName, {channel: this, operation, payload})
    }

    send(eventName, payload) {
        vws.send(channel, eventName, payload)
    }

    close() {
        this.send('close')
        this.end()
    }
}

module.exports = class VirtualWebSocket extends Routine {
    constructor(ws, incomingOpenHandler, parent) {
        super(async () => {
            this._ws = ws;
            if (incomingOpenHandler) { this.subscribe(this.observe('open'), incomingOpenHandler) }

            this.subscribe(fromEvent(ws, 'message'), (message) => this._handleMessage(message))
            this.subscribe(fromEvent(ws, 'close'), () => this.end)
            this.subscribe(fromEvent(ws, 'error'), () => this.end)

            await this.untilEnd
        }, parent)
    }

    _handleMessage(message) {
        const data = JSONparseSafe(message)
        if (!data) { return }

        const { _vws } = data
        if (!_vws) { return }

        const { channel, eventName, payload } = data
        this.emit('event', {channel, eventName, payload})

        if(eventName !== 'open') { return }
        const vwsc = new VirtualWebSocketChannel(this, channel)
        this.emit('open', vwsc)
    }

    open(handler) {
        return new VirtualWebSocketChannel(this, handler)
    }

    send(channel, eventName, payload) {
        ws.send({ _vws: true, channel, eventName, payload})
    }
}

ENUM.reset()
const MESSAGE_COMMAND = ENUM()
const MESSAGE_EVENT = ENUM()
const MESSAGE_ERROR = ENUM()

ENUM.reset()
const ERROR_JSON

ENUM.reset()
const COMMAND_OPEN = ENUM()
const COMMAND_CLOSE = ENUM()

module.exports = class WebChannel extends Readiable {
  constructor(ws, serverHandler) {
    const isServer = !!serverHandler
    const isClient = !isServer

    ws.on('message', (json) => {
      const data = SafeJSON.parse(json, {
        _IS_SE: true,
        messageType: MESSAGE_ERROR,
        error: ERROR_JSON
      })
      if (!data._IS_SE) return
      if (data.messageType === MESSAGE_COMMAND) {
        let command = data.command

        if (command === COMMAND_OPEN) {
          let channelKey = data.channelKey
          new StreamEventsChannel(this, channelKey)
        }
      }
      {
        _IS_SE: true,
        messageType: 
        channelKey: 
        eventName:
        payload
      }
    })
  }

  dispose() {}
  send({messageType, command, channelKey}) {
    const payload = Object.assign({}, options, {_IS_SE: true})
    ws.send(payload)
  }
}


