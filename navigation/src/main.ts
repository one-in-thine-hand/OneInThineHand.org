// import { readFile } from 'fs-extra';
import FastGlob from 'fast-glob';
import { normalize } from 'path';
import { readFile, writeFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { getNavigationItem } from './getNavigationItem';
export class NavigationItem {
  public navItem: NavigationItem[] | undefined;
  public href: string | undefined;
  public title: string;
  public shortTitle: string;
}

export function filterTextNodes(childNode: Node): Node[] {
  return Array.from(childNode.childNodes).filter(
    (childNode): boolean => {
      return childNode.nodeName !== '#text';
    },
  );
}

export function getChildNavigation(manifestElement: Element): NavigationItem[] {
  const children: NavigationItem[] = [];
  Array.from(manifestElement.childNodes)
    .filter(
      (childNode): boolean => {
        return childNode.nodeName !== '#text';
      },
    )
    .map(
      (childNode): void => {
        if (childNode.nodeName.toLowerCase() === 'ul') {
          try {
            console.log(childNode.childNodes);

            Array.from(childNode.childNodes)
              .filter(
                (childNode): boolean => {
                  return childNode.nodeName !== '#text';
                },
              )
              .map(
                (li: Element): void => {
                  const navItem = getNavigationItem(li);
                  if (navItem) {
                    children.push(navItem);
                  }
                },
              );
          } catch (err) {
            console.log(err);
          }
          // return childNode.textContent;
        } else if (childNode.nodeName.toLowerCase() === 'section') {
          // return childNode.textContent;
          const navItem = new NavigationItem();
          const headerElement = (childNode as Element).querySelector('header');
          if (headerElement) {
            navItem.title =
              headerElement && headerElement.textContent
                ? headerElement.textContent.trim()
                : '';
            navItem.shortTitle =
              headerElement && headerElement.textContent
                ? headerElement.textContent.trim()
                : '';
          }
        }
      },
    );
  return children;
}

async function main(): Promise<void> {
  const fileNames = await FastGlob(normalize(`./manifests/**/**`));
  console.log(fileNames);
  const navItems = fileNames.map(
    async (fileName: string): Promise<NavigationItem | undefined> => {
      const file = await readFile(fileName);

      if (file) {
        const document = new JSDOM(file).window.document;

        const navItem = new NavigationItem();

        const textElem = document.querySelector('header h1');

        navItem.title =
          textElem && textElem.textContent ? textElem.textContent : '';

        const manifestElement = document.querySelector('nav.manifest');

        if (manifestElement) {
          navItem.navItem = getChildNavigation(manifestElement);
        }
        return navItem;
      }
      return undefined;
    },
  );
  await writeFile(
    normalize('./manifests.json'),
    JSON.stringify(await Promise.all(navItems)),
  );
}

main();
