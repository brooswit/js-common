module.exports = {
  // services
  'chrono': require('./services/chrono'),
  'safeJSON': require('./services/safeJSON'),

  // functions
  'calculateMemoryFootprint': require('./functions/calculateMemoryFootprint'),
  'extendWs': require('./functions/extendWs'),
  'generateHashCode': require('./functions/generateHashCode'),
  'hashCode': require('./functions/hashCode'),
  'isAsync': require('./functions/isAsync'),
  'NO_OP': require('./functions/NO_OP'),
  'promiseToEmit': require('./functions/promiseToEmit'),
  'run': require('./functions/run'),
  'promiseCallback': require('./functions/promiseCallback'),

  // classes
  'AsyncArray': require('./classes/AsyncArray'),
  'EventManager': require('./classes/EventManager'),
  'ExtendedEmitter': require('./classes/ExtendedEmitter'),
  'Future': require('./classes/Future'),
  'Routine': require('./classes/Routine'),
  'Resolvable': require('./classes/Resolvable'),
  'TaskManager': require('./classes/TaskManager'),
  'VirtualWebSocket': require('./classes/VirtualWebSocket'),

  // deprecated
  'VirtualWebSocket': require('./deprecated/VirtualWebSocket')
}
