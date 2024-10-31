import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';


// CSRF ///
import cookieParser from 'cookie-parser';
import bodyParse from 'body-parser';
import csurf from 'csurf';
///////////////////////////////////////////////

import session from 'express-session';
import bcrypt from 'bcrypt'; 
import * as fs from 'fs';
import dotenv from 'dotenv';   // session fixation 
import passwordSchema from 'password-validator';

import { ad_safna_ollum_append } from './utils/utils.js';
import { logger } from './utils/logger.js';
import { loginLimier } from './utils/ratelimit2.js';

const dbFile2 = './data/onlineSchool.db';
const logData = './var/logToFile.json';
let name = '';

dotenv.config();

const {
  PORT: port,
} = process.env;

const app = express();

// MiddleWares. 
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
      maxAge: 60000,
      secure: false
     }  
}));
// 1-minute session cookie and "secure" should be true in production with HTTPS

// CSRF stuff 
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(cookieParser()); // To parse cookies

// CSRF protection middleware
const csrfProtection = csurf({ cookie: {secure: true } });
app.use(csrfProtection);

app.use((req, res, next) => {
  if(!req.session.usertype){
    req.session.usertype = 'Guest';
  }
  res.locals.usertype = req.session.usertype;
  res.locals.csrfToken = req.csrfToken();
  next();
});

let db = new sqlite3.Database(dbFile2, (err) => {
  if (err) {
    logger.error(err.message);  // Info level logging
  }
  logger.info(`Connected to the SQLite database.`);
});

/*
  Index - Content View
*/
app.get('/', (req, res) => {
  /*if ( req.session.usertype !== 'Guest' ) {
    logger.info(`Index logging - Name: Guest`);
  } else {
    logger.info(`Index logging - Name: ${name}`);
    */
   res.render('index', {user: req.session.user, usertype: req.session.usertype});
  
});

/* 
  Head Teacher page
*/
app.get('/headteacher', (req, res) => {
  logger.info(`Head Teacher - Dashboard - Name: ${name}`);
  res.render('headteacher', {user: req.session.user, usertype: req.session.usertype});
});

/* 
  Teacher page
*/
app.get('/teacher', (req, res) => {
  logger.info(`Teacher - Dashboard - Name: ${name}`);
  res.render('teacher', {user: req.session.user, usertype: req.session.usertype});
});

/* 
  Student page
*/
app.get('/student', (req, res) => {
  logger.info(`Student - Dashboard - Name: ${name}`);
  res.render('student', {user: req.session.user, usertype: req.session.usertype});
});

/* 
  Guest page 
*/
app.get('/guest', (req, res) => {
  res.render('guest', {user: req.session.user, usertype: req.session.usertype});
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
  Login GET - Server.js with csrfProtect. 
  CSRF token is passed to the view/template, 
  in this case we're sending it as JSON
*/
app.get('/login',  (req, res) =>  {
  logger.info('GET / login accessed');  // Info level logging
  const message = '';  // Error message (brute-force, weak password )
  res.render('login', {csrfToken: req.csrfToken(), user: req.session.user, error_msg : message, usertype: req.session.usertype}); 
});

/*
  Register GET - Server.js
*/
app.get('/register', (req, res) => {
  logger.info('GET / Register accessed');  // Info level logging
  const message = '';   // Error message (brute-force, weak password ) 
  res.render('register', {user: req.session.user, error_msg : message, usertype: req.session.usertype});
});

/*
  Register GET - Server.js
*/
app.get('/registeradmin', (req, res) => {
  logger.info('GET / Register accessed');  // Info level logging
  const message = '';   // Error message (brute-force, weak password ) 
  res.render('registerAdmin', {user: req.session.user, error_msg : message, usertype: req.session.usertype});
});

/*
  Logout GET  - Server.js 
*/
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

const z_user = [
  {
    username: 'Arni', 
    password: '$2b$10$vQVp1xtKqL2PaoYinOzmbe27JSyX7eFvq8oJyXW.8j7sT.KN9ZFOm', // 123
    usertype: 'headteacher',
  },
  {
    username: 'anna', 
    password: '$2b$10$EozXJcNdwSSh.ElDbWqeNuwOKnGOhLoujIHeNVICQ4xHYfsf.huJ2', // 321Ba
    usertype: 'teacher',
  },
  {
    username: 'robert', 
    password: '$2b$10$yJrMMLJuDSema10Zvn5GXugyNA0qa52UAnv/r792mGoA5mPltAd3S', // roB81
    usertype: 'student'
  }
];  // Password should be hashed and storage in database

/*
  Login POST - Server.js
*/
app.post('/login', loginLimier,  async (req, res) => {
  const { username, password } = req.body;
  
  console.log('Notandi: ', username);
  console.log('Password: ', password); 

  const user = z_user.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password) ) {
      name = user.username;
      req.session.user = user;
      req.session.usertype = user.usertype;
      logger.info(`POST / accepted - Name : ${name}`);  // Info level logging
      return res.redirect('/');
  } else {
    res.redirect('/login');
    logger.warn('POST / login rejected');  // Info level logging
  }
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
    const message = 'Password is not strong enough';
    logger.warn(`POST / registier - password weaks!!`);  // Info level logging
    res.render('register', {user: req.session.user, error_msg : message, usertype: req.session.usertype});
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    z_user.push( {username, password: hashedPassword, usertype: 'student'} );
    ad_safna_ollum_append('New User registerd');
    console.log('Notandi: ', username);
    console.log('Password: ', password); 
    console.log('Hashed password: ', hashedPassword); 
    console.log('User registered successfully');
    logger.info(`POST / registier accepted - New student add : ${username}`);  // Info level logging
    res.redirect('/',);    
  }
});

/*
  Register POST - Server.js 
*/
app.post('/registeradmin', async (req, res) => {
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
    const message = 'Password is not strong enough';
    logger.warn(`POST / registier - password weaks!!`);  // Info level logging
    res.render('register', {user: req.session.user, error_msg : message, usertype: req.session.usertype});
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    z_user.push( {username, password: hashedPassword, usertype: 'teacher'});
    ad_safna_ollum_append('New teacher registerd');
    console.log('Notandi: ', username);
    console.log('Password: ', password); 
    console.log('Hashed password: ', hashedPassword); 
    console.log('User registered successfully');
    logger.info(`POST / registier accepted - New teacher add : ${username}`);  // Info level logging
    res.redirect('/',);    
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // CSRF token mismatch
    res.status(403).send('Invalid CSRF token');
  } else {
    next(err);
  }
});

app.listen(port, () => {
  //console.log(`Server running at http://localhost:${port}/`);
  logger.info(`Server running at http://localhost:${port}/`);  // Info level logging
});