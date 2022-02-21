const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
const cors = require('cors')

const db = require('./config/db')
const helpers = require('./helpers')

require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))

//crear una app de express
const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));

app.use(expressValidator())

app.use(flash())

app.use(cookieParser())

app.use(session({
    secret: 'supersecreto',
    resave: false, 
    saveUninitialized: false}));

app.use(passport.initialize())
app.use(passport.session()) 

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next()
})

app.use('/', routes() )


app.listen(9000)

require('./handlers/email');