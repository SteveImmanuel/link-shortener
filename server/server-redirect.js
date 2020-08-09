const express = require('express');
const helmet = require('helmet');
const db = require('./db');

const app = express();
app.use(helmet());

const port = process.env.PORT || 2345;
app.listen(port, () => {
  console.log(`App listening in port ${port}`);
})