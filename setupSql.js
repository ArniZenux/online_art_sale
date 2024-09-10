import sqlite3 from 'sqlite3';
const dbFile = './onlineART.db';

async function makeAll() {

  let db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    return console.error(err.message);
  }
    console.log('Connected to the mydb SQLite database.');
  });

  // Create a new table called "users" if it doesn't exist
  db.exec(`CREATE TABLE IF NOT EXISTS tblArt (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price TEXT, year INTEGER, height INTEGER, width INTEGER, artist TEXT)`, 
  (err) => {
    if (err) {
      return console.error(err.message);
  }
  console.log('Users table created successfully.');
  });
  
  db.run(`INSERT INTO tblArt (name, price, year, height, width, artist) VALUES ('Flower of Sun','200.000','1945','100','80','Daria Kolosova')`);
  db.run(`INSERT INTO tblArt (name, price, year, height, width, artist) VALUES ('Money is Power','400.000','2023','200','100','Mikael Brandrup')`);
  db.run(`INSERT INTO tblArt (name, price, year, height, width, artist) VALUES ('Kaos is Power','200.000','2013','60','60','Mikael Brandrup')`);

  db.all(`SELECT * FROM tblArt`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log("Data in users table:");
    rows.forEach((row) => {
      console.log(`${row.id} | ${row.name} | ${row.year} | ${row.height} | ${row.width} | ${row.artist} `);
    });
  });
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
  
  console.info('All files are inserted');
  
}

makeAll().catch((err) => {
  console.error('Error inserting schema', err);
});