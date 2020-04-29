const Tinify = require('tinify');
Tinify.key = 'zq9bG1BlfSg7Kt6YHwyVqhhyVCK4JFfR';
// const { validate: originValidate } = Tinify




/**
 * 重写验证方法
 */
function validate() {
	return new Promise((res, rej) => {
		Tinify.validate(function(err) {
      if(err){
        rej(err)
      }else{
        res(true)
      }
			// console.log('* ', Tinify.compressionCount);
		});
	});
}

/**
 * 获取次数
 */
function getCompressionCount(){
  if(typeof Tinify.compressionCount === 'number'){
    return Promise.resolve(Tinify.compressionCount)
  }else{
    return validate().then(isNormal => {
      if(typeof Tinify.compressionCount === 'number'){
        return Tinify.compressionCount
      }else{
        return Promise.reject({msg: `Tinify.compressionCount错误 ${Tinify.compressionCount}`})
      }
    })
  }
}

// module.exports = {
//   ...Tinify,
//   validate,
//   getCompressionCount
// };

// module.exports = Tinify
export {
  Tinify
} 
export default {
  validate,
  getCompressionCount
}