// import {
//   // ReferenceLabels,
//   NoteTypeConvert,
//   NoteTypeConverts,
// } from '../../../../shared/src/shared';
import { NoteTypes, NoteCategories } from '../models/verse-notes';
import { NoteTypeConverts } from '../../../../shared/src/shared';
import { NoteVisiblityBtn } from './NoteVisiblityBtn';

export class RefLabelSetting {
  public refLabelName: string;
  public refLabelShortName: string;
  public visible: boolean;
}

export class SaveStateModel {
  public alt = new NoteVisiblityBtn();
  public bd = new NoteVisiblityBtn();
  public blockVisible = false;
  public cr = new NoteVisiblityBtn();
  public debugMode = false;
  public editMode = false;
  public englishNotesVisible = false;
  public englishOverlayVisible = false;
  public existingNotesVisible: boolean | undefined;
  public fontSize = '16';
  public geo = new NoteVisiblityBtn();
  public geoMore = new NoteVisiblityBtn();
  public gr = new NoteVisiblityBtn();
  public gs = new NoteVisiblityBtn();
  public heb = new NoteVisiblityBtn();
  public hmy = new NoteVisiblityBtn();
  public hst = new NoteVisiblityBtn();
  public hstMore = new NoteVisiblityBtn();
  public ie = new NoteVisiblityBtn();
  public language: string;
  public lineHeight = '20';
  public navigationMobilePaneToggle = false;
  public navigationPaneToggle = true;
  public newNotesVisible = false;
  // public noteCategorySettings = NOTE_CATEGORIES;
  public noteCategories: NoteCategories;
  public notesPaneToggle = true;
  public noteTypes?: NoteTypes;
  public noteTypeSettings = NoteTypeConverts;
  public or = new NoteVisiblityBtn();
  public orMore = new NoteVisiblityBtn();
  public paragraphsVisible = false;
  public phr = new NoteVisiblityBtn();
  public phrMore = new NoteVisiblityBtn();
  public poetryVisible = false;
  public printNotesVisible: boolean | undefined;
  public pronunciation = new NoteVisiblityBtn();
  public pronunciationMore = new NoteVisiblityBtn();
  public pronunciationVisible = false;
  public quo = new NoteVisiblityBtn();
  public quoMore = new NoteVisiblityBtn();

  // public ReferenceLabelSetting = ReferenceLabels;
  public refLabelSettings: RefLabelSetting[] = [];
  public secondaryNotesVisible = false;
  public tcNotesVisible: boolean | undefined;
  public testOverlayVisible: boolean | undefined;
  public tg = new NoteVisiblityBtn();
  public translationOverlayVisible: boolean | undefined;
  public translatorNotesVisible = true;
  public trn = new NoteVisiblityBtn();
  public trnMore = new NoteVisiblityBtn();
  public underLineRefs = true;
  public version = 5;
}
