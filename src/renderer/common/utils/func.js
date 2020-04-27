/**
 * 格式化各种形式的class名; 支持字符串, 数组等
 * 使用方式:
 * <View className={formatClassName('name', 1,[Style.btn, 'first'], null)}></View>
 */
export function formatClassName(...args){
  args = args.filter(Boolean).join(',').split(/[\s,]+/g)
  return [...new Set(args)].join(' ')
}


/* 简单深度复制 */
export function copy(val){
  return JSON.parse(JSON.stringify(val))
}

/* 空函数, 一般用于默认值 */
export const emptyHandler = () => {}


/**
 * 延时函数
 * @param {number} time 延时时间
 * @param {any} a 延时后返回的内容
 */
export const sleep = (time = 0, a) => new Promise((res) => setTimeout(() => res(a), time));