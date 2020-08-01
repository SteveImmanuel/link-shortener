const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
    data = req.body;
    console.log(req);
    res.send('OK');
})

const port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log(`App listening in port ${port}`);
})