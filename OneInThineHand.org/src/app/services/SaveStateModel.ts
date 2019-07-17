// import {
//   // ReferenceLabels,
//   NoteTypeConvert,
//   NoteTypeConverts,
// } from '../../../../shared/src/shared';
import { NOTE_CATEGORIES } from '../models/verse-notes';
import { NoteTypeConverts } from '../../../../shared/src/shared';

export class RefLabelSetting {
  public refLabelName: string;
  public refLabelShortName: string;
  public visible: boolean;
}

export class SaveStateModel {
  public blockVisible = false;
  public editMode = false;
  public englishNotesVisible = false;
  public englishOverlayVisible = false;
  public existingNotesVisible: boolean | undefined;
  public fontSize = '16';
  public language: string;
  public lineHeight = '20';
  public navigationMobilePaneToggle = false;
  public navigationPaneToggle = true;
  public newNotesVisible = false;
  public noteCategorySettings = NOTE_CATEGORIES;
  public notesPaneToggle = true;
  public noteTypeSettings = NoteTypeConverts;
  public paragraphsVisible = false;
  public poetryVisible = false;
  public printNotesVisible: boolean | undefined;
  // public ReferenceLabelSetting = ReferenceLabels;
  public refLabelSettings: RefLabelSetting[] = [];
  public secondaryNotesVisible = false;
  public tcNotesVisible: boolean | undefined;
  public testOverlayVisible: boolean | undefined;
  public translationOverlayVisible: boolean | undefined;
  public translatorNotesVisible = true;
  public underLineRefs = true;
  public version = 5;
}

// export const refLabelSettingsTemplate = [
//   { visible: true, refLabelName: 'Quotation', refLabelShortName: 'QUO' },
//   { visible: true, refLabelName: 'Phrasing', refLabelShortName: 'PHR' },
//   { visible: true, refLabelName: 'OR', refLabelShortName: 'OR' },
//   { visible: true, refLabelName: 'IE', refLabelShortName: 'IE' },
//   { visible: true, refLabelName: 'Hebrew', refLabelShortName: 'HEB' },
//   { visible: true, refLabelName: 'Greek', refLabelShortName: 'GR' },
//   { visible: true, refLabelName: 'Archaic', refLabelShortName: 'KJV' },
//   { visible: true, refLabelName: 'Historical', refLabelShortName: 'HST' },
//   { visible: true, refLabelName: 'CR', refLabelShortName: 'CR' },
//   { visible: true, refLabelName: 'Alt', refLabelShortName: 'ALT' },
//   { visible: true, refLabelName: 'Harmony', refLabelShortName: 'HMY' },
//   { visible: true, refLabelName: 'TG', refLabelShortName: 'TG' },
//   { visible: true, refLabelName: 'GS', refLabelShortName: 'GS' },
// ];
