import { FormatTag } from './format_tags/FormatTag';

export class ChapterBreaks {
  public verseBreaks: { _id: string; breaks: FormatTag[] }[] | undefined;
}
