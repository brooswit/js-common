class SafeJSON {
    parse(json, optionalFallback = undefined) {
        try {
            return JSON.parse(json)
        } catch (ex) {
            return optionalFallback
        }
    }
}

module.exports = safeJSON = new SafeJSON()
