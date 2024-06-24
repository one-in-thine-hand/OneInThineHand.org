import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Omit } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ParamService {
  public constructor() {}

  public parseChapterParams(params: Params): ChapterParams {
    let book = params['book'] as string;
    const chapter = (params['chapter'] as string).split('.');
    if (book === 'w-of-m') {
      book = 'w_of_m';
    }
    return {
      book: book.replace('-', '_'),
      chapter: chapter[0],
      highlight: chapter[1] !== undefined ? chapter[1] : undefined,
      context: chapter[2] !== undefined ? chapter[2] : undefined,
    };
  }
}

export class ChapterParams {
  public book: string;
  public chapter: string;
  public highlight: string | undefined;
  public context: string | undefined;
}

// type Test = Omit<ChapterParams, 'book'>;
