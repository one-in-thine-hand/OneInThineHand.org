import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { VerseComponent } from './components/verse/verse.component';
import { FormatTagComponent } from './components/format-tag/format-tag.component';
import { FormatGroupComponent } from './components/format-group/format-group.component';
import { BodyBlockComponent } from './components/body-block/body-block.component';
import { NoteComponent } from './components/note/note.component';
import { SecondaryNoteComponent } from './components/secondary-note/secondary-note.component';
import { NotePhraseComponent } from './components/note-phrase/note-phrase.component';
import { NoteRefComponent } from './components/note-ref/note-ref.component';
import { ParagraphComponent } from './components/paragraph/paragraph.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ContentComponent } from './components/content/content.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { SaveStateService } from './services/save-state.service';
import { HeaderDropdownComponent } from './components/header-dropdown/header-dropdown.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PreprocessorService } from './services/preprocessor.service';
import { PageStateService } from './services/page-state.service';
import { AddNoteComponent } from './components/add-note/add-note.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function load(saveStateService: SaveStateService): () => Promise<void> {
  return async (): Promise<void> => {
    await saveStateService.load();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    VerseComponent,
    FormatTagComponent,
    FormatGroupComponent,
    BodyBlockComponent,
    NoteComponent,
    SecondaryNoteComponent,
    NotePhraseComponent,
    NoteRefComponent,
    ParagraphComponent,
    HeaderComponent,
    NavigationComponent,
    ContentComponent,
    ChapterComponent,
    HeaderDropdownComponent,
    LandingPageComponent,
    AddNoteComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    ElectronService,
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [SaveStateService],
      multi: true,
    },
    SaveStateService,
    PreprocessorService,
    PageStateService,
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
