import { hasSingleFormatGroup } from './hasSingleFormatGroup';
import {
  verseToFormatTextGroup as parseFormatTextGroups,
  parseFormatGroups,
} from './addFormatTextGroup';
import { FormatGroup, Verse } from '../../../shared/src/shared';

export async function queryFormatGroups(
  verseElement: Element,
  verse: Verse,
): Promise<FormatGroup[] | undefined> {
  const formatGroups: FormatGroup[] = [];
  if (await hasSingleFormatGroup(verseElement)) {
    await parseFormatTextGroups(verseElement, formatGroups);
  } else {
    await parseFormatGroups(verseElement, formatGroups, verse);
  }
  return formatGroups.length > 0 ? formatGroups : undefined;
}
