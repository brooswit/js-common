const fs = require('fs');
const fileNames = fs.readdirSync('./src/');

let common = {}

for (fileNameIndex in fileNames) {
  const fileName = fileNames[fileNameIndex]
  const splitFileName = fileName.split('.')
  const requireName = splitFileName.splice(0, splitFileName.length -1)
  try {
    common[fileName] = require(`./src/${requireName}`)
  } catch (e) {}
}

module.exports = common