//load env variables to process variable in application.
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const http = require('http')
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index')
const gamesRouter = require('./routes/games')
const favicon = require('serve-favicon')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//application set up.
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit : '10mb', extended: false}))
app.use(favicon(__dirname + '/favicon.ico'))
app.use(cookieParser());

//Session set up 
const oneDay = 1000 * 60 * 60 * 24; // one day duration for cookie to expire

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//database Connection.
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', error => console.error(error))
    db.once('open', error => console.log('Connected to Mongoose'))

app.use('/',indexRouter)
app.use('/games', gamesRouter)

// Server Creation
const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log("listening on 'http://localhost:3000, ctrl + click to open browser'");
})

// ------------------------------------
// real-time connections with socket.io
// ------------------------------------

const {Server} = require('socket.io');
var io = new Server(server);

const messager = require('./scripts/attachments/messager.js');
const messagernsp = io.of('/realtime');
messagernsp.on('connection', (socket) => {messager.onConnect(socket, messagernsp);});



const slap = require('./scripts/attachments/slap-attachment.js');
const slapnsp = io.of('/slap');
slapnsp.on('connection', (socket) => {slap.onConnect(socket, slapnsp);});