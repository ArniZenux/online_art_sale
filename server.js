import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParse from 'body-parser';
import { ad_safna_ollum_append } from './utils/utils.js';
import * as fs from 'fs';

// assignment 6 
//import { Jwt } from 'jsonwebtoken';
import session from 'express-session';
import bcrypt from 'bcrypt';

import rateLimit from 'express-rate-limit';
import passwordSchema from 'password-validator';

const dbFile2 = './data/onlineSchool.db';
const logData = './var/logToFile.json';

const port = 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }  // 1-minute session cookie
}));

const z_user = [
  { 
    username: 'Arni', 
    password: '$2b$10$vQVp1xtKqL2PaoYinOzmbe27JSyX7eFvq8oJyXW.8j7sT.KN9ZFOm' // 123
  }
];  // Password should be hashed 

const loginLimier = rateLimit( {  
  windowMs: 1 * 60 * 1000, // 1 min  
  max: 5, // limit to 5 attemts
  message: 'Too many attempts.... wait and try again after 1 minutes..' 
});

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
    res.render('index', { arts: rows, data: _jsonData, user: req.session.user } );
  });
});

/*
  About - Content View
*/ 
app.get('/about', (req, res) => {
  //ad_safna_ollum_append('about'); 
  res.render('about', {user: req.session.user});
});

/* 
  User
*/
app.get('/user', (req, res) => {
  const _jsonData = getUserName();
  //console.log(_jsonData.password); 
  res.render('user', {arts: _jsonData, user: req.session.user});
});

/*
  Edit - Admin View
*/
app.get('/edit', (req, res ) => {
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
    res.render('edit', { arts: rows, user: req.session.user });
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
    res.render('addArt', { teacher: rows , user: req.session.user});
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

  db.run(sql_course, [courseID, title, start_dagur, last_dagur, price], (err) => {
    if(err) {
      return console.error(err.message);  
    }
    db.run(sql_teach, [idteacher, courseID], (err) => {
      if(err) {
        return console.error(err.message); 
      }
    });
    
    ad_safna_ollum_append('Admin - Add New Course'); // admin page 

    res.redirect('/edit');
  });
});

/*
  Delete  - Admin View
*/
app.get('/deleteArt/:id', (req, res) => {
  const { id } = req.params; 
  const sql_course = `
    DELETE FROM tblCourse 
    WHERE tblCourse.id = ?
  `;

  db.run(sql_course, id, (err) => {
    if(err){
      return console.error(err.message); 
    }

    ad_safna_ollum_append(`Admin - Delete Course`); // admin page

    res.redirect('/edit');
  });
});

/*
  Update  - Admin View 
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
    } else {
      res.status(404).send('Coruse ID not found');
    }
  });
});

/*
  Update POST - Admin View 
*/
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

  db.run(sql_course_update, [title, start_dagur, last_dagur, price, courseID], (err) => {
    if(err){
      return console.error(err.message); 
    }
    db.run(sql_teach_update, [idteacher, courseID], (err) => {
      if(err) {
        return console.error(err.message); 
      }
    });
    
    ad_safna_ollum_append(`Admin - Update Course`); // admin page
    
    res.redirect('/');
  });
});

/* 
  Admin
*/
app.get('/admin', (req, res) => {
  fs.readFile(logData, 'utf8', (err, data) => {
    if(err){
      console.error(`Error reading Log File:`, err);
      return res.status(500).send(`Error reading Log File`);
    }
    const jsonLogData = JSON.parse(data);

    res.render('admin', { users: jsonLogData.users, user: req.session.user });  
  });
});


/*
  Login GET - Server.js 
*/
app.get('/login', (req, res) =>  {
  const message = '';  // Error message (brute-force, weak password )
  res.render('login', { user: req.session.user, error_msg : message}); 
});

/*
  Register GET - Server.js
*/
app.get('/register', (req, res) => {
  const message = '';   // Error message (brute-force, weak password ) 
  res.render('register', {user: req.session.user, error_msg : message});
});

/*
  Logout GET  - Server.js 
*/
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

/*
  Login POST - Server.js
*/
app.post('/login', loginLimier, async (req, res) => {
  const { username, password } = req.body;
  
  console.log('Notandi: ', username);
  console.log('Password: ', password); 

  const user = z_user.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password) ) {
      req.session.user = user;
      return res.redirect('/');
  }
  res.redirect('/login');
});

/*
  Register POST - Server.js 
*/
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const schema = new passwordSchema();
  schema
    .is().min(3)
    .is().max(5)
    .has().uppercase()                             // Must have uppercase letters
    .has().lowercase()                             // Must have lowercase letters
    .has().digits(1)                               // Must have at least 2 digits
    .has().not().spaces()                          // Should not have spaces
  
  if(!schema.validate(password)){
    console.log('Nah nha password is not strong enough');
  } else {
    console.log('Strong');
  }
  const message = 'Password is not strong enough';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Notandi: ', username);
  console.log('Password: ', hashedPassword); 

  z_user.push( {username, password: hashedPassword});
  ad_safna_ollum_append('New User registerd');
  console.log('User registered successfully');
  
  res.redirect('/',);    
  
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});