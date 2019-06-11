import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ParamService {
  public constructor() {}

  public parseChapterParams(params: Params): ChapterParams {
    const book = params['book'] as string;
    const chapter = params['chapter'] as string;
    return {
      book: book,
      chapter: chapter,
      highlight: undefined,
      context: undefined,
    };
  }
}

export class ChapterParams {
  public book: string;
  public chapter: string;
  public highlight: string | undefined;
  public context: string | undefined;
}
