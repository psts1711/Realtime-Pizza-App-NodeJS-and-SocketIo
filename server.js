require('dotenv').config();
const express = require('express');
const app = express();
const PORT  = process.env.PORT || 3000;
const PATH = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport');
const Emitter = require('events');

// Database connection and initialization
// const dbURL = 'mongodb://localhost/Pizza';

// Database connection
mongoose.connect(process.env.localDbURL2, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch((err) => {
    console.log('Connection failed...')
});


// Node Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// Session Store in MongoDB
let mongoSore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// Session Configuration
app.use(session({
    secret: process.env.cookieSecretKey,
    resave: false,
    saveUninitialized: false,
    store: mongoSore,
    cookie:{maxAge:1000*60*60*24}       // 24 hours // 1000 is milisecond * 15 = 15sec
}));

// passport config 
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// Assets location like css and js
app.use(express.static('public'));
//app.use(express.json({limit: '50mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({limit:"30mb", extended: true }));

// Global Middleware
app.use((req, res, next)=>{
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

// setup template engine
app.use(expressLayout);
app.set('views', PATH.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// routes call
require('./routes/web')(app);


app.disable('x-powered-by');
const server = app.listen(PORT,()=>{
    console.log(`Listing on port ${PORT}`);
});


// socket io Configuration
const io = require('socket.io')(server);
io.on('connection', (socket)=>{
    // Join
   // console.log(socket.id);
   socket.on('myPrivateRoom',(orderId)=>{
    console.log(orderId);
       socket.join(orderId)
   })
});

eventEmitter.on('orderUpdated', (data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated', data);
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})