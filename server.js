'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.use(cors()); // Allows access from multiple soirces with no validation.

// Sets up out first query to get our book data
app.get('/api/v1/books', (request, response) => {
  client.query(`SELECT book_id, title, author, image_url, isbn FROM books;`)
    .then(results => response.send(results.rows))
    .catch(console.log);
});

// app.get('/api/v1/books/:id', (request, response) => {
//   client.query(`SELECT * FROM books WHERE id=${request.params.id};`)
//     .then(results => response.send(results.rows))
//     .catch(console.log);
// });

app.get('*', (request, response) => response.redirect(CLIENT_URL)); // Catch all for any other route to redirect to the home page.
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

// app.post();
