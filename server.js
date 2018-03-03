'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.use(cors()); // Allows access from multiple sources with no validation.

// Sets up out first query to get our book data
app.get('/api/v1/books', (request, response) => {
  client.query(`SELECT * FROM books;`)
    .then(results => response.send(results.rows))
    .catch(console.log);
});

app.get('/api/v1/books/:id', (request, response) => {
  client.query(`SELECT * FROM books WHERE id=${request.params.id};`)
    .then(results => response.send(results.rows))
    .catch(console.log);
});

app.post('/api/v1/books', bodyParser, (request, response) => {
  console.log(request.body);
  client.query(`INSERT INTO books(title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5);`,
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

app.put('/api/v1/books', bodyParser, (request, response) => { //added for book update
  console.log('in insert');
  client.query(`UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5 WHERE id=$6`,
    [
      request.body.title,
      request.body.author,
      request.body.isbn,
      request.body.image_url,
      request.body.description,
      request.body.id
    ])
    .then(() => response.send('Update Complete'))
    .catch(console.error);
});

app.delete('/api/v1/books/:id', (request, response) =>{ //added for book delete
  client.query(`DELETE FROM books WHERE id=${request.params.id};`)
    .then(() => response.send('Delete complete'))
    .catch(console.error);
});

app.get('*', (request, response) => response.redirect(CLIENT_URL)); // Catch all for any other route to redirect to the home page.
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
