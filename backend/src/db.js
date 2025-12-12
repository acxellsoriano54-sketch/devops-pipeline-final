const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "data.sqlite");

const db = new sqlite3.Database(dbPath);

function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM items ORDER BY id DESC", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function createItem(title) {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();
    db.run(
      "INSERT INTO items(title, created_at) VALUES(?, ?)",
      [title, createdAt],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, title, created_at: createdAt });
      }
    );
  });
}

function deleteItem(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve({ deleted: this.changes });
    });
  });
}

module.exports = { db, initDb, getAllItems, createItem, deleteItem, dbPath };
