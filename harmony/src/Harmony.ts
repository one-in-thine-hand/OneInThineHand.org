export abstract class HarmonyElement {
  public verseTitle: string;
  public verseRef: string;
}

export class HarmonyVerse extends HarmonyElement {}
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
  public harmonyCells: HarmonyCell[][];
}
