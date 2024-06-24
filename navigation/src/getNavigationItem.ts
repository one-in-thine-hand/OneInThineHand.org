import { NavigationItem } from '../../shared/src/shared';
import { filterTextNodes, getChildNavigation } from './main';
import cuid from 'cuid';

function hasNav(li: Element): boolean {
  return (
    li.nodeName.toLowerCase() === 'li' &&
    li.childNodes &&
    Array.from(li.childNodes)
      .filter(
        (childNode): boolean => {
          return childNode.nodeName !== '#text';
        },
      )[0]
      .nodeName.toLowerCase() === 'p'
  );
}

export function getNavigationItem(
  li: Element,
  titleSelector: string,
  shortTitleSelector: string,
): NavigationItem | undefined {
  const navItem = new NavigationItem();

  if (hasNav(li)) {
    const title = li.querySelector('p.title');
    const shortTitle = li.querySelector('p.short-title');
    navItem.title = title && title.textContent ? title.textContent : '';
    navItem.shortTitle =
      shortTitle && shortTitle.textContent ? shortTitle.textContent : '';
    navItem.id = cuid.slug();
    navItem.navItems = Array.from(li.querySelectorAll('ul li'))
      .map(
        (e): NavigationItem | undefined => {
          return getNavigationItem(e, 'a .title', 'a .short-title');
        },
      )
      .filter(
        (v): boolean => {
          return v !== undefined;
        },
      ) as NavigationItem[];
  } else {
    const aElement = li.querySelector('a') as HTMLAnchorElement | undefined;
    const title = li.querySelector(titleSelector);
    const shortTitle = li.querySelector(shortTitleSelector);
    navItem.href =
      aElement && aElement.href
        ? `#/${aElement.href.replace('.html', '')}`
        : '';
    navItem.title = title && title.textContent ? title.textContent : '';
    navItem.shortTitle =
      shortTitle && shortTitle.textContent ? shortTitle.textContent : '';

    const cN = filterTextNodes(li);

    if (cN[1] && cN[1].nodeName.toLowerCase() === 'ul') {
      navItem.href = undefined;
      navItem.id = cuid.slug();
      navItem.navItems = getChildNavigation(li as Element);
    } else {
      navItem.id = undefined;
      navItem.navItems = undefined;
    }
    if (navItem.href && navItem.href.includes('about:blank#')) {
      return undefined;
    }
  }
  return navItem;
}
