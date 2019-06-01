export async function queryChildNodes(node: Element | Node): Promise<Node[]> {
  return Array.from(node.childNodes);
}
