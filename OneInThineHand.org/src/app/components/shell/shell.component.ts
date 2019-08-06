import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, map, flatMap, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { Shell } from '../../models/shells';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  public constructor(
    public aRoute: ActivatedRoute,
    public databaseService: DatabaseService,
  ) {}
  public ngOnInit(): void {
    // this.aRoute.params
    //   .pipe(
    //     o => this.parseParams(o),
    //     o => this.getShell(o),
    //   )
    //   .subscribe(
    //     async (o): Promise<void> => {
    //       console.log(o);
    //     },
    //   );
  }

  private parseParams(params$: Observable<Params>): Observable<string> {
    return params$.pipe(
      map((params): string => {
        return `eng-${params['book']}-${params['chapter']}-${params['shell']}`;
      }),
    );
  }

  // private getShell(id$: Observable<string>): Observable<Shell> {
  //   return id$.pipe(
  //     map(
  //       async (id): Promise<Shell | undefined> => {
  //         const db = this.databaseService.getDb();
  //         console.log(db);

  //         try {
  //           const d = (await db.get(id)) as Shell;

  //           return d;
  //         } catch (error) {
  //           return undefined;
  //         }
  //       },
  //       mergeMap(
  //         (
  //           o: Observable<Promise<Shell | undefined>>,
  //         ): Promise<Observable<Promise<Shell | undefined>>> => {
  //           return o;
  //         },
  //       ),
  //       map(o => o),
  //     ),
  //   );
  // }
}
