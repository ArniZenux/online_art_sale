CREATE TABLE IF NOT EXISTS tblUsers (
  userID INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
);

/*CREATE TABLE IF NOT EXISTS tblStudent (
  studentID INTEGER PRIMARY KEY AUTOINCREMENT,
  nafn TEXT, 
  email TEXT UNIQUE 
);*/

CREATE TABLE IF NOT EXISTS tblTeacher (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacherID INTEGER,
  nafn TEXT, 
  email TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS tblCourse (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseID INTEGER,
  title TEXT, 
  start_dagur TEXT,
  last_dagur TEXT,
  price TEXT
);

CREATE TABLE IF NOT EXISTS tblTeach (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  z_idTeacher INTEGER, 
  z_idCourse INTEGER,
  FOREIGN KEY(z_idTeacher) REFERENCES tblTeacher(teacherID),
  FOREIGN KEY(z_idCourse) REFERENCES tblCourse(courseID)
);

/*CREATE TABLE IF NOT EXISTS tblLearn (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  z_idStudent INTEGER, 
  z_idCourse INTEGER,
  FOREIGN KEY(z_idStudent) REFERENCES tblStudent(studentID),
  FOREIGN KEY(z_idCourse) REFERENCES tblCourse(courseID)
);*/

INSERT INTO tblTeacher(teacherID, nafn, email) VALUES (112, 'Bob Marley', 'bob@gmail.com');
INSERT INTO tblTeacher(teacherID, nafn, email) VALUES (211, 'Bill Nickson', 'bill@aol.com');
INSERT INTO tblTeacher(teacherID, nafn, email) VALUES (333, 'Don Corlone', 'don@mafia.it');

INSERT INTO tblCourse(courseID, title, start_dagur, last_dagur, price) VALUES(123, 'MATH 1', '10 september', '23 desember', '3000');
INSERT INTO tblCourse(courseID, title, start_dagur, last_dagur, price) VALUES(456, 'MATH 2', '14 september', '13 desember', '2000');
INSERT INTO tblCourse(courseID, title, start_dagur, last_dagur, price) VALUES(897, 'PHYICS 2', '12 september', '10 desember', '3500');
INSERT INTO tblCourse(courseID, title, start_dagur, last_dagur, price) VALUES(564, 'MUSIC 1', '15 september', '16 desember', '7000');

INSERT INTO tblTeach(z_idTeacher, z_idCourse) VALUES(112, 123); 
INSERT INTO tblTeach(z_idTeacher, z_idCourse) VALUES(112, 564);
INSERT INTO tblTeach(z_idTeacher, z_idCourse) VALUES(211, 456); 
INSERT INTO tblTeach(z_idTeacher, z_idCourse) VALUES(333, 897);

/*INSERT INTO tblStudent(nafn, email) VALUES('Anna Jona', 'anna@gmail.com'); */

/*INSERT INTO tblLearn(z_idStudent, z_idCourse) VALUES (141581, 123);*/

/*
INSERT INTO tblUsers(username, email, password, admin)  
VALUES ('Administration',
        'admin@mavar.is',
        '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
        true
      );

INSERT INTO tblUsers 
(username, email, password, admin) 
VALUES ('Anna Jona', 
        'anna@gmail.com',
        '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
        false
      );
*/