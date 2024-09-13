import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParse from 'body-parser';
import { ad_safna_ollum_append } from './utils/utils.js';

const dbFile2 = './data/onlineSchool.db';
const port = 3000;

const app = express();

app.use(cors());
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

let db = new sqlite3.Database(dbFile2, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

/*
  Index - Content View
*/
app.get('/', (req, res) => {
  const sql = `
  SELECT  nafn, title, start_dagur, last_dagur, price
  FROM    tblTeacher, tblTeach, tblCourse 
  WHERE   tblTeacher.teacherID == tblTeach.z_idTeacher 
  AND     tblTeach.z_idCourse == tblCourse.courseID;
  `;

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
  ad_safna_ollum_append('about'); 
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
  const sql_teacher = 'SELECT teacherID, nafn FROM tblTeacher;';
  const sql = 'SELECT * FROM tblCourse;';

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
  const sql_teacher = 'SELECT teacherID, nafn FROM tblTeacher;';
  db.all(sql_teacher, [], (err, rows) => {
    if(err) {
      return console.error(err.message);
    }
    res.render('addArt', { teacher: rows });
  });
});


app.post('/addNewArt', (req, res) => {
  const {courseID, title, start_dagur, last_dagur, price} = req.body; 
  const sql_course = `
    INSERT INTO 
    tblCourse(courseID, title, start_dagur, last_dagur, price) 
    VALUES(123, 'MATH 1', '10 september', '23 desember', '3000');
    `;
  console.log(courseID, title, start_dagur, last_dagur, price); 
  ad_safna_ollum_append('Add New Course'); 
  //res.redirect('/');
  db.run(sql_course, [courseID, title, start_dagur, last_dagur, price], (err) => {
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