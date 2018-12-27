const {Process} = require('./Process')
class EventManager {
  constructor() {
    
  }

  trigger(eventName, payload) {

  }

  hook(eventName, callback, context) {
    return new Process(async (process) => {
      
    })
  }
}