const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const UserModel = require('./models/user');
const RouteModel = require('./models/route');

// configuring environment
let host, database, port;
if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
    host = process.env.DBHOST;
    database = process.env.DBDATABASE;
    port = process.env.DBPORT;
} else {
    const connectionString = process.env.DATABASE_URL;
    db_pool = new Pool({ connectionString });
}

// connecting to database
mongoose.connect(`mongodb://${host}:${port}/${database}`, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB successfuly connected');
});

// define all functions, caller responsibles for error handling
const getUserById = async (id) => {
    const user = await UserModel.findById(user_id).populate('routes').exec();
    return user || null;
}

const getUrlBySlug = async (slug) => {
    const route = await RouteModel.find({ slug }).exec();
    return route || null;
}

const insertNewRoute = async (slug, url, user_id) => {
    const user = getUserById(user_id);
    const new_route = new RouteModel({ url, slug });
    await new_route.save();
    console.log(user.routes);
    user.routes.push(new_route._id);
    await user.save();
}

const registerUser = async (alias, password) => {
    const other_user = await UserModel.find({ alias }).exec();
    console.log(other_user);

    if (other_user.length !== 0) {
        console.log(`Alias '${alias}' is taken`);
        return { success: false, msg: 'Alias taken' };
    }

    const salt_rounds = 10;
    password_hash = await bcrypt.hash(password, salt_rounds);
    console.log(alias);
    console.log(password);
    console.log(password_hash);
    const new_user = new UserModel({ alias, password: password_hash });
    await new_user.save();
    return { success: true, msg: `Registered user ${alias}` };
}

const authenticateUser = (alias, password, done) => {
    UserModel.findOne({ alias }, async (err, user) => {
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

module.exports = { insertNewRoute, authenticateUser, getUserById, registerUser, getUrlBySlug };

