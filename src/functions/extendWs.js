const ubjson = require('@shelacek/ubjson')
const EventEmitter = require('events')

class WebChannel extends EventEmitter {
  constructor(xws, localMessageId, remoteMessageId) {
    
    this._xws = xws
    this._localMessageId = localMessageId
    this._remoteMessageId = remoteMessageId

    this._boundHandleData = this._handleData.bind(this)
    this._xws.on('close', this.close.bind(this))
    this._xws.on(this._getChannelName(), this._boundHandleData)
  }

  _getChannelName() {
    return `channel:${localMessageId}`
  }

  _handleData(data) {
    const {event, payload} = data
    this.emit('data', data)
    if (event) {
      this.emit(event, payload)
    }
  }

  sendData(data) {
    this._xws.sendChannel(this.remoteMessageId, data)
  }

  sendEvent(event, payload) {
    this.sendData({event, payload})
  }

  openChannel(callback) {
    return this._xws.openChannel(callback)
  }

  close() {
    this.emit('close')
    this._xws.off(this._getChannelName, this._boundHandleData)
  }
}

let _nextMessageId = 0
module.exports = function extendWs(ws, enableDebug) {
  ws.enableDebug = enableDebug;
  if (ws.enableDebug) console.warn('extending ws')
  if(!ws.on) {
    if (ws.enableDebug) console.warn('browser support')
    ws._emitter = new EventEmitter()
    
    ws.on = ws._emitter.on.bind(ws._emitter)
    ws.off = ws._emitter.off.bind(ws._emitter)
    ws.once = ws._emitter.once.bind(ws._emitter)
    ws.emit = ws._emitter.emit.bind(ws._emitter)

    const makeEventHandler = (eventName) => {
      const eventHandler = () => {
        let args = Array.prototype.slice.call(arguments)
        args.unshift(eventName)
        this.emit.apply(this, args)
      }
    }

    ws.onopen = function() {
      let args = Array.prototype.slice.call(arguments)
      args.unshift('open')
      this.emit.apply(this, args)
    }

    ws.onmessage = function() {
      let args = Array.prototype.slice.call(arguments)
      args.unshift('message')
      this.emit.apply(this, args)
    }

    ws.onerror = function() {
      let args = Array.prototype.slice.call(arguments)
      args.unshift('error')
      this.emit.apply(this, args)
    }

    ws.onclose = function() {
      let args = Array.prototype.slice.call(arguments)
      args.unshift('close')
      this.emit.apply(this, args)
    }
  }
  
  ws.on('message', handleMessage.bind(ws))
  ws.on('data', handleData.bind(ws))
  ws.on('init-channel', handleInitChannel.bind(ws))

  ws.sendData = sendData
  ws.sendEvent = sendEvent
  ws.sendRequest = sendRequest
  ws.sendResponse = sendResponse
  ws.openChannel = openChannel
  ws.sendChannel = sendChannel
}

function handleMessage(msg) {
  const data = ubjson.decode(msg)
  if (data) {
    this.emit('data', data)
  }
}

function handleData(message) {
  const {data, payload} = message
  if (!data) return
  const {event, messageId} = data
  if (!event) return
  this.emit(event, payload, messageId)
}

function handleInitChannel(_payload_, remoteMessageId) {
  const localMessageId = this._xws.sendResponse(remoteMessageId)
  const webChannel = new WebChannel(this, localMessageId, remoteMessageId)
  this.emit('channel', webChannel)
}

function sendData(data) {
  const buffer = ubjson.encode(data)
  console.log(data)
  this.send(buffer)
}

function sendEvent(event, payload) {
  const messageId = _nextMessageId++
  const data = {
    data: {
      event,
      messageId
    },
    payload
  }
  this.sendData(data)
  return messageId
}

function sendRequest(event, payload, callback) {
  const messageId = this.sendEvent(event, payload)
  this.once(`respond:${messageId}`, callback)
}

function sendResponse(remoteMessageId, payload) {
  return sendEvent(`respond:${remoteMessageId}`, payload)
}

function openChannel(callback) {
    const localMessageId = this.sendRequest('init-channel', undefined, (_response_, remoteMessageId) => {
      callback(new WebChannel(this, localMessageId, remoteMessageId))
    })
}

function sendChannel(remoteMessageId, payload) {
  return sendEvent(`channel:${remoteMessageId}`, payload)
}
