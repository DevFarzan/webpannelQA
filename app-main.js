var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var mongoose = require('mongoose');
var passport = require('passport');
//var compression = require('compression');
var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

// DB models
require('./models/Profile');
require('./models/User');

require('./models/Reset');
require('./models/Order');
require('./models/FavDish');
require('./models/MarkedChef'); 
require('./models/MarkedDish');
require('./models/UserSubscriptionEmail');
require('./models/categoryquestionanswer');
require('./models/categorySkill');

//authentication config details
require('./config/passport'); 

//database Development
var configDB = require('./config/database.js');
mongoose.connect(configDB.EvenNodeDB);

// Local DB
//mongoose.connect("mongodb://localhost/app_1100");

// UAT DB connection
//mongoose.connect("mongodb://e1e50674a7a05df1ad207f4973ddace2:hcbpassword@eu-1.evennode.com:27017/e1e50674a7a05df1ad207f4973ddace2");

//production
//mongoose.connect("mongodb://app_1100:hckeyword@evennode.com:27017/app_1100");
 
 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection failed:'));
db.once('open', function (callback) {
  console.log("Database :: interviewquestions :: connection established successfully.");
});

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

// routers 
var routes = require('./routes/router');
 
var app = express();

//email middleware 
var mailer = require('express-mailer');
mailer.extend(app, {
    from: 'info@homechef.pk',
    host: 'harrier.websitewelcome.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
      user: 'info@homechef.pk',
      pass: '1keyword'
    }
});
 
//Session middleware
app.use(session({secret: '09secret1234key5678'}));

/* 
app.use(compression());
app.use(express.session({
    store: new MongoStore({
        db: 'homechef',
        host: '127.0.0.1',
        port: 3000
    })
}));*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
/*app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));*/
 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy()); 
app.use(passport.initialize());



app.param('regemail', function(req, res, next, id) {
  console.log( "regemail parameter " , id ) ;
  try{ 
    if ( id ) {
          req.useremail = id;
          return next();
    } else {    
      res.send("The <b>email</b> does not exists.");
    }
  }catch(Exception ) {
     console.log(Exception);
     res.send("Unexpected Exception" , Exception);
  }

});

app.param('regusername', function(req, res, next, id) {
  console.log( "regusername parameter " , id ) ;
  try{
    if ( id ) {
          req.username = id;
          return next();
    } else {    
      res.send("The <b>username</b> does not exists.");
    }
      
  }catch(Exception ) {
     console.log(Exception);
     res.send("Unexpected Exception" , Exception);
  }

});

app.param('ischef', function(req, res, next, id) {
  console.log( "ischef parameter " , id ) ;
  try{
    if ( id ) {
            req.isChefUser = id;
            return next();        
    } else {    
        res.send("The <b>ischef</b> does not exists.");
    }
      
  }catch(Exception ) {
     console.log(Exception);
     res.send("Unexpected Exception" , Exception);
  }

});

app.get('/sendemail/:regemail/:regusername/:ischef',  function(req, res, next) {
  console.log( "/sendemail/:regemail/:regusername/:ischef:::   req.body:: ", req.body);
  var username = req.username || "";
  var useremail = req.useremail || "noemail";
  var isChef = req.isChefUser || false;
  console.log( "req.useremail: " , useremail );
  console.log( "req.username: " , username );
  console.log( "req.isChef: " , isChef );
   
  var seed1 = Math.floor(Math.random() * (10 - 1) + 1);
  var seed2 = Math.floor(Math.random() * (10 - 1) + 1);
  var seed3 = Math.floor(Math.random() * (10 - 1) + 1);
  var seed4 = Math.floor(Math.random() * (10 - 1) + 1);
  var seed5 = Math.floor(Math.random() * (10 - 1) + 1);
  
  var randId = seed1 + "" + seed2 + "" + seed3 + "" + seed4 + "" + seed5;
  //if false, then Foodie, if true then Chef
  var emailTemplate = isChef ? "foodieregistration" : "email";

  try{
    //first send email to the registered user 
    if( useremail !="noemail" ) {

        app.mailer.send( emailTemplate , {
            to: useremail ,           
            subject: 'Welcome to HomeChef.pk!',  
            otherProperty: { uname: username , regId: randId } 
          }, function (err) {
            if (err) {
              // handle error 
              console.log(err);
              //res.send('There was an error sending the email');
              return;
            }           
        });
     }

  }catch(Exception ) {
     console.log(Exception);
  }
  //send emails to Help desk peoples
 // var listOfRecipients = ["Sheraz Hassan <sheraz@homechef.pk>", "Shahyar Khan <shahryar@homechef.pk>"];
  var listOfRecipients = ["withabdulahad@gmail.com"];
  try{ 
      for(var i=0; i< listOfRecipients.length; i++) {
         app.mailer.send( emailTemplate , {
            to: listOfRecipients[i] ,            
            subject: 'Welcome to HomeChef.pk!',  
            otherProperty: { uname: username , regId: randId } 
          }, function (err) {
            if (err) {
              // handle error 
              console.log(err);
              //res.send('There was an error sending the email');
              return;
            }
            //res.send('Email Sent');
          });
      } 

  }catch(Exception ) {
     console.log(Exception);
  }
  
  res.send('Email Sent');

}); 


