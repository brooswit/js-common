const EventEmitter = require('./EventEmitter');

module.exports = class Stream {
    constructor(name) {
        this._name = name
        this._data = [];
        this._events = new EventEmitter();

        this.isDone = false;
    }
    async tilHasNext() {
        if(this._data.length === 0 && !this.isDone) {
            await new Promise( (resolve) => {
                this._events.once('hasNext', resolve);
            });
        }
    }
    async tilDone() {
        await new Promise( (resolve, reject) => {
            this._events.once('done', resolve);
        });
    }
    done() {
        this.isDone = true;
        this._events.emit('hasNext');
        this._events.emit('done');
    }
    async getAll() {
        await this.tilDone();
        return this.getAllNow();
    }
    getAllNow() {
        let all = this._data;
        this._data = [];
        return all;
    }
    async _handleAdd(method, value) {
        this._data[method](value);
        this._events.emit('hasNext');
    }
    async _handleRemove(method) {
        await this.tilHasNext();
        let value = this._data[method]();
        return value;
    }
    async push(value) {
        await this._handleAdd('push', value);
    }
    async unshift(value) {
        await this._handleAdd('unshift', value);
    }
    async pop() {
        return await this._handleRemove('pop');
    }
    async shift() {
        return await this._handleRemove('shift');
    }
}
