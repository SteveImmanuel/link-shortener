const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan');
const flash = require('connect-flash');
const { isNull } = require('util');

const db = require('./db');
const { schema } = require('./validate');

// initialize and configure app
const app = express();
app.use(helmet());
app.use(session({
  secret: 'wowthisisacustomapp',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "strict",
  },
}))
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static('../client/dist'));

const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

// configure passport
passport.use(new LocalStrategy({ usernameField: 'alias', passwordField: 'password' }, db.authenticateUser));

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
    res.sendStatus(401);
  } else {
    next();
  }
}

// create custom error handler
errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status);
  }
  res.json({
    msg: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'Sorry' : err.stack
  })
}

// define routes
app.post('/register', async (req, res, next) => {
  const alias = req.body.alias;
  const password = req.body.password;

  const obj = await db.registerUser(alias, password);
  if (obj.success) {
    res.sendStatus(200);
  } else {
    res.status(400).send(obj.msg);
  }
})

app.post('/login', passport.authenticate('local'), (req, res, next) => {
  if (req.user) {
    res.send(JSON.stringify(req.user));
  } else {
    res.status(400).send('Wrong credentials');
  }
})

app.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
})

app.post('/slug', requiresLogin, async (req, res, next) => {
  const user_id = req.user._id;
  const routes = await db.getUrlByUserId(user_id);
  res.send(JSON.stringify(routes));
})

app.post('/url', requiresLogin, async (req, res, next) => {
  const url = req.body.url;
  const slug = req.body.slug;
  const user_id = req.user._id;

  const valid = await schema.isValid({ url, slug });
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

app.get('/:slug', async (req, res, next) => {
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

app.use(errorHandler)
const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`App listening in port ${port}`);
})
