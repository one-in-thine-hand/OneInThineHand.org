export function getInputValue(selector: string): string {
  const e = document.querySelector(selector);
  if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) {
    return (e as HTMLInputElement).value;
  }
  return '';
}
