import { Verse } from '../../shared/src/models/Verse';

// export abstract class HarmonyElement {
//   public verseTitle: string;
//   public verseRef: string;
// }

// export class HarmonyVerse extends HarmonyElement {
//   public verse: Verse;
// }
// export class HarmonyXRef {
//   public xRefTitle: string;
//   public harmonyVerse: HarmonyVerse[] | undefined;
// }

// export class HarmonyCell {
//   public sortKey: string | undefined;
//   public harmonyVerses: HarmonyVerse[] | undefined;
//   public harmonyXRef: HarmonyXRef[] | undefined;
//   public sequenceTitle: string | undefined;
// }
// export class Harmony {
//   public language: string;
//   public _id: string;
//   public _rev: string | undefined;
//   public harmonyCells: (HarmonyCell | HarmonyXRef)[][];
// }

export class HarmonyCell {
  public sortKey?: string;
  public verseRef: string[] | undefined;
  public verse: Verse[] | undefined;
}

export class HarmonyRow {
  public harmonyCells: HarmonyCell[];
}

export class Harmony {
  public _id: string;
  public _rev: string | undefined;
  public harmonyRows: HarmonyRow[];
  public title: string | undefined;
  public titleNumber: string | undefined;
}
