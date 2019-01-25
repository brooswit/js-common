import { Observable } from 'rxjs';

module.exports = class VirtualWebSocket {
    constructor(ws) {
        this._ws = ws;
    }
}