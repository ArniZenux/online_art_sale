import { sqlite3 } from "sqlite3";

async function openDb() {
  // Open a database connection
  const db = await sqlite.open({
    filename: './onlineART.db',  // Path to the SQLite file
    driver: sqlite3.Database
  });

  // Example: Create a table if it doesn't exist
  await db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)`);

  // Example: Insert data
  await db.run('INSERT INTO users (name, age) VALUES (?, ?)', ['Alice', 30]);

  // Example: Query data
  const rows = await db.all('SELECT * FROM users');
  console.log(rows);

  // Close the database connection
  await db.close();
}
