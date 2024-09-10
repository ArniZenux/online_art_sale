import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';

const dbFile = './onlineART.db';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

let db = new sqlite3.Database('./onlineART.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

/*
  Index - Content View
*/
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM tblArt';
  db.all(sql, [], (err, rows) => {
    if(err) {
      return console.error(err.message);
    }
    res.render('index', { arts: rows });
  });
});

/*
  About - Content View
*/
app.get('/about', (req, res) => {
  res.render('about');
});

/*
  Edit - Content View
*/
app.get('/edit', (req, res ) => {
  const sql = 'SELECT * FROM tblArt';
  db.all(sql, [], (err, rows) => {
    if(err) {
      return console.error(err.message);
    }
    res.render('edit', { arts: rows });
  });
});

/* User*/
app.get('/user', (req, res) => {
  res.render('user');
});

/* Admin */
app.get('/admin', (req, res) => {
  res.render('admin');
});

/*
  Update, Add, Delete - page
*/
app.get('/addArt', (req, res) => {
  res.render('addArt');
});

app.put('/add', (req, res) => {
  res.render('add');
});

app.post('/editArt', (req, res) => {
  res.send('Yes it change change ... online art sale');
});

app.delete('/deleteArt', (req, res) => {
  res.send('Bye bye User -- online art sale');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});