import { NavigationItem } from '../../shared/src/shared';
import { filterTextNodes, getChildNavigation } from './main';

export function getNavigationItem(
  li: Element,
  titleSelector: string,
  shortTitleSelector: string,
): NavigationItem | undefined {
  const navItem = new NavigationItem();
  const aElement = li.querySelector('a') as HTMLAnchorElement | undefined;
  const title = li.querySelector(titleSelector);
  const shortTitle = li.querySelector(shortTitleSelector);
  navItem.href =
    aElement && aElement.href ? aElement.href.replace('.html', '') : '';
  navItem.title = title && title.textContent ? title.textContent : '';
  navItem.shortTitle =
    shortTitle && shortTitle.textContent ? shortTitle.textContent : '';

  const cN = filterTextNodes(li);

  if (cN[1] && cN[1].nodeName.toLowerCase() === 'ul') {
    navItem.href = undefined;
    navItem.navItems = getChildNavigation(li as Element);
  } else {
    navItem.navItems = undefined;
  }
  if (navItem.href && navItem.href.includes('about:blank#')) {
    return undefined;
  }
  return navItem;
}
