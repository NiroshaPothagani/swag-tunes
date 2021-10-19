
const path = require('path');
const express = require("express");
const morgan = require('morgan');
const cookies = require('cookies');

const mongoose = require("mongoose"); 
const passport = require("passport");
const bodyParser = require("body-parser"); 
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose"); 
const axios = require('axios').default;// axios.<method> will now provide autocomplete and parameter typings
// const vue = require("vue")

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routs/tourRouter');
const userRouter = require('./routs/userRoutes');
const audioRouter = require('./routs/audioRouter');
const { signup, getCurrentUserData } = require('./controllers/authController');
const viewRouter = require('./routs/viewRouter');
const { db } = require('./models/UserModel');
const app = express();

 // gzip/deflate outgoing responses
 const compression = require('compression');
 app.use(compression());

 // store session state in browser cookie

//...........VIEW ENGINES.........
//we telling what type of template(pug) we using
    app.engine('pug', require('pug').__express)
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));
    //Another view engine
   // app.set("view engine", "ejs"); 
   // app.use(express.static(`${__dirname}/views`));

//.........AUTHENTICATION MIDDLEWARES.........
    //1)Body-parser allows express to read the body and 
    // then parse that into a JSON object that we can understand.
    app.use(bodyParser.urlencoded({ extended: false })); 
    app.use(bodyParser.json()); 
    app.use(express.static('public')); 
    app.use(bodyParser.urlencoded({ 
        extended: false
    })); 
      
    /*
        Passport is authentication middleware for Node. js. 
        Extremely flexible and modular, 
        Passport can be unobtrusively dropped in to any Express-based web application.
        A comprehensive set of strategies support authentication using 
        a username and password, Facebook, Twitter, and more.
    */
    app.use(passport.initialize()); 
    app.use(passport.session()); 


// ............DEPENDENCIES............
    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    //Development logi=ging
    /*if(process.env.NODE_ENV === "production") {
        app.use(morgan('dev'));
    }*/



//.........GLOBAL ....MIDDLEWARES
    //Serveing static files
    app.use(express.static(path.join(__dirname,'public')))
    //set security HTTP headers
    app.use(helmet());
    app.disable('x-powered-by')
    var session = require('cookie-session');
const audio = require('./models/audioModel');
const User = require('./models/UserModel');
const { UserRefreshClient } = require('google-auth-library');
    
    var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    app.use(session({
      name: 'session',
      keys: ['key1', 'key2'],
      cookie: {
        secure: true,
        httpOnly: true,
        domain: 'example.com',
        path: 'foo/bar',
        expires: expiryDate
      }
    }))
    //Limit requests from same API
    const Limiter = rateLimit({
        max:100,
        windowMs:60*60*1000,
        message:'Too many requests from this Ip , please try again an hour'
    });
    app.use('/api', Limiter);

    // vue.use(axios)

//Body parser, reading data from body into  req.body

        //     app.use(function (req, res, next) {
        //         getRawBody(req, {
        //             length: req.headers['content-length'],
        //             limit: '1mb',
        //             encoding: contentType.parse(req).parameters.charset
        //         }, function (err, string) {
        //             if (err) return next(err)
        //             req.text = string
        //             next()
        //         })
        // })
    app.use(express.json({ limit:'10kb'}));
    app.use(cookieParser());

    // app.use(express.session({secret: cookieSecret}));

//........PROTECTING MIDDLEWARES...........
    //Data sanitization against NoSQL query injection
    app.use(mongoSanitize());
    //Data sanitization against xss
    app.use(xss()); 
    //Prevent parameter pollution
    app.use(hpp({
        //whitelist: []
    }));


//.......Testing middlewares...........

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString;
    console.log(req.cookies);
    next();
});


//............we can also create parameter pollution...
    // app.use(hpp({whitelist: 'some audio parameters..'}))


//...........ROUTE HANDLERS..........
// app.post('/test', (req, res) => {
//     if (!req.body.name) {
//       return res.status(400).json({
//         status: 'error',
//         error: 'req body cannot be empty',
//       });
//     }
    app.get('/', (req, res) => {
        res.status(200).render('home', {
            title: 'home'
        })
    });

    app.get('/signup', (req, res) => {
        res.status(200).render('signup', {
            title: 'signup'
        })
    //  return  res.redirect('signup_success.html');

    });

    app.get('/login', (req, res) => {
      return res.status(200).render('login', {
            title: 'login'
        })
    });
    
    app.get('/logout', (req, res) => {
        return res.status(200).render('home', {
            title: 'home'
        })
    })

    // app.get('/index', (req, res) => {
    //     return res.status(200).render('index', {
    //           title: 'index|mugicc'
    //       })
    // });
    app.get('/index', function (req, res) {
        const audios = audio 
        res.render('index', { audios:audios });
     })
    
    app.get('/about', (req, res) => {
        return res.status(200).render('about', {
              title: 'about'
          })
      });
      app.get('/services', (req, res) => {
        return res.status(200).render('services', {
              title: 'services'
          })
      });
      app.get('/contact', (req, res) => {
        return res.status(200).render('contact', {
              title: 'contact'
          })
      });
      app.get('/help', (req, res) => {
        return res.status(200).render('help', {
              title: 'help'
          })
      });
      app.get('/info', (req, res) => {
        return res.status(200).render('info', {
              title: 'info'
          })
      });
    //   app.get('/me', (req, res) => {
    //     return res.status(200).render('account', {
    //           title: 'Account'
    //       })
    //   });
      
      app.get('/me', function (req, res) {
        const userData =  getCurrentUserData
        res.render('account', { userData });
     })
    
    //MOunting the router
    
    // app.use('/tracks', trackRouter)
    app.use('/', viewRouter);
    app.use('/tours', tourRouter);
    app.use('/audios', audioRouter);
    app.use('/users', userRouter);
    // app.use('/audios', audioRouter);



    app.all('*', (req, res, next) => {
        res.status(404).json( {
            status: 'fail',
            message:`can't find ${req.originalUrl} on this server!`
        });
    })


module.exports = app;
