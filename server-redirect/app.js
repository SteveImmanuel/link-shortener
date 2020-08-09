const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { isNull } = require('util');
const db = require('./db');

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  const url = await db.getUrlBySlug(slug);

  if (isNull(url)) {
    res.sendStatus(404);
  } else {
    res.redirect(url.url);
  }
})

app.get('*', (req, res) => {
  res.sendStatus(404);
})

const port = process.env.PORT || 2345;
app.listen(port, () => {
  console.log(`App listening in port ${port}`);
})