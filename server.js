import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParse from 'body-parser';
import { ad_safna_ollum_append } from './utils/utils.js';
import * as fs from 'fs';
import { start } from 'repl';

const dbFile2 = './data/onlineSchool.db';
const logData = './var/logToFile.json';
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

function getUserName(){
  const jsonData = {
    name     :  'Anna Jona',
    password :  '1234'
  }
  return jsonData; 
}

/*
  Index - Content View
*/
app.get('/', (req, res) => {
  const _jsonData = getUserName();
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
    res.render('index', { arts: rows, data: _jsonData });
  });
});

/*
  About - Content View
*/ 
app.get('/about', (req, res) => {
  //ad_safna_ollum_append('about'); 
  res.render('about');
});

/* 
  User
*/
app.get('/user', (req, res) => {
  const _jsonData = getUserName();
  console.log(_jsonData.password); 
  res.render('user', {arts: _jsonData});
});

/* 
  Admin
*/
app.get('/admin', (req, res) => {
  res.render('admin');
  /*fs.readFile(logData, 'utf8', (err, data) => {
    if(err){
      console.error(`Error reading Log File:`, err);
      return res.status(500).send(`Error reading Log File`);
    }
    const jsonLogData = JSON.parse(data);
    console.log(jsonLogData);

    res.render('admin');
  });*/
});

/*
  Edit - Admin View
*/
app.get('/edit', (req, res ) => {
  //const sql_teacher = `SELECT teacherID, nafn FROM tblTeacher;`;
  //const sql = `SELECT * FROM tblCourse;`;
  const sql = `
    SELECT  tblCourse.id, nafn, title, start_dagur, last_dagur, price
    FROM    tblTeacher, tblTeach, tblCourse 
    WHERE   tblTeacher.teacherID == tblTeach.z_idTeacher 
    AND     tblTeach.z_idCourse == tblCourse.courseID;
  `; 
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
  const {courseID, title, price, start_dagur, last_dagur, idteacher} = req.body; 
  const sql_course = `
    INSERT INTO 
    tblCourse(courseID, title, start_dagur, last_dagur, price) 
    VALUES(?,?,?,?,?);
  `;

  const sql_teach = `
    INSERT INTO 
    tblTeach(z_idTeacher, z_idCourse) 
    VALUES(?,?); 
  `;

  console.log(courseID, title, start_dagur, last_dagur, price); 
  console.log(courseID,idteacher); 

  db.run(sql_course, [courseID, title, start_dagur, last_dagur, price], (err) => {
    if(err) {
      return console.error(err.message);  
    }
    db.run(sql_teach, [idteacher, courseID], (err) => {
      if(err) {
        return console.error(err.message); 
      }
    });
    ad_safna_ollum_append('Admin - Add New Course'); 
    res.redirect('/edit');
  });
});

/*
  Delete art - Admin View
*/
app.get('/deleteArt/:id', (req, res) => {
  const { id } = req.params; 
  const sql_course = `
    DELETE FROM tblCourse 
    WHERE tblCourse.id = ?
  `;
  //const sql_teach = 'DELETE FROM tblTeach WHERE tblTeach.z_idCourse = ?';
  db.run(sql_course, id, (err) => {
    if(err){
      return console.error(err.message); 
    }
    console.log(`Course with ID ${id} deleted`);
    ad_safna_ollum_append(`Delete Course ${id}`); 
    res.redirect('/edit');
  });
});

/*
  Update Art - Admin View 
*/
app.get('/update/:id', (req, res) => {
  const { id } = req.params;
  //const sql = 'SELECT * FROM tblCourse WHERE id = ?';
  const sql = `
    SELECT  nafn, courseID, title, start_dagur, last_dagur, price
    FROM    tblTeacher, tblTeach, tblCourse 
    WHERE   tblTeacher.teacherID == tblTeach.z_idTeacher 
    AND     tblTeach.z_idCourse == tblCourse.courseID
    AND     tblCourse.id = ?;   
  `; 
  db.get(sql, [id], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    if (rows) {
      res.render('updateArt', { art: rows }); // Pass current user data to the form
      ad_safna_ollum_append(`Update Course ${id}`);      
    } else {
      res.status(404).send('Coruse ID not found');
    }
  });
});

app.post('/updateCourse', (req, res) => {
  const {courseID, title, price, start_dagur, last_dagur, idteacher} = req.body; 
  const sql_course_update = `
    UPDATE  tblCourse
    SET     title = ?, start_dagur = ?, last_dagur = ?, price = ?
    WHERE   courseID = ?;
  `;
  const sql_teach_update = `
    UPDATE  tblTeach
    SET     z_idTeacher = ?
    WHERE   z_idCourse = ?;
  `;
  console.log(courseID, title, start_dagur, last_dagur, price);
  console.log(courseID, idteacher); 
  db.run(sql_course_update, [title, price, start_dagur, last_dagur, courseID], (err) => {
    if(err){
      return console.error(err.message); 
    }
    db.run(sql_teach_update, [idteacher, courseID], (err) => {
      if(err) {
        return console.error(err.message); 
      }
    });
    ad_safna_ollum_append(`Update Course ${courseID}`); 
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});