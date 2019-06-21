import { NavigationItem, getChildNavigation, filterTextNodes } from './main';
export function getNavigationItem(li: Element): NavigationItem | undefined {
  const navItem = new NavigationItem();
  const aElement = li.querySelector('a') as HTMLAnchorElement | undefined;
  const title = li.querySelector('.title');
  const shortTitle = li.querySelector('.short-title');
  navItem.href = aElement && aElement.href ? aElement.href : '';
  navItem.title = title && title.textContent ? title.textContent : '';
  navItem.shortTitle =
    shortTitle && shortTitle.textContent ? shortTitle.textContent : '';

  const cN = filterTextNodes(li);
  //   console.log(filterTextNodes(li)[1].nodeName.toLowerCase());

  if (cN[1] && cN[1].nodeName.toLowerCase() === 'ul') {
    // console.log('vhhjjjjj');
    console.log(navItem.shortTitle);
    navItem.href = undefined;
    navItem.navItem = getChildNavigation(li as Element);
  }
  return navItem;
}
