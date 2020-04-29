const fs = require('fs')
const { promisify } = require('util')
const readFilePro = promisify(fs.readFile)



module.exports  = function(imgPath){
  return readFilePro(imgPath).then(bitmap => {
    return Buffer.from(bitmap, 'binary').toString('base64')
  })
}

