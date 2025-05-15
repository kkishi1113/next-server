// scripts/setupDb.ts
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const FILE_NAME = './db2.sqlite'; // SQLite DBのファイル名

async function initDb() {
  const db = await open({
    filename: FILE_NAME, // パス修正（実行位置による）
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      domain TEXT NOT NULL,
      thumbnail TEXT,
      archived BOOLEAN NOT NULL DEFAULT 0
    );
  `);

  console.log('Database initialized successfully');
}

initDb().catch((error) => {
  console.error('Error initializing database:', error);
});
