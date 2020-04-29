/**
 * 把Promise转换成串行模式
 * @param {function[]} arr Promsie构造函数组成的数组
 */
export async function queue(arr = []) {
	let resArr = [];
	queue.stack = arr.concat(queue.stack);

	for (let i = 0; i < queue.stack.length; i++) {
    let createPromise = queue.stack[i];
    
    let res = null
    if(typeof createPromise === 'function'){
      /* createPromise 执行后, 返回Promise对象 */
		  res = await createPromise(i);
    }else{
      res = await createPromise
    }

		/* 收集结果 */
		resArr.push(res);
	}

	/* 恢复 */
	queue.stack = [];

	/* 返回全部结果 */
	return resArr;
}

/**
 * 在尾部添加Promise构造函数
 */
queue.stack = []
queue.push = function(createPromise) {
	this.stack.push(createPromise);
};
