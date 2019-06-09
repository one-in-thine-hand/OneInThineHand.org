import { Injectable } from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import { uniq } from 'lodash';
import { FormatTag, FormatTagType } from '../../../../shared/src/shared';
@Injectable({
  providedIn: 'root',
})
export class MarkService {
  private markdownIt = new MarkdownIt({
    html: true,
  });
  public constructor() {}

  public getFormatTagRichText(
    text: string | undefined,
    formatTags: FormatTag[] | undefined,
  ): string {
    if (text && formatTags) {
      const markDownText = this.getCommonMark(formatTags);

      let outputText = this.markdownIt.render(
        `${markDownText.preText}<f>${text}</f>${markDownText.postText}`,
      );
      ['<f>', '</f>', '<p>', '</p>'].map(
        (replace): void => {
          outputText = outputText.replace(replace, '');
        },
      );
      // console.log(outputText);

      return outputText;
    } else {
      return text ? text : '';
    }
  }

  private getCommonMark(
    text: FormatTag[],
  ): { preText: string; postText: string } {
    const commonMark: { preText: string; postText: string } = {
      preText: '',
      postText: '',
    };
    uniq(text).map(
      (rich): void => {
        let addedText = '';
        switch (rich.formatType) {
          case FormatTagType.verseNumber: {
            addedText = '**';
            break;
          }
          case FormatTagType.italic: {
            addedText = '_';
            break;
          }
        }
        commonMark.preText = `${addedText}${commonMark.preText}`;
        commonMark.postText = `${commonMark.postText}${addedText}`;
      },
    );

    return commonMark;
  }
}
