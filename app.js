const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const port =  3000;

const app = express();

// Passport Config
require('./config/passport')(passport);

// Connecting to Database
const db =mongoose.connect('mongodb+srv://mango:mango@mango.tno3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',() => console.log("connected"))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/delivery', require('./routes/delivery.js'));


app.listen(port, console.log("start"))
module.export = db
