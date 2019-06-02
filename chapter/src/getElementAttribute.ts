export function getElementAttribute(
  document: Document,
  selector: string,
  attrName: string,
  regex: RegExp = new RegExp(/.+/g),
): string {
  const rootElement = document.querySelector(selector);
  const elementAttribute = rootElement
    ? rootElement.getAttribute(attrName)
    : undefined;
  if (elementAttribute) {
    const text = regex.exec(elementAttribute);
    // if (text) {
    //   console.log(text[0].toString());
    // }
    return text ? `${text[0].toString()}` : '';
  }
  return '';
}
