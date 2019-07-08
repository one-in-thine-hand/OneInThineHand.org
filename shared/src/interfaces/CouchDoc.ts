export interface CouchDocGet {
  id: string;
  rev: string;
}

export interface CouchDoc {
  _id: string;
  _rev?: string;
}
