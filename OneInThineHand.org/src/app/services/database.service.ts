import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public constructor() {}
  // public PouchDB = require('pouchdb');
  private db = new PouchDB(`${window.location.hostname}-oneinthinehand-org`);

  public async updateDatabaseItem(item: {
    _id: string;
    _rev: string | undefined;
  }): Promise<void> {
    try {
      const dbItem = await this.db.get(item._id);
      item._rev = dbItem._rev;
      console.log(dbItem);
    } catch (error) {
      console.log(error);
    }
    this.db.put(item);

    // console.log(this.db);
  }

  public async getDatabaseItem(
    _id: string,
  ): Promise<{ _id: string; _rev: string }> {
    return await this.db.get(_id);
  }
}
