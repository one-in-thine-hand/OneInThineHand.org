import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

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

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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
    ChapterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
