'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true });

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.use(cors()); 

app.get('/api/v1/books', (request, response) => {
  client.query(`SELECT * FROM books;`)
    .then(results => response.send(results.rows))
    .catch(console.log);
});

app.get('/api/v1/books/:id', (request, response) => {
  client.query(`SELECT * FROM books WHERE book_id=${request.params.id};`)
    .then(results => response.send(results.rows))
    .catch(console.log);
});

app.post('/api/v1/books/', bodyParser, (request, response) => {
  console.log('inside post');
  client.query(`INSERT INTO books(title, author, isbn, image_url, description)VALUES($1, $2, $3, $4, $5);`,
    [
      request.body.title,
      request.body.author,
      request.body.isbn,
      request.body.image_url,
      request.body.description
    ])
    .then(() => response.send('Update Complete'))
    .catch(console.error);
});

app.put('/api/v1/books/:id', bodyParser, (request, response) => {
  client.query(`UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5 WHERE book_id=$6;`,
    [
      request.body.title,
      request.body.author,
      request.body.isbn,
      request.body.image_url,
      request.body.description,
      request.params.id
    ])
    .then(() => response.send('Update Complete'))
    .catch(console.error);
});

app.delete('/api/v1/books/:id', (request, response) => { 
  client.query(`DELETE FROM books WHERE book_id=${request.params.id};`)
    .then(() => response.send('Delete complete'))
    .catch(console.error);
});

// app.delete('/api/v1/books/:id', (req, res) => {
//   client.query('DELETE FROM books WHERE book_id=$1', [req.params.id])
//   .then(() => res.sendStatus(204))
//   .catch(console.error);
// });

app.get('*', (request, response) => response.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
