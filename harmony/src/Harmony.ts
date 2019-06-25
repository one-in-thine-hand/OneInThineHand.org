import { Verse } from '../../shared/src/shared';

export abstract class HarmonyElement {
  public verseTitle: string;
  public verseRef: string;
}

export class HarmonyVerse extends HarmonyElement {
  public verse: Verse;
}
export class HarmonyXRef {
  public xRefTitle: string;
  public harmonyVerse: HarmonyVerse[] | undefined;
}

export class HarmonyCell {
  public sortKey: string | undefined;
  public harmonyVerses: HarmonyVerse[] | undefined;
  public harmonyXRef: HarmonyXRef[] | undefined;
  public sequenceTitle: string | undefined;
}
export class Harmony {
  public language: string;
  public _id: string;
  public _rev: string | undefined;
  public harmonyCells: (HarmonyCell | HarmonyXRef)[][];
}
