const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverried =  require('method-override');
const mongoose = require('mongoose');


const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./confing/passport')(passport);
// DB config
const db = require('./confing/database');


// Map Global Promise
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose.connect(db.mongoURI, {
  // useMongoClient: true -- Not nessesery on Mongoose 5x
})
.then(() => console.log('Connect to Mongodb'))
.catch((err) => console.log(err));

// Handlebars Middlware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser Middlware
app.use(bodyParser.urlencoded({ extended: false }))   // Third party module - to catch data from user
app.use(bodyParser.json())

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method overrider middlware
app.use(methodOverried('_method'));

// Middlware for express sesion
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middlware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());  //  call midlware

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
});


// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome to Recepies';
  res.render('index', {
    title: title
  });
})

// About Route
app.get('/about', (req, res) => {
  res.render('about');
})

// Use route
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
})




// Another Way to call Moongosee
// let db = mongoose.connection;
// db.once('open', function(){
//   console.log('MongoDB is Connected');
// })