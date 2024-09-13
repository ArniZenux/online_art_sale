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
  z_idTeacher INTEGER, 
  z_idCourse INTEGER,
  FOREIGN KEY(z_idTeacher) REFERENCES tblTeacher(teacherID),
  FOREIGN KEY(z_idCourse) REFERENCES tblCourse(courseID)
);

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
