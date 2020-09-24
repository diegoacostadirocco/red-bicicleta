require('newrelic');
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletasApiRouter = require('./routes/api/bicicletas');
var usuariosApiRouter = require('./routes/api/usuarios');
var authApiRouter = require('./routes/api/auth');


const Usuario = require('./models/usuario');
const Token = require('./models/token');

let store;
if (process.env.NODE_ENV === 'development') {
  store = new session.MemoryStore;
} else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  store.on('error', (error) => {
    assert.ifError(error);
    assert.ok(false);
  });
}


let app = express();
app.set('secretKey', 'jwt_pwd_!!223344');
app.use(session({
  cookie: {
    maxAge: 240 * 60 * 60 * 1000
  },
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'bicicleteando_ando186479325'
}));

var mongoose = require('mongoose');

//REPETIDO??
// const router = require('./routes/index');
// const { assert } = require('console');


//mongodb://localhost/red_bicicletas
//mongodb+srv://adrdm123:<password>@red-bicicletas.ikdad.mongodb.net/<dbname>?retryWrites=true&w=majority
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.render('session/login');
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!usuario) return res.render('session/login', {
      info
    });
    req.logIn(usuario, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});


app.get('logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.get('/forgotPassword', (req, res) => {
  res.render('session/forgotPassword');
});

app.post('forgotPassword', (req, res) => {
  Usuario.findOne({
    email: req.body.email
  }, (err, usuario) => {
    if (!usuario) {
      return res.render('session/forgotPassword', {
        info: {
          message: 'no existe el mail para un usuario existente'
        }
      })
    };
    usuario.resetPassword((err) => {
      if (err) return next(err);
      console.log('session/forgotPasswordMessage');
    });

    res.render('session/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', (req, res, next) => {
  Token.findOne({
    token: req.params.token
  }, (err, token) => {
    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        msg: 'No existe un usuario asociado al token.Verifique que su token no haya expirado'
      });
    };
    Usuario.findById(token._userId, (err, usuario) => {
      if (!usuario)
        return res.status(400).send({
          msg: 'no existe un usuario asociado al token'
        });
      res.render('session/resetPassword', {
        errors: {},
        usuario: usuario
      });
    });
  });
});

app.post('/resetPassword', (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {
      errors: {
        confirm_password: {
          message: 'No coincide con el password ingresado'
        }
      },
      usuario: new Usuario({
        email: req.body.email
      })
    });
    return;
  }
  Usuario.findOne({
    email: req.body.email
  }, (err, usuario) => {
    usuario.password = req.body.password;
    usuario.save((err) => {
      if (err) {
        res.render('session/resetPassword', {
          errors: err.errors,
          usuario: new Usuario({
            email: req.body.email
          })
        });
      } else {
        res.redirect('/login');
      }
    })
  });
});

// app.use(app.router);
// router.initialize(app);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);

app.use('/bicicletas', loggedIn, bicicletasRouter);

app.use('/api/auth', authApiRouter)
app.use('/api/bicicletas', validarUsuario, bicicletasApiRouter);
app.use('/api/usuarios', usuariosApiRouter);

app.use("/googlec19a96a7e947ca3b", (req, res) => {
  res.sendFile("/public/googlec19a96a7e947ca3b.html");
});
app.use("/privacy_policy", (req, res) => {
  res.sendFile("/public/privacy_policy.html");
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  })
);

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/error'
}));

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log('user sin loguearse');
    res.redirect('/login');
  }
};

function validarUsuario(req, res, next) {
  jwt.verify(req.headers[`x-access-token`], req.app.get['secretKey'], (err, decoded) => {
    if (err) {
      res.json({
        status: "error",
        message: err.message,
        data: null
      });
    } else {
      req.body.userId = decoded.id;
      console.log(`jwt verify ${decoded}`);

      next();
    }
  })
};


module.exports = app;