module.exports = function isAsync (func) {
    return !!func.then
}
