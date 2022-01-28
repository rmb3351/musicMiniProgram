// date是时间戳，fmt是需要的时间格式
export function formatDate(date, fmt) {
  // 时间戳转换为Date实例，好使用Date内方法
  date = new Date(date);
  // 时间格式对象：可能匹配到的时间单位格式作为属性名，值存放对应的时间
  let fmtObj = {
    "y+": date.getFullYear(),
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    // 24小时制的小时
    "H+": date.getHours(),
    // 12小时制，稍作判断
    "h+": date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  }; // 对时间单位格式逐个遍历处理
  for (let k in fmtObj) {
    // 先判断是否有匹配的正则，如果有，则替换对应部分
    //形如//格式的正则表达式内不识别模板字符串，所以要new实例
    if (new RegExp(`(${k})`).test(fmt)) {
      // 利用正则捕获方法获取当前时间单位需要的格式字符串
      let timeFmt = new RegExp(`(${k})`).exec(fmt)[0]; // 把对应时间左边先补0，避免位数不够
      let timeStr = "00" + fmtObj[k]; // 根据需要的格式字符串长度再从后往前做截取，最后一位取不到，所以可以不用-1
      timeStr = timeStr.substring(
        timeStr.length - timeFmt.length,
        timeStr.length
      );
      // 把对应位置的格式字符串替换为对应时间
      fmt = fmt.replace(timeFmt, timeStr);
    }
  }
  return fmt;
}
