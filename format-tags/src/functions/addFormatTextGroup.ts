import { FormatGroup } from '../models/format_groups/FormatGroup';
import {
  FormatGroupText,
  FormatGroupBR,
  FormatGroupPageBreak,
} from '../models/format_groups/FormatGroupText';
import { queryChildNodes } from './queryChildNodes';
import formatGroupSelectors from './formatGroupSelectors';
import { FormatGroupRuby } from '../models/format_groups/FormatGroupRuby';
import { FormatGroupRubyA } from '../models/format_groups/FormatGroupRubyA';
import { FormatGroupA } from '../models/format_groups/FormatGroupA';

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

  formatGroup.compressedOffsets = [[count, endCount]];
  formatGroup.classList = undefined;
  formatGroups.push(formatGroup);
  return endCount;
}

function nodeToFormatGroup(
  node: Node,
  formatGroups: FormatGroup[],
  count: number,
): number {
  let formatGroup: FormatGroup;
  switch (node.nodeName) {
    case 'BR': {
      formatGroup = new FormatGroupBR();
      formatGroups.push(formatGroup);
      return count;
    }
    case 'RUBY': {
      formatGroup = new FormatGroupRuby();
      throw 'Ruby has not been implemented yet';
      break;
    }
    case 'A': {
      if ((node as Element).querySelectorAll('ruby').length > 0) {
        formatGroup = new FormatGroupRubyA();
        throw 'Ruby has not been implemented yet';
      } else {
        formatGroup = new FormatGroupA();
      }

      (formatGroup as FormatGroupA).href = (node as HTMLLinkElement).href;
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
        throw 'Unknown FormatGroup detected';
      }

      break;
    }
  }

  let textContent = node.textContent ? node.textContent : '';
  let endCount = count + textContent.length;
  formatGroup.compressedOffsets = [[count, endCount]];

  formatGroups.push(formatGroup);
  return endCount;
}

// Runs through the child nodes of a verse and groups them into their FormatGroups
export async function parseFormatGroups(
  verseElement: Element,
  formatGroups: FormatGroup[],
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

        count = nodeToFormatGroup(childNode, formatGroups, count);
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

  formatGroup.compressedOffsets = [[0, textContent ? textContent.length : 0]];
  formatGroup.classList = undefined;
  formatGroups.push(formatGroup);
}
