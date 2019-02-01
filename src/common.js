module.exports = {
  // services
  'chrono': require('./services/chrono'),
  'safeJSON': require('./services/safeJSON'),

  // functions
  'calculateMemoryFootprint': require('./functions/calculateMemoryFootprint'),
  'generateHashCode': require('./functions/generateHashCode'),
  'hashCode': require('./functions/hashCode'),
  'isAsync': require('./functions/isAsync'),
  'NO_OP': require('./functions/NO_OP'),
  'promiseToEmit': require('./functions/promiseToEmit'),
  'run': require('./functions/run'),

  // classes
  'AsyncArray': require('./classes/AsyncArray'),
  'EventManager': require('./classes/EventManager'),
  'ExtendedEmitter': require('./classes/ExtendedEmitter'),
  'Job': require('./classes/Job'),
  'Resolver': require('./classes/Resolver'),
  'TaskManager': require('./classes/TaskManager'),
  'VirtualWebSocket': require('./classes/VirtualWebSocket'),
}
