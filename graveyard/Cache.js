var fs = require('fs');

var mkdirp = require('mkdirp');

module.exports = class Store {
    constructor() {
        let cacheLayers = this._cacheLayers = [];
        let cacheHash = this._cacheHash = {};

        this._cacheLayers.push({
            get: async (key)=>{
                return cacheHash[key];
            },
            set: async (key, value)=>{
                cacheHash[key] = value;
            }
        });
        this._cacheLayers.push({
            get: async (key)=>{
                return await new Promise(async (resolve, reject)=>{
                    let path = `./cache/${key}.txt`;
                    fs.exists(path, (exists) => {
                        if (!exists) return resolve(undefined);
                        fs.readFile(path, (err, buf) => {
                            if (err) return reject(err);
                            else try {
                                return resolve(JSON.parse(buf.toString()));
                            } catch(e) {
                                return resolve(undefined)
                            }
                        });
                    });
                });
            },
            set: async (key, value)=>{
                await new Promise(async (resolve, reject)=>{
                    let path = `./cache/${key}.txt`
                    let directoryPath = path.split('/').slice(0, -1).join('/');
                    mkdirp(directoryPath, (err) => {
                        if (err) return reject(err);
                        fs.writeFile(path, JSON.stringify(value), (err) => {
                            if (err) return reject(err);
                            else return resolve();
                        });
                    });
                });
            }
        });
    }

    async get(key, getter) {
        let value = undefined;
        let layer = undefined;

        let layers = this._cacheLayers.concat([{get:getter,set:()=>undefined}]);
        for(layer = 0; value === undefined && layer < layers.length; layer++) {
            value = layers[layer].get && await layers[layer].get(key);
        }
        this.set(key, value, layer);
        return value;
    }

    async set(key, value, maxLayer) {
        let layer = undefined;

        for(layer = 0; value !== undefined && layer < (maxLayer || this._cacheLayers.length); layer++) {
            if (this._cacheLayers[layer] && this._cacheLayers[layer].set) {
                await this._cacheLayers[layer].set(key, value);
            }
        }
    }
}