import regAllMatchPieces from "./regAllMatchPieces";
export default function strToNodes(kword, srchCont) {
  const nodes = [];
  // 优化：正则处理搜索内容和建议关键词的匹配
  const allMatchedPieces = regAllMatchPieces(kword, srchCont);
  if (allMatchedPieces.length !== 0) {
    allMatchedPieces.forEach((element) => {
      const node1 = {
        name: "span",
        attrs: { style: "color:#26ce8a;font-size:14px;" },
        children: [{ type: "text", text: element.value }],
      };
      const node2 = {
        name: "span",
        attrs: { style: "color:#000000;font-size:14px" },
        children: [
          {
            type: "text",
            text: element.preValue,
          },
        ],
      };
      nodes.push(node2, node1);
    });
  } else {
    // 一视同仁
    const node = {
      name: "span",
      attrs: { style: "color:#000000;font-size:14px" },
      children: [{ type: "text", text: kword }],
    };
    nodes.push(node);
  }
  return nodes;
}
