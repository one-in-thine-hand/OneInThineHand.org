export function removeEmptySpaces(verseElement: Element): void {
  verseElement.querySelectorAll(['br', '.page-break'].toString()).forEach(
    (e): void => {
      e.remove();
    },
  );
}
