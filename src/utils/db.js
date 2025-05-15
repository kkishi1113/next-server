import sqlite3 from 'sqlite3';
import { open } from 'sqlite3';

export async function openDb() {
  return open({
    filename: `../db.sqlite`,
    driver: sqlite3.Database,
  });
}
