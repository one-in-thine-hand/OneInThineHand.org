import { JSDOM } from 'jsdom';
export async function parseDocument(file: Buffer): Promise<Document> {
  return new JSDOM(file).window.document;
}
