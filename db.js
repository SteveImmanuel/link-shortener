const pg = require('pg');
const bcrypt = require('bcrypt');
const Pool = pg.Pool;

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

const db_pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
})

const init = async () => {
    await db_pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
    )`);

    await db_pool.query(`
    CREATE TABLE IF NOT EXISTS routing (
        slug TEXT PRIMARY KEY,
        url TEXT,
        id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
}

const insertNewRoute = (slug, url, id) => {
    const query = {
        name: 'insert-new-route',
        text: 'INSERT INTO routing (slug, url, id) VALUES ($1, $2, $3)',
        values: [slug, url, id],
    }
    db_pool.query(query, (err, _res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(`New Route {slug: ${slug}, url: ${url}}, id: ${id}}`);
        }
    });
}

const registerUser = async (username, password) => {
    const { rows } = await db_pool.query('SELECT * FROM USERS WHERE username=$1', [username]);

    if (rows.length !== 0) {
        console.log(`Username '${username}' is taken`);
        return { success: false, msg: 'Username taken' };
    }

    const salt_rounds = 10;
    password_hash = await bcrypt.hash(password, salt_rounds);
    const query = {
        name: 'register-user',
        text: 'INSERT INTO users (username, password) VALUES ($1, $2)',
        values: [username, password_hash],
    }

    try {
        const result = await db_pool.query(query);
        return { success: true, msg: '' };
    } catch (e) {
        return { success: false, msg: process.env.NODE_ENV === 'dev' ? e : 'Error adding user' };
    }
}

const getUserById = async (id) => {
    const { rows } = await db_pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return rows[0] || null;
}

const getUrlBySlug = async (slug) => {
    const { rows } = await db_pool.query('SELECT url FROM routing WHERE slug=$1', [slug]);
    return rows[0].url || null;
}

const isSlugExist = async (slug) => {
    const { rows } = await db_pool.query('SELECT * FROM routing WHERE slug=$1', [slug]);
    return rows.length !== 0;
}


const authenticateUser = (username, password, done) => {
    const query = {
        name: 'get-user',
        text: 'SELECT * FROM users WHERE username=$1',
        values: [username],
    }

    db_pool.query(query, async (err, res) => {
        if (err) {
            console.log(err.stack);
            return done(err);
        }

        if (res.rows.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const user = res.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    });
}

module.exports = { init, insertNewRoute, authenticateUser, getUserById, registerUser, isSlugExist, getUrlBySlug };