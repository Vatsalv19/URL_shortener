import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'urls.db');

let db;

export default function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        code       TEXT    NOT NULL UNIQUE,
        long_url   TEXT    NOT NULL,
        created_at TEXT    DEFAULT (datetime('now'))
      )
    `);
  }
  return db;
}
