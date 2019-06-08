import { Component, OnInit, Input } from '@angular/core';
import { FMerged } from '../../../../../shared/src/models/format_tags/FormatTag';
import {
  Optional,
  formatTagTypeOptions,
  DisplayAs,
} from '../../../../../shared/src/shared';
import { MarkService } from '../../services/mark.service';

@Component({
  selector: 'app-format-tag',
  templateUrl: './format-tag.component.html',
  styleUrls: ['./format-tag.component.scss'],
})
export class FormatTagComponent implements OnInit {
  @Input() public fMerged: FMerged;
  public constructor(public markService: MarkService) {}

  public ngOnInit(): void {}

  public getText(): string {
    const text = this.fMerged.text;
    if (this.fMerged.formatTags && this.fMerged.formatTags.length > 0) {
      const richFormatTags = this.fMerged.formatTags.filter(
        (f): boolean => {
          return (
            f.displayAs === DisplayAs.RICHTEXT && f.optional !== Optional.NEVER
          );
        },
      );
      // .map(
      //   (f): void => {
      //     console.log(f);
      //   },
      // );
      // console.log('oiasjdfoiajsdfoiasjdfoi');

      return this.markService.getFormatTagRichText(
        this.fMerged.text,
        richFormatTags,
      );
      return text;
    }
    return text;
  }

  public getClassList(): string {
    const classList: string[] = [];
    if (this.fMerged.refTags) {
      console.log(this.fMerged.refTags);
    }
    if (this.fMerged.formatTags && this.fMerged.formatTags.length > 0) {
      this.fMerged.formatTags
        .filter(
          (f): boolean => {
            return (
              f.displayAs === DisplayAs.CLASS && f.optional !== Optional.NEVER
            );
          },
        )
        .map(
          (f): void => {
            const fTO = formatTagTypeOptions.find(
              (formatTagOption): boolean => {
                return formatTagOption.formatTagType === f.formatType;
              },
            );
            console.log(fTO ? fTO.className : 'Nothing');
            if (fTO && fTO.className) {
              classList.push(fTO.className);
            }
          },
        );

      console.log();
    }
    return classList.toString().replace(/,/s, ' ');
  }
}
