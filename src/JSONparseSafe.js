module.exports = function JSONparseSafe (str, fallback = undefined) {
  try {
    return JSON.parse(str)
  } catch (ex) {
    return fallback
  }
}
