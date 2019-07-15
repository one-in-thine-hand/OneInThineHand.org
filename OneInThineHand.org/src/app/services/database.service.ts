import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import { CouchDocGet, CouchDoc } from '../../../../shared/src/shared';
import { isEqual } from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public constructor() {}
  // public PouchDB = require('pouchdb');
  private db: PouchDB.Database<{}> | undefined;
  /**
   * allDocs
   */
  public async allDocs(): Promise<
    PouchDB.Core.AllDocsResponse<{}> | undefined
  > {
    if (this.db) {
      return await this.db.allDocs();
    }
  }

  public async bulkDocs(items: DatabaseItem[]): Promise<void> {
    if (!this.db) {
      this.initReadingMode();
    }
    if (this.db) {
      // const docs = await this.db.allDocs();

      // docs.rows.map((doc): void => {
      //   const item = items.find((item): boolean => {
      //     return item._id === doc.id;
      //   });
      //   if (item) {
      //     item._rev = doc.value.rev;
      //   }
      // });

      await this.db.bulkDocs(items);
    }
  }
  public async bulkGet(
    ids: CouchDocGet[],
  ): Promise<PouchDB.Core.BulkGetResponse<{}> | undefined> {
    try {
      if (this.db) {
        return await this.db.bulkGet({ docs: ids });
      }
    } catch (error) {}
    return undefined;
  }

  /**
   * bulkGetByIDs
   */
  public async bulkGetByIDs<T>(ids: string[]): Promise<T[]> {
    if (!this.db) {
      this.initReadingMode();
    }
    const docsIDs = ids.map(
      (id): CouchDocGet => {
        return { id: id, rev: '' };
      },
    );

    if (this.db) {
      const docs = await this.db.bulkGet({ docs: docsIDs });
      return (docs.results
        .map((result): DatabaseItem | undefined => {
          try {
            return (result.docs[0] as any).ok;
          } catch (error) {}
          return undefined;
        })
        .filter((d): boolean => {
          return d !== undefined;
        }) as any[]) as T[];
    }
    return [];
  }
  public async getDatabaseItem(
    _id: string,
  ): Promise<{ _id: string; _rev: string } | undefined> {
    if (this.db) {
      return await this.db.get(_id);
    }
  }

  public initReadingMode(): void {
    if (this.db === undefined) {
      this.db = new PouchDB(`${window.location.hostname}-oneinthinehand-org`);
    }
  }
  public async setDocsRev(
    docs: CouchDoc[],
    allDocs: PouchDB.Core.AllDocsResponse<{}> | undefined,
  ): Promise<void> {
    if (allDocs) {
      docs.map((doc): void => {
        const savedDoc = allDocs.rows.find((d): boolean => {
          return doc._id === d.id;
        });
        doc._rev = savedDoc ? savedDoc.value.rev : undefined;
      });
    } else {
      docs.map((doc): void => {
        doc._rev = undefined;
      });
    }
  }

  public async updateDatabaseItem(item: {
    _id: string;
    _rev: string | undefined;
  }): Promise<void> {
    if (this.db) {
      try {
        const dbItem = await this.db.get(item._id, {});

        item._rev = dbItem._rev;
        // console.log(dbItem);
      } catch (error) {
        console.log(error);
      }
      // console.log(item);

      await this.db.put(item);

      // console.log(this.db);
    }
  }
  public async updateDatabaseItems(
    items: {
      _id?: string;
      _rev?: string;
    }[],
  ): Promise<void> {
    if (this.db) {
      try {
        const docs = await this.db.allDocs();

        items.map((item): void => {
          const r = docs.rows.find((row): boolean => {
            return row.id === item._id;
          });
          item._rev = r ? r.value.rev : '';
        });
        await this.db.bulkDocs(items);
      } catch (error) {
        console.log(error);
      }
      // console.log(item);

      // console.log(this.db);
    }
  }
}

export interface DatabaseItem {
  _id: string;
  _rev: string | undefined;
}
