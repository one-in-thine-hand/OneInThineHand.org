export class HarmonyVerse {
  public verseTitle: string;
  public verseRef: string;
}

export class HarmonyCell {
  public sortKey: string;
  public harmonyVerses: HarmonyVerse[] = [];
}
export class Harmony {
  public language: string;
  public harmonyCells: HarmonyCell[][];
}
