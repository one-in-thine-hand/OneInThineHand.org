export interface Visibility {
  visible?: boolean;
}

export function getVisible<T extends Visibility>(items: T[]): T[] {
  return items.filter(
    (item): boolean => {
      return item.visible === true;
    },
  );
}
