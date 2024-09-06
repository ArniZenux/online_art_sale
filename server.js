import express from 'express';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

/*
app.get('/editUser', (req, res) => {
  res.send('Hello online art sale');
});

app.post('/editUser', (req, res) => {
  res.send('Yes it change change ... online art sale');
});

app.put('/user', (req, res) => {
  res.send('Hello New User in Online art sale');
});

app.delete('/user', (req, res) => {
  res.send('Bye bye User -- online art sale');
});
*/

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});