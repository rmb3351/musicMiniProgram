// 数组存对象的形式返回在kword中搜索到的srchCont内所有片段和非片段信息
export default function regAllMatchPieces(kword, srchCont) {
  const regCont = new RegExp(`[${srchCont}]+`, "gi");
  let _kword = kword;
  const regMatched = _kword.match(regCont) ? _kword.match(regCont) : [];
  if (regMatched.length === 0) return [];
  // 原字符串中:下标进度、未截取的前缀下标进度,上次截取的长度，前缀内容
  let totalIndex = 0;
  let preIndex = 0;
  let lastLength = 0;
  let preValue = "";
  const allMatchPieces = regMatched.map((value) => {
    preIndex = totalIndex + lastLength;
    // 最新字符串中下标进度
    const curIndex = _kword.indexOf(value);
    // 先更新原下标进度，再保存上次截取的长度
    totalIndex += curIndex + lastLength;
    lastLength = value.length;
    preValue = kword.substr(preIndex, curIndex);
    _kword = _kword.substr(curIndex + value.length);
    // 对于匹配内容和未匹配的前缀，都返回其原下标进度、长度、内容
    return {
      index: totalIndex,
      length: value.length,
      value,
      preIndex,
      preLength: curIndex,
      preValue,
    };
  });
  // 最后添加匹配不上的末尾字符串收尾
  preIndex = totalIndex + lastLength;
  preValue = kword.substr(preIndex);
  allMatchPieces.push({
    index: preIndex,
    length: 0,
    value: "",
    preIndex,
    preLength: kword.length - preIndex,
    preValue,
  });
  return allMatchPieces;
}
