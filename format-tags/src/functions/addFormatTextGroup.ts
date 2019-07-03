import {
  FormatGroupText,
  FormatGroup,
  FormatGroupBR,
  FormatGroupRuby,
  FormatGroupRubyA,
  FormatGroupA,
  FormatGroupPageBreak,
  Verse,
} from '../../../shared/src/shared';
import formatGroupSelectors from './formatGroupSelectors';
import { queryChildNodes } from './queryChildNodes';
import {
  FormatGroupSegment,
  FormatGroupPart,
} from '../../../shared/src/models/format_groups/FormatGroup';

function nodesToTextGroup(
  nodes: Node[],
  formatGroups: FormatGroup[],
  count: number,
): number {
  const formatGroup = new FormatGroupText();
  let textContent = '';
  (nodes as Element[]).map(
    (element): void => {
      textContent = `${textContent}${
        element.textContent ? element.textContent : ''
      }`;
    },
  );

  const endCount = textContent ? count + textContent.length : count;

  formatGroup.offsets = `${count}-${endCount}`;
  formatGroup.classList = undefined;
  formatGroups.push(formatGroup);
  return endCount;
}

export function getKJVRef(node: Node, verseID?: string): string[] | undefined {
  const kjvRef = (node as Element).getAttribute('kjvRef');
  if (!kjvRef && verseID) {
    return [verseID.replace('fra', 'eng')];
  } else if (kjvRef && verseID) {
    const temp = verseID.split('-');
    return kjvRef.split('-').map(
      (kjv): string => {
        const splitKJVRef = kjv.split(':');
        const newID = `eng-${temp[1]}-${splitKJVRef[0]}-${
          splitKJVRef[1]
        }-verse`;
        return newID;
      },
    );
  }
  return undefined;
  // return kjvRef && verseID ? verseID.replace('fra', 'eng') : undefined;
}

function nodeToFormatGroup(
  node: Node,
  formatGroups: FormatGroup[],
  count: number,
  verseID?: string,
): number {
  let formatGroup: FormatGroup;
  switch (node.nodeName.toLowerCase()) {
    case 'br': {
      formatGroup = new FormatGroupBR();
      formatGroups.push(formatGroup);
      return count;
    }
    case 'ruby': {
      formatGroup = new FormatGroupRuby();
      throw new Error('Ruby has not been implemented yet');
      break;
    }
    case 'a': {
      if ((node as Element).querySelectorAll('ruby').length > 0) {
        formatGroup = new FormatGroupRubyA();
        throw new Error('Ruby has not been implemented yet');
      } else {
        formatGroup = new FormatGroupA();
      }

      (formatGroup as FormatGroupA).href = (node as HTMLLinkElement).href;
      break;
    }
    case 'segment': {
      formatGroup = new FormatGroupSegment();
      (formatGroup as FormatGroupSegment).kjvRef = getKJVRef(node, verseID);
      formatGroups.push(formatGroup);

      break;
    }
    case 'part': {
      formatGroup = new FormatGroupPart();
      (formatGroup as FormatGroupPart).kjvRef = getKJVRef(node, verseID);
      formatGroups.push(formatGroup);
      break;
    }
    default: {
      if (
        (node as Element).classList &&
        (node as Element).classList.contains('page-break')
      ) {
        formatGroups.push(new FormatGroupPageBreak());
        return count;
      } else {
        // console.log(node);

        throw new Error('Unknown FormatGroup detected');
      }

      break;
    }
  }

  let textContent = node.textContent ? node.textContent : '';
  let endCount = count + textContent.length;
  formatGroup.offsets = `${count}-${endCount}`;

  if (
    !formatGroups.find(
      (fGroup): boolean => {
        return (
          fGroup.offsets !== undefined && fGroup.offsets === formatGroup.offsets
        );
      },
    )
  ) {
    formatGroups.push(formatGroup);
  }
  return endCount;
}

// Runs through the child nodes of a verse and groups them into their FormatGroups
export async function parseFormatGroups(
  verseElement: Element,
  formatGroups: FormatGroup[],
  verse: Verse,
): Promise<void> {
  const breakPoints = Array.from(
    verseElement.querySelectorAll(formatGroupSelectors),
  );
  let formatTextGroup: Node[] | undefined;
  let count = 0;

  const childNodes = await queryChildNodes(verseElement);

  childNodes.map(
    (childNode): void => {
      if (breakPoints.includes(childNode as Element)) {
        if (formatTextGroup !== undefined) {
          count = nodesToTextGroup(formatTextGroup, formatGroups, count);

          formatTextGroup = undefined;
        }

        count = nodeToFormatGroup(childNode, formatGroups, count, verse._id);
      } else {
        if (formatTextGroup === undefined) {
          formatTextGroup = [];
        }
        formatTextGroup.push(childNode);
      }
    },
  );

  if (formatTextGroup !== undefined) {
    nodesToTextGroup(formatTextGroup, formatGroups, count);

    formatTextGroup = undefined;
  }
}

// Used when a whole verse can be represented by one FormatTextGroup
export function verseToFormatTextGroup(
  verseElement: Element,
  formatGroups: FormatGroup[],
): void {
  // let count = 0;
  // Array.from(document.querySelector('#p14').childNodes).map((childNode)=>{
  //

  // })
  const formatGroup = new FormatGroupText();
  let textContent = '';
  textContent = verseElement.textContent ? verseElement.textContent : '';

  formatGroup.offsets = `0-${textContent ? textContent.length : 0}`;
  formatGroup.classList = undefined;
  formatGroups.push(formatGroup);
}
