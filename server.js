require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');
const passportConfig = require('./config/passport');
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');
const errorHandler = require('./middlewares/errorHandler');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// DB connection
connectDB();

// Passport config
passportConfig(passport);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/post', require('./routes/post'));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Frontend pages
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.render('dashboard', { user: req.user });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
