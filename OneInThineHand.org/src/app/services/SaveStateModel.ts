import { ReferenceLabels } from '../../../../shared/src/models/notes/Note';

export class RefLabelSetting {
  public visible: boolean;
  public refLabelName: string;
  public refLabelShortName: string;
}

export class SaveStateModel {
  public navigationPaneToggle: boolean = true;
  public notesPaneToggle: boolean = true;
  public paragraphsVisible = false;
  public poetryVisible = false;
  public secondaryNotesVisible = false;
  public englishNotesVisible = false;
  public newNotesVisible = false;
  public translatorNotesVisible = true;
  public fontSize = '16';
  public language: string;
  public lineHeight = '20';
  public refLabelSettings: RefLabelSetting[] = [];
  public underLineRefs: boolean = true;
  public ReferenceLabelSetting = ReferenceLabels;
}

export const refLabelSettingsTemplate = [
  { visible: true, refLabelName: 'Quotation', refLabelShortName: 'QUO' },
  { visible: true, refLabelName: 'Phrasing', refLabelShortName: 'PHR' },
  { visible: true, refLabelName: 'OR', refLabelShortName: 'OR' },
  { visible: true, refLabelName: 'IE', refLabelShortName: 'IE' },
  { visible: true, refLabelName: 'Hebrew', refLabelShortName: 'HEB' },
  { visible: true, refLabelName: 'Greek', refLabelShortName: 'GR' },
  { visible: true, refLabelName: 'Archaic', refLabelShortName: 'KJV' },
  { visible: true, refLabelName: 'Historical', refLabelShortName: 'HST' },
  { visible: true, refLabelName: 'CR', refLabelShortName: 'CR' },
  { visible: true, refLabelName: 'Alt', refLabelShortName: 'ALT' },
  { visible: true, refLabelName: 'Harmony', refLabelShortName: 'HMY' },
  { visible: true, refLabelName: 'TG', refLabelShortName: 'TG' },
  { visible: true, refLabelName: 'GS', refLabelShortName: 'GS' },
];
