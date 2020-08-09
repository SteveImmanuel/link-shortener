const mongoose = require('mongoose');
const RouteModel = require('./models/route');

// configuring environment
require('dotenv').config();

// connecting to database
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
};

const { DBUSER, DBPASSWORD, DBHOST, DBNAME, DBPORT } = process.env;
if (process.env.NODE_ENV === 'dev') {
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`, options);
} else {
  mongoose.connect(
    `mongodb://${DBUSER}:${DBPASSWORD}@${DBHOST}:${DBPORT}/${DBNAME}`,
    options
  );
}
const db = mongoose.connection;

db.on('error', () => {
  console.log('DB connection error');
});
db.once('open', () => {
  console.log('DB successfuly connected');
});

// define all functions, caller responsibles for error handling
const getUrlBySlug = async (slug) => {
  const route = await RouteModel.findOne({ slug }).exec();
  return route || null;
}

module.exports = { getUrlBySlug };

