import { getElementAttribute } from './getElementAttribute';
import { bookNames } from '../../shared/src/shared';
export async function parseID(
  document: Document,
  language: string,
): Promise<string> {
  let id = `${getElementAttribute(
    document,
    'html',
    'data-uri',
    new RegExp(new RegExp(/(?!\\)[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/g)),
  ).replace(/\//g, '-')}`;

  const book = bookNames.find(
    (bookName): boolean => {
      return id.startsWith(bookName.chapterStartsWith);
    },
  );

  if (book) {
    id = `${language}-${id.replace(
      book.chapterStartsWith,
      book.startsWith,
    )}-chapter`;
  }
  // console.log(`${id} - ${book ? book.startsWith : 'nothing'}`);
  return id;
}
