const bcrypt = require('bcrypt');
const { isNull } = require('util');
const mongoose = require('mongoose');
const RouteModel = require('./models/route');
const UserModel = require('./models/user');

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
const getUserById = async (user_id) => {
  const user = await UserModel.findById(user_id).populate('routes').exec();
  delete user.password;
  return user || null;
}

const getUrlBySlug = async (slug) => {
  const route = await RouteModel.findOne({ slug }).exec();
  return route || null;
}

const getUrlByUserId = async (user_id) => {
  const user = await getUserById(user_id);
  if (isNull(user)) {
    return null;
  } else {
    return user.routes;
  }
}

const insertNewRoute = async (slug, url, user_id) => {
  const user = await getUserById(user_id);
  const new_route = new RouteModel({ url, slug });
  await new_route.save();
  user.routes.push(new_route._id);
  await user.save();
}

const registerUser = async (alias, password) => {
  const other_user = await UserModel.find({ alias }).exec();

  if (other_user.length !== 0) {
    console.log(`Alias '${alias}' is taken`);
    return { success: false, msg: 'Alias taken' };
  }

  const salt_rounds = 10;
  password_hash = await bcrypt.hash(password, salt_rounds);
  const new_user = new UserModel({ alias, password: password_hash });
  await new_user.save();
  return { success: true, msg: `Registered user ${alias}` };
}

const authenticateUser = (alias, password, done) => {
  UserModel.findOne({ alias }).populate('routes').exec(async (err, user) => {
    if (err) {
      console.log(err.stack);
      return done(err);
    }


    if (!user) {
      return done(null, false, { message: 'Incorrect alias/password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect alias/password' });
    }

  });
}

module.exports = { insertNewRoute, authenticateUser, getUserById, registerUser, getUrlBySlug, getUrlByUserId };

