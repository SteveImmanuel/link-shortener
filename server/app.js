const express = require('express');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan');
const flash = require('connect-flash');
const db = require('./db');
const { isNull } = require('util');

// initialize and configure app
const app = express();
app.use(helmet());
app.use(cors());
app.use(session({
    secret: 'wowthisisacustomapp',
    resave: false,
    saveUninitialized: false
}))
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', express.static(path.join(__dirname, '../client/public')));

// configure passport
passport.use(new LocalStrategy(db.authenticateUser));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    user = await db.getUserById(id);
    done(null, user);
});

// create custom middleware for redirect
const requiresLogin = (req, res, next) => {
    if (req.user === undefined) {
        res.redirect('/');
    } else {
        next();
    }
}

// define routes
app.post('/register', async (req, res) => {
    const alias = req.body.alias;
    const password = req.body.password;

    try {
        const obj = await db.registerUser(alias, password);
        if (obj.success) {
            res.sendStatus(200);
        } else {
            res.status(400).send(obj.msg);
        }
    } catch (e) {
        console.log(e.stack);
        res.sendStatus(500);
    }
})

app.get('/login', (req, res) => {
    console.log(req.flash('error'));
    res.sendStatus(200);
})

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }))

app.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
})

app.post('/url', requiresLogin, async (req, res) => {
    const url = req.body.url;
    const slug = req.body.slug;
    const user_id = req.user._id;

    // TODO: change validation
    const valid = true;
    if (valid) {
        const exist = await db.getUrlBySlug(slug);
        if (isNull(exist)) {
            await db.insertNewRoute(slug, url, user_id);
            res.send(JSON.stringify(url, slug));
        } else {
            res.status(400).send('Slug already used');
        }
    } else {
        res.status(400).send('Invalid parameters');
    }
})

app.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const url = await db.getUrlBySlug(slug);

    if (isNull(url)) {
        res.sendStatus(404);
    } else {
        res.redirect(url.url);
    }
})

app.get('/*', (req, res) => {
    res.sendStatus(404);
})

const port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log(`App listening in port ${port}`);
})