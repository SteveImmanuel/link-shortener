const pg = require('pg');
const bcrypt = require('bcrypt');
const Pool = pg.Pool;

const db_pool = new Pool({
    user: 'admin',
    password: 'admin',
    host: 'localhost',
    database: 'owlifier',
    port: 5432,
})

const init = () => {
    db_pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(30)
    )`, (err, _res) => {
        if (err) {
            console.log(err.stack);
        }
    });
    
    db_pool.query(`
    CREATE TABLE IF NOT EXISTS routing (
        slug VARCHAR (50) PRIMARY KEY,
        url VARCHAR (100),
        id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        CONSTRAINT fk_user FOREIGN KEY (id) REFERENCES users(id)
    )`, (err, _res) => {
        if (err) {
            console.log(err.stack);
        }
    });
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
            console.log(`New Route {slug: ${slug}, url: ${url}}, id: ${id}`);
        }
    });
}

const registerUser = (username, password) => {
    const query = {
        name: 'register-user',
        text: 'SELECT * FROM users WHERE username=$1 AND password=$2',
        values: [slug, url, id],
    }
}

const getUser = (username, password) => {
    const query = {
        name: 'get-user',
        text: 'SELECT * FROM users WHERE username=$1 AND password=$2',
        values: [slug, url, id],
    }
}

module.exports = {init, insertNewRoute};