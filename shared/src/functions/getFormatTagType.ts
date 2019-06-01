import { formatTagTypeOptions } from '../constants/verse-selectors';
import { FormatTagType, FormatTagTypeOptions } from '../enums/enums';
export function getFormatTagType(
  formatType: FormatTagType
): FormatTagTypeOptions | undefined {
  return formatTagTypeOptions.find(
    (f): boolean => {
      return f.formatTagType === formatType;
    }
  );
}

export function getFormatTagTypeFromNode(node: Node): FormatTagType[] {
  try {
    const classList = Array.from((node as Element).classList);
    return classList
      .map(
        (cl): FormatTagType | undefined => {
          const fOptions = formatTagTypeOptions.find(
            (f): boolean => {
              return f.className === cl;
            }
          );
          return fOptions ? fOptions.formatTagType : undefined;
        }
      )
      .filter(
        (f): boolean => {
          return f !== undefined;
        }
      ) as FormatTagType[];
  } catch (error) {
    return [];
  }
}