//send dish confirmation email
app.post('/dishconfirmemail', function(req, res, next) {
   console.log( "/dishconfirmemail "   );

  var username = req.body.username || "";
  var useremail = req.body.useremail || "noemail";
  var dishname = req.body.dishname || "";
  
  try{
     
    if( useremail !="noemail" ) {
        app.mailer.send('dishemail', {
          to: useremail ,           
          subject: 'Your Dish has been listed successfully',  
          otherProperty: { uname: username , dname: dishname } 
        }, function (err) {
          if (err) {
            // handle error 
            console.log(err);
            //res.send('There was an error sending the email');
            return;
          }
           
        });
     }
  
  }catch(Exception ) {
     console.log(Exception);
  }
 // var listOfRecipients = ["Sheraz Hassan <sheraz@homechef.pk>", "Shahyar Khan <shahryar@homechef.pk>"];
  listOfRecipients = ["withabdulahad@gmail.com"];
  try {
        
      for(var i=0; i< listOfRecipients.length; i++) {
         app.mailer.send('dishemail', {
            to: listOfRecipients[i] ,            
            subject: 'Your Dish has been listed successfully',  
            otherProperty: { uname: username , dname: dishname } 
          }, function (err) {
            if (err) {
              // handle error 
              console.log(err);
              //res.send('There was an error sending the email');
              return;
            }
            //res.send('Email Sent');
          });
      } 
      
  }catch(Exception ) {
     console.log(Exception);
  }

    res.send('Email Sent');

});
 
app.get('/sendResetEmail', function (req,res,next) {
  console.log( '/sendResetEmail...');
  console.log( req.query );
  try{
      app.mailer.send('password-reset-email', {
          to: req.query.email ,
          subject: 'Reset Password',
          resetLink: {username: req.query.username , token:req.query.token , email:req.query.email }
      }, function (err) {
        console.log("Send status ");
          if (err) {             
            console.log(err);
            res.send('There was an error sending the email');
            return;
          }
          else {
            res.send('Password reset link has been sent to: ' , req.query.email);
          }
      });

  }catch(Exception ) {
    console.log(Exception);
    res.send("Unexpected Exception" , Exception);
  }

});

app.get('/sendOrderPlacementEmail', function (req,res,next) {
  console.log( '/sendOrderPlacementEmail...');
  console.log( req.query );

  var listOfRecipients = [];
  //var listOfRecipients = ["Sheraz Hassan <sheraz@homechef.pk>", "Shahyar Khan <shahryar@homechef.pk>"];
  if(req.query.email != "") {
   listOfRecipients.push(req.query.email);
  }
  try {
    for(var i=0; i< listOfRecipients.length; i++) {
       app.mailer.send('orderplacement', {
          to: listOfRecipients[i] ,            
          subject: 'Your Order Placed',
          values: {username: req.query.username}
        }, function (err) {
          if (err) {               
            console.log(err);               
            return;
          }            
        });
    } 
    res.send('Your order has been placed successfully.');
  }catch(Exception ) {
     console.log(Exception);
  } 

});


app.use('/', routes); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
 
module.exports = app;