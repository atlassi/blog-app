const Sequelize = require('sequelize');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');


//------------------------------------------------------------------------------
//Initialize Sequelize
//------------------------------------------------------------------------------
const sequelize = new Sequelize('blog', process.env.POSTGRES_USER, null, {
  host: 'localhost',
  dialect: 'postgres',
});

//------------------------------------------------------------------------------
//Configure modules
//------------------------------------------------------------------------------
const app = express()
app.use(express.static('public'));
app.set('views', './views')
app.set('view engine', 'pug')

app.use(session({
  secret: "secret1234",
  saveUninitialized: false,
  resave: false
}))
app.use(bodyParser.urlencoded({
  extended: true
}))

//------------------------------------------------------------------------------
//Define models in Sequelize
//------------------------------------------------------------------------------
const User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
})

//------------------------------------------------------------------------------
//Routing
//------------------------------------------------------------------------------
app.get('/', (req, res) => {
  // console.log(req.session)
  res.render('index')
})
app.get('/signup', (req, res) => {
  // console.log(req.session)
  res.render('signup')
})

app.post('/createuser', (req, res) => {
  if (req.body.username && req.body.email && req.body.password && req.body.password2) {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      .then((user) => {
        req.session.user = user;
        res.redirect('/'); //was profile
        console.log(req.session)

      })

  }

})

app.get('/profile', (req, res) => {
  res.render('profile', {
    userInfo: req.session.user
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      throw error;
    }
    res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
  })
})

sequelize.sync()

app.listen(3000, () => {
  console.log("Listening on 3000 ")
})
