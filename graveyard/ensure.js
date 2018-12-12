const to = require('./to');

module.exports =  async function ensure(asyncFunc) {
    var err, result;
    do {
        [err, result] = await to(asyncFunc);
        if(err) console.log(err);
    } while (err);
    return result;
}
