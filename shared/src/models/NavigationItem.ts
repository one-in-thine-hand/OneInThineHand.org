export class NavigationItem {
  public navItems: NavigationItem[] | undefined;
  public href: string | undefined;
  public title: string;
  public shortTitle: string;
  public active: boolean | undefined;
}

export function flattenNavigationItems(
  navItems: NavigationItem[],
): NavigationItem[] {
  let n: NavigationItem[] = [];
  navItems.map(
    (navItem): void => {
      if (navItem.href) {
        n.push(navItem);
      } else if (navItem.navItems) {
        n = n.concat(flattenNavigationItems(navItem.navItems));
      }
    },
  );
  return n;
}
