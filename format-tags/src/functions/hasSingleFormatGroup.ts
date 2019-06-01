import { formatGroupSelectors } from './formatGroupSelectors';

export async function hasSingleFormatGroup(element: Element): Promise<boolean> {
  return (
    Array.from(element.querySelectorAll(formatGroupSelectors)).filter(
      (childElement): boolean => {
        const href = childElement.getAttribute('href');
        if (href && href.includes('#note')) {
          return false;
        }
        return !childElement.hasAttribute('marker');
      },
    ).length === 0
  );
}
