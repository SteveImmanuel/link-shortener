const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/', (req, res) => {
    data = req.body;
    console.log(req);
    res.send('OK');
})

const port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log(`App listening in port ${port}`);
})