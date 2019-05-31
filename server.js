var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var ejs = require('ejs');
var engine = require('ejs-mate');

var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var passportConf = require('./passport');

var User = require('./models/user');


const app = express();
const port = 8080


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:<password>@mongoosetest-a4jsa.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//  middlewares
app.use(morgan('dev'));             //  walk a requested user i.e. showing on terminal
app.use(bodyParser.json());         // json format
app.use(bodyParser.urlencoded({ extended: true }));     // every url character
app.use(cookieParser());            // every cookie that is being send is stored in a session
app.use(session({                   // this is where the session is being stored and how
    resave: true,                   // force session to save in session store even if it is never modified
    saveUninitialized: true,        // force a session i.e. uninitialized
    secret: "Hello",                // secret used to assigned session_id_cookie (better to storre in seperate file)
    store: new MongoStore({ url: 'mongodb://root:<password>@mongoosetest-shard-00-00-a4jsa.mongodb.net:27017,mongoosetest-shard-00-01-a4jsa.mongodb.net:27017,mongoosetest-shard-00-02-a4jsa.mongodb.net:27017/test?ssl=true&replicaSet=MongooseTest-shard-0&authSource=admin&retryWrites=true', autoReconnect: true })// location to store + in url added teh connection of nodejs 2.1 and erlier from mongodb atlas because in connect-mongo latest uri doesn't work
}));



app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res, next) {
    res.render('home')
})

app.get('/login', function (req, res, next) {
    if (req.user) return res.redirect('/')
    res.render('login');
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}))

app.get('/profile', function (req, res, next) {
    res.render('profile');
});
mongoose.set('debug', false);


app.post('/create-user', function (req, res, next) {
    console.log(req.body)
    let user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.save(function (err, user) {
        console.log(user, err)

        if (err) {
            res.send(err)
        }
        res.json(user);
    });
});
// app.listen(8080, function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Running");
//     }
//}); 

//or
app.listen(port, () => console.log(`App listening on port ${port}`))