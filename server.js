'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.use(cors());

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

app.get('/api.v1/books', (request, response) => {
  client.query('SELECT * FROM books;')
    .then(result => response.send(result.rows))
    .catch(console.error);
});