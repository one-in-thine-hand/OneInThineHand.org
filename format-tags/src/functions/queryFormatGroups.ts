import { FormatGroup } from '../models/format_groups/FormatGroup';
import { hasSingleFormatGroup } from './hasSingleFormatGroup';
import {
  verseToFormatTextGroup as parseFormatTextGroups,
  parseFormatGroups,
} from './addFormatTextGroup';
export async function queryFormatGroups(
  verseElement: Element,
): Promise<FormatGroup[] | undefined> {
  const formatGroups: FormatGroup[] = [];
  if (await hasSingleFormatGroup(verseElement)) {
    await parseFormatTextGroups(verseElement, formatGroups);
  } else {
    await parseFormatGroups(verseElement, formatGroups);
  }
  return formatGroups.length > 0 ? formatGroups : undefined;
}
