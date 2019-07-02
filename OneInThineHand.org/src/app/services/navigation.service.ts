import { Injectable } from '@angular/core';
import { last } from 'lodash';
import { Router } from '@angular/router';
import { NavigationItem } from '../../../../shared/src/shared';
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private bookNames = [
    ['Joseph Smith—History', 'js-h/1'],
    ['Genesis', 'Gen.', 'Gen', 'Gen', 'gen'],
    ['Exodus', 'Ex.', 'Ex', 'ex'],
    ['Leviticus', 'Lev.', 'Lev', 'lev '],
    ['Numbers', 'Num.', 'Num', 'num'],
    ['Deuteronomy', 'Deut.', 'Deut', 'deut'],
    ['Joshua', 'Josh.', 'Josh', 'josh'],
    ['Judges', 'Judg.', 'Judg', 'judg'],
    ['Ruth', 'Ruth', 'ruth'],
    ['1 Samuel', '1 Sam.', '1 Sam', '1-sam', '1-sam'],
    ['2 Samuel', '2 Sam.', '2 Sam', '2-sam', '2-sam'],
    ['1 Kings', '1 Kgs.', '1 Kgs', '1-kgs', '1-kgs'],
    ['2 Kings', '2 Kgs.', '2 Kgs', '2-kgs', '2-kgs'],
    ['1 Chronicles', '1 Chr.', '1 Chr', '1-chr', '1-chr'],
    ['1 Chronicles', '1 Chron.', '1 Chron', '1-chr', '1-chr'],
    ['2 Chronicles', '2 Chr.', '2 Chr', '2-chr', '2-chr'],
    ['2 Chronicles', '2 Chron.', '2 Chron', '2-chr', '2-chr'],
    ['Ezra', 'Ezra', 'ezra'],
    ['Nehemiah', 'Neh.', 'Neh', 'neh'],
    ['Esther', 'Esth.', 'Esth', 'esth'],
    ['Job', 'Job', 'job'],
    ['Psalms', 'Psalm', 'Ps.', 'Ps', 'ps'],
    ['Proverbs', 'Prov.', 'Prov', 'prov'],
    ['Ecclesiastes', 'Eccl.', 'Eccl', 'eccl'],
    ['Song of Solomon', 'Song', 'song'],
    ['Isaiah', 'Isa.', 'Isa', 'isa'],
    ['Jeremiah', 'Jer.', 'Jer', 'jer'],
    ['Lamentations', 'Lam.', 'Lam', 'lam'],
    ['Ezekiel', 'Ezek.', 'Ezek', 'ezek'],
    ['Daniel', 'Dan.', 'Dan', 'dan'],
    ['Hosea', 'Hosea', 'hosea'],
    ['Joel', 'Joel', 'joel'],
    ['Amos', 'Amos', 'amos'],
    ['Obadiah', 'Obad.', 'Obad', 'obad'],
    ['Jonah', 'Jonah', 'jonah'],
    ['Micah', 'Micah', 'micah'],
    ['Nahum', 'Nahum', 'nahum'],
    ['Habakkuk', 'Hab.', 'Hab', 'hab'],
    ['Habbakuk', 'Hab.', 'Hab', 'hab'],
    ['Zephaniah', 'Zeph.', 'Zeph', 'zeph'],
    ['Haggai', 'Hag.', 'Hag', 'hag'],
    ['Hagai', 'Hag.', 'Hag', 'hag'],
    ['Zechariah', 'Zech.', 'Zech', 'zech'],
    ['Malachi', 'Mal.', 'Mal', 'mal'],
    ['Matthew', 'matthew', 'Matt.', 'matthew', 'Matt', 'matt'],
    ['Mark', 'Mark', 'mark'],
    ['Luke', 'Luke', 'luke'],
    ['John', 'John', 'john'],
    ['Acts', 'Acts', 'acts'],
    ['Romans', 'Rom.', 'Rom', 'rom'],
    ['1 Corinthians', '1 Cor.', '1 Cor', '1-cor', '1-cor'],
    ['2 Corinthians', '2 Cor.', '2 Cor', '2-cor', '2-cor'],
    ['Galatians', 'Gal.', 'Gal', 'gal'],
    // ['Ephesians', 'Eph.', 'Eph', 'eph'],
    ['Philippians', 'Philip.', 'Philip', 'philip'],
    ['Colossians', 'Col.', 'Col', 'col'],
    ['1 Thessalonians', '1 Thes.', '1 Thes', '1-thes'],
    ['2 Thessalonians', '2 Thes.', '2 Thes', '2-thes'],
    ['1 Timothy', '1 Tim.', '1 Tim', '1-tim', '1-tim'],
    ['2 Timothy', '2 Tim.', '2 Tim', '2-tim', '2-tim'],
    ['Titus', 'Titus', 'titus'],
    ['Philemon', 'Philem.', 'Philem', 'philem'],
    ['Hebrews', 'Heb.', 'Heb', 'heb'],
    ['James', 'James', 'james'],
    ['1 Peter', '1 Pet.', '1 Pet', '1-pet', '1-pet'],
    ['1 Peter', '1 Pt.', '1 Pt', '1-pet', '1-pet'],
    ['2 Peter', '2 Pet.', '2 Pet', '2-pet', '2-pet'],
    ['2 Peter', '2 Pt.', '2 Pt', '2-pet', '2-pet'],
    ['1 John', '1 Jn.', '1 Jn', '1-jn', '1-jn'],
    ['2 John', '2 Jn.', '2 Jn', '2-jn', '2-jn'],
    ['3 John', '3 Jn.', '3 Jn', '3-jn', '3-jn'],
    ['Jude', 'Jude', 'jude'],
    ['Revelations', 'Rev.', 'Rev', 'rev'],
    ['1 Nephi', '1 ne.', '1 Ne.', '1 Nephi', '1 Ne', '1-ne', '1-ne'],
    ['2 Nephi', '2 Ne.', '2 Ne', '2 Ne', '2-ne', '2-ne'],
    ['Jacob', 'Jacob', 'jacob'],
    ['Enos', 'Enos', 'enos'],
    ['Jarom', 'Jarom', 'jarom'],
    ['Omni', 'Omni', 'omni'],
    [
      'Words of Mormon',
      'W of M',
      'w-of-m',
      'Words of Mormon',
      'WofM',
      'w-of-m',
    ],
    ['Mosiah', 'mosiah', 'Mosiah'],
    ['Alma', 'Alma', 'alma'],
    ['Helaman', 'Hel.', 'Hel', 'hel'],
    ['3 Nephi', '3 Ne.', '3 Ne', '3 Ne', '3-ne', '3-ne'],
    ['4 Nephi', '4 Ne.', '4 Ne', '4 Ne', '4-ne', '4-ne'],
    ['Mormon', 'Morm.', 'Morm', 'morm'],
    ['Ether', 'Ether', 'ether'],
    ['Moroni', 'Moro.', 'Moro', 'moro'],
    ['The Testimony of Three Witnesses', 'bofm/three'],
    ['The Testimony of Eight Witnesses', 'bofm/eight'],
    ['The Testimony of the Prophet Joseph Smith', 'bofm/js'],
    ['title page of the Book of Mormon', 'bofm/bofm-title'],
    [
      'Doctrine and Covenants',
      'sections',
      'DC',
      'Doctrine and Covenants',
      'D&C',
      'dc',
    ],
    ['Official Declaration', 'OD', 'od'],
    ['Moses', 'pgp', 'Moses', 'moses'],
    ['Abraham', 'Abr.', 'Abr', 'Abr', 'abr'],
    ['Ephesians', 'Eph.', 'Eph', 'eph'],
    [
      'Joseph Smith— Matthew',
      'JS—M',
      'js-m',
      'Joseph Smith–Matthew',
      'JS–M',
      'js-m',
      'Joseph Smith-Matthew',
      'JS-M',
      'js-m',
      'Joseph Smith Matthew',
      'JSM',
      'js-m',
    ],
    [
      'Joseph Smith—History',
      'JS—H',
      'js-h',
      'Joseph Smith–History',
      'JS–H',
      'js-h',
      'Joseph Smith-History',
      'JS-H',
      'js-h',
      'Joseph Smith History',
      'JSH',
      'js-h',
    ],
    [
      'Articles of Faith',
      'A of F',
      'a-of-f',
      'Articles of Faith',
      'AofF',
      'a-of-f',
    ],
    ['TG', 'Topical Guide', 'tg'],
    ['GS', 'Guide to the Scriptures', 'tg'],
  ];
  public constructor(private router: Router) {}

  public async parseAddressBarUrl(addressBarInput: string): Promise<void> {
    console.log(addressBarInput);
    try {
      const addressBarInputSplit = addressBarInput.split(' ');

      // const outUrl = addressBarInput
      //   .toLowerCase()
      //   .replace(/\s/g, ' ')
      //   .replace('&amp;', '&')
      //   .replace(/:/g, '.');

      // console.log(outUrl);

      const bookNames = this.getBookName(addressBarInput);
      const chapterName = last(addressBarInputSplit);
      if (bookNames && chapterName) {
        console.log(bookNames);
        const bookName = last(bookNames);

        this.router.navigateByUrl(`${bookName}/${chapterName}`);
      } else {
        throw '';
      }
    } catch (error) {
      throw 'No valid bookname found';
    }
  }

  private getHighlightAndContext(addressBarInput: string): void {}

  private getBookName(addressBarInput: string): string[] | undefined {
    return this.bookNames.find((bN): boolean => {
      return (
        bN.find((b): boolean => {
          return addressBarInput.toLowerCase().includes(b.toLowerCase());
        }) !== undefined
      );
    });
  }

  public findNav(
    id: string,
    navItems: NavigationItem[],
  ): NavigationItem | undefined {
    const navItem = navItems.find((nItem): boolean => {
      return nItem.href === id;
    });

    if (navItem) {
      return navItem;
    } else {
      for (let x = 0; x < navItems.length; x++) {
        const i = navItems[x];
        if (i.navItems && this.findNav(id, i.navItems)) {
          return i;
        }
      }
    }
    return undefined;
  }
}
