import { getElementAttribute } from './getElementAttribute';
export async function parseLanguage(document: Document): Promise<string> {
  return getElementAttribute(document, 'html', 'lang', new RegExp(/.+/g));
}
