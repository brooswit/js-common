module.exports = function getArgNames (func) {
  let argNames = null
  try {
    argNames = func.toString().split('(')[1].split(')')[0].replace(/\s/g, '').split(',')
  } catch (e) {}
  return argNames
}
