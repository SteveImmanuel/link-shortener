const express = require('express');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan');
const db = require('./db');

// initialize database
db.init();

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
app.use('/', express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new LocalStrategy(db.authenticateUser));

passport.serializeUser((user, done) => {
    console.log('    serializing');
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('    deserialize');
    user = await db.getUserById(id);
    done(null, user);
});

// create custom middleware for redirect
const requiresLogin = (req, res, next) => {
    if (req.user === undefined){
        res.redirect('/');
    } else {
        next();
    }
}

// define routes
app.post('/', (req, res) => {
    data = req.body;
    // console.log(req);
    res.send('OK');
})

app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.send('LALALA');
})

app.get('/logout', (req, res) => {
    console.log(req.user);
    
    req.logout();
    console.log(req.user);

    res.send('OK');

})

const port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log(`App listening in port ${port}`);
})