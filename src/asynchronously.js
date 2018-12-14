module.exports = async function asynchronously (method) {
  let result = method.then ? await method() : method()
  return result
}