// Intended to be used with https://github.com/websockets/ws
const {fromEvent} = require('rxjs');
const VirtualWebSocket = require('./VirtualWebSocket')
const Process = require('./Process')

module.exports = class VirtualWebSocketServer extends Process {
    constructor(wss, connectionHandler) {
        super(async () => {
            this.subscribe(fromEvent(wss, 'connection'), this._handleConnection)
            this.subscribe(fromEvent(this, 'connection'), connectionHandler)
            await this.promiseTo('destroy')
        })
    }

    _handleConnection(ws) {
        const virtualWebSocket = new VirtualWebSocket(ws, {serverMode: true, parent: this})
        this.emit('connection', virtualWebSocket)
    }
}
