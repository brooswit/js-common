// Intended to be used with https://github.com/websockets/ws
const {fromEvent} = require('rxjs');
const VirtualWebSocket = require('./VirtualWebSocket')
const Process = require('./Process')

module.exports = class VirtualWebSocketServer extends Process {
    constructor(wss) {
        super(async () => {
            const connectionObserver = fromEvent(wss, 'connection')
            this.subscribe(connectionObserver, this._handleConnection)
            await this.promiseTo('destroy')
        })
    }

    _handleConnection(ws) {
        new VirtualWebSocket(ws, {serverMode: true, parent: this})
    }
}
