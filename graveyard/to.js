module.exports = async function to(asyncFunc) {
    try {
        return [null, await asyncFunc()]
    } catch(e) {
        return [e, undefined];
    }
}
