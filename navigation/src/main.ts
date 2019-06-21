// import { readFile } from 'fs-extra';
import FastGlob from 'fast-glob';
import { normalize } from 'path';
import { readFile, writeFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { getNavigationItem } from './getNavigationItem';
import { NavigationItem } from '../../shared/src/shared';

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
            Array.from(childNode.childNodes)
              .filter(
                (childNode): boolean => {
                  return childNode.nodeName !== '#text';
                },
              )
              .map(
                (li: Element): void => {
                  const navItem = getNavigationItem(
                    li,
                    'a .title',
                    'a .short-title',
                  );
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
          // const navItem = new NavigationItem();
          // const headerElement = (childNode as Element).querySelector('header');
          // if (headerElement) {
          //   navItem.title =
          //     headerElement && headerElement.textContent
          //       ? headerElement.textContent.trim()
          //       : '';
          //   navItem.shortTitle =
          //     headerElement && headerElement.textContent
          //       ? headerElement.textContent.trim()
          //       : '';
          // }
          const navItem = getNavigationItem(
            childNode as Element,
            'header p',
            'header p',
          );
          if (navItem) {
            children.push(navItem);
          }
        }
      },
    );
  return children;
}

async function main(): Promise<void> {
  const fileNames = await FastGlob(normalize(`./manifests/**/**`));
  // console.log(fileNames);
  const navItems = fileNames.map(
    async (fileName: string): Promise<NavigationItem | undefined> => {
      const file = await readFile(fileName);

      if (file) {
        const document = new JSDOM(file).window.document;

        const navItem = new NavigationItem();

        const textElem = document.querySelector('header h1');
        const dataUri = document.querySelector('[data-uri]');
        if (dataUri) {
          const urlStart = (dataUri.getAttribute('data-uri') as string).split(
            '/',
          )[2];

          Array.from(document.querySelectorAll('a[href]'))
            .filter(
              (a: HTMLAnchorElement): boolean => {
                return !a.href.includes('/');
              },
            )
            .map(
              (a: HTMLAnchorElement): void => {
                a.href = `${urlStart}/${a.href}`;
              },
            );
        }
        navItem.title =
          textElem && textElem.textContent ? textElem.textContent : '';

        const manifestElement = document.querySelector('nav.manifest');

        if (manifestElement) {
          navItem.navItems = getChildNavigation(manifestElement);
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
