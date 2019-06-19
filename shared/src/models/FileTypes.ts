export const enum FileTypes {
  Notes,
  Chapter,
  Topic,
  Book,
}

export class FileType {
  public type: FileTypes;
  public name: string;
}
