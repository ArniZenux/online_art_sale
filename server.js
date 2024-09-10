import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParse from 'body-parser';

const dbFile = './onlineART.db';
const port = 3000;

const app = express();
app.use(cors());

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

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
  User
*/
app.get('/user', (req, res) => {
  res.render('user');
});

/* 
  Admin
*/
app.get('/admin', (req, res) => {
  res.render('admin');
});

/*
  Edit - Admin View
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

/*
  Add - Admin View
*/
app.get('/addArt', (req, res) => {
  res.render('addArt');
});

app.post('/addNewArt', (req, res) => {
  const {name, price, year, artist} = req.body; 
  const width = 100;
  const height = 100;  
  const sql = 'INSERT INTO tblArt (name, price, year, height, width, artist) VALUES (?,?,?,?,?,?)';
  console.log(name, price, year, artist); 
  //res.redirect('/');
  db.run(sql, [name, price, year, height, width, artist], (err) => {
    if(err) {
      return res.render('/'); 
    }
    res.redirect('/edit');
  })
});

/*
  Delete art - Admin View
*/
app.get('/deleteArt/:id', (req, res) => {
  const { id } = req.params; 
  const sql = 'DELETE FROM tblArt WHERE id = ?';
  //console.log(id);
  db.run(sql, id, (err) => {
    if(err){
      return console.error(err.message); 
    }
    console.log(`Art with ID ${id} deleted`);
    res.redirect('/edit');
  });
});

/*
  Update Art - Admin View 
*/
app.get('/update/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM tblArt WHERE id = ?';

  db.get(sql, [id], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    if (rows) {
      res.render('updateArt', { arts: rows }); // Pass current user data to the form
      //console.log(rows);
    } else {
      res.status(404).send('Art Id not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});