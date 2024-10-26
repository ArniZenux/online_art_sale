import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParse from 'body-parser';
import session from 'express-session';
import bcrypt from 'bcrypt'; 
import * as fs from 'fs';
import dotenv from 'dotenv';   // session fixation 
import passwordSchema from 'password-validator';

import { ad_safna_ollum_append } from './utils/utils.js';
import { logger } from '../utils/logger.js';
import { loginLimier } from '../utils/ratelimit2.js';

const dbFile2 = '../data/onlineSchool.db';
const logData = '../var/logToFile.json';
export const router = express.Router();

/*
  Index - Content View
*/
router.get('/', (req, res) => {
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