const path = require('path')

const getPath = function(msg){
  console.log('node.js: ', msg)
  return path.resolve(__dirname, msg)
}


module.exports = {
  getPath
}