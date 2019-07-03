export class NavigationItem {
  public navItems: NavigationItem[] | undefined;
  public href: string | undefined;
  public title: string;
  public shortTitle: string;
  public active: boolean | undefined;
  public display: boolean;
  public id: string | undefined;
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
export function flattenNavigationItem(
  navItem: NavigationItem,
): NavigationItem[] {
  let navItems: NavigationItem[] = [navItem];

  if (navItem.navItems) {
    navItem.navItems.map(
      (n): void => {
        if (n.navItems) {
          navItems = navItems.concat(flattenNavigationItem(n));
        } else {
          navItems.push(n);
        }
      },
    );
  }

  return navItems;
}
