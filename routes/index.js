var express = require('express');  
var passport = require('passport');
var User = require('../models/user'); 
var LocalStrategy = require('passport-local').Strategy;   
var router = express.Router();
var mongodb = require('mongodb');
var session = require('express-session');

router.use(session({secret: "somesecret", saveUninitialized: true, resave: true}));

router.get('/', function(req, res, next) {  
  if(req.isAuthenticated()){
    var userx = req.user.firstName;
  }
  else{
    var userx = "Guest";
  }
  res.render('index', { title: 'Lab Management', user: userx });
});

session.cart = [];

router.get('/login', notLoggedIn, function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', notLoggedIn, function(req, res) {  
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/lab', function(req, res){
  if(req.isAuthenticated()){
    var userx = req.user.firstName;
  }
  else{
    var userx = "Guest";
  }
  var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/labmgmt";

  mongoClient.connect(url, function(err, db){
    if(err){
      console.log("DB connection error");
    }
    else{
      //console.log("DB connection established");
      var collection = db.collection('items');
      collection.find({}).toArray(function(err, result){
        if(err){
          console.log("error reading data");
        }
        else if(result.length){
          req.flash('info', 'Your Cart Items Here ... ');
          console.log(result);
          res.render("store.ejs", {"labItems": result, "user": userx, message: req.flash()});
        }else{
          res.send("this is lab page having no equipments");
        }
      });
    }
  });
});

router.get('/addtocart/:pdtID/:pdtName', function(req, res){
if(req.isAuthenticated()){
  var xx = req.params.pdtID;
  var xxx = req.params.pdtName;
  //console.log(req.params.pdtID);  
  var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/labmgmt";

  mongoClient.connect(url, function(err, db){
    if(err){
      console.log("DB connection error");
    }
    else{
      //console.log("DB connection established");
      var collection = db.collection('cart');
      collection.find({userID: req.user._id}, {pdtID: 1, _id: 0}).toArray(function(err, result){
        if(err){
          console.log("error reading data");
        }
        else{
          console.log(xx);
          for(var i=0; i<result.length; i++){
            if(xx == result[i].pdtID){
              break;
            }
          }
          if(i == result.length){
            collection.insert({userID: req.user._id, pdtID: xx, pdtName: xxx}, function(err){
              if(err){
                res.send("cannot insert items");
              }
              else{
                //res.render('store.ejs', {message: req.flash('Item added to cart')});
                console.log("item added to cart");
                res.redirect('/lab');
              }
            });
          }
          else{
            //res.render('store.ejs', {message: req.flash('Item already in cart')});
            console.log("Item alreadyin cart");
            res.redirect('/lab');
          }
        }
      });
    }
  });
}
else{
  for(var j=0; j<session.cart.length; j++){
    if(req.params.pdtID == session.cart[j].pdtID){
      break;
    }
  }
  //console.log(j + "--" + session.cart.length);
  if(j == session.cart.length){
    session.cart.push({pdtID: req.params.pdtID, pdtName: req.params.pdtName});
    res.redirect('/lab');
  }
  else{
    res.send("Item already in cart");
  }
  
}
});

router.get('/removefromcart/:pdtID/:pdtName', function(req, res){
if(req.isAuthenticated()){
  var xx = req.params.pdtID;
  var xxx = req.params.pdtName;
  var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/labmgmt";

  mongoClient.connect(url, function(err, db){
    if(err){
      console.log("DB connection error");
    }
    else{
      //console.log("DB connection established");
      var collection = db.collection('cart');
      collection.remove({userID: req.user._id, pdtID: xx}, function(err, result){
        if(err){
          console.log("error removing item");
        }
        else{
          console.log("Item removed from cart");         
        }
        res.redirect('/cart');
      });
    }
  });
}
else{
  for(var i = 0; i < session.cart.length; i++){
    var obj = JSON.parse(JSON.stringify(session.cart[i]));
    console.log(obj.pdtID);
    console.log(req.params.pdtID);
    if(obj.pdtID == req.params.pdtID){
      session.cart.splice(i, 1);
      console.log('removed');
      break;
    }
  }
  if(i == session.cart.length){
    console.log('unremoved');
  }
  res.redirect('/cart');
}
});

router.get('/cart', function(req, res){
  if(req.isAuthenticated()){
  var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/labmgmt";

  mongoClient.connect(url, function(err, db){
    if(err){
      console.log("DB connection error");
    }
    else{
      console.log("DB connection established");

      var collection = db.collection('cart');
      
      collection.find({userID: req.user._id}, {_id: 0, pdtID: 1}).toArray(function(err, result){
        if(err){
          console.log("error reading data");
        }
        else{
          for(var j=0; j<session.cart.length; j++){
            for(var i=0; i<result.length; i++){
              if(session.cart[j].pdtID == result[i].pdtID){
                break;
              }
            }
            if(i == result.length){
              collection.insert({userID: req.user._id, pdtID: session.cart[j].pdtID, pdtName: session.cart[j].pdtName}, function(err){
                if(err){
                  console.log('errorin updating cart');
                }
              });
            }
          }
          if(j == session.cart.length){
            console.log('CArt updated successfully');
            collection.find({userID: req.user._id}).toArray(function(err, result){
              if(err){
                console.log("error reading data");
              }
              else{
                res.render("cart", {"cartItems": result, "user": req.user.firstName});
              }
            });
          }
        }
      });
    }
  });
  }
  else{
    console.log(session.cart[0]);
    //console.log(session.cart[0].pdtID);
    res.render('cart', {"cartItems": session.cart, "user": "Guest"});
  }
});

router.get('/view/:pdtID', function(req, res){
  if(req.isAuthenticated()){
    var userx = req.user.firstName;
  }
  else{
    var userx = "Guest";
  }
  var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/labmgmt";

  mongoClient.connect(url, function(err, db){
    if(err){
      console.log("DB connection error");
    }
    else{
      //console.log("DB connection established");
      var collection = db.collection('items');
      collection.find({pdtID: req.params.pdtID}).toArray(function(err, result){
        if(err){
          console.log("error reading data");
        }
        else if(result.length){
          res.render("viewpdt.ejs", {"labItem": result, "user": userx});
        }else{
          res.send("This Product is not available");
        }
      });
    }
  });
    //res.render('viewpdt', {"cartItems": result, "user": userx});  
});

router.get('/checkout', isLoggedIn, function(req, res){
  var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/labmgmt";

  mongoClient.connect(url, function(err, db){
    if(err){
      console.log("DB connection error");
    }
    else{
      console.log("DB connection established");
      var collection = db.collection('cart');
      collection.find({userID: req.user._id}).toArray(function(err, result){
        if(err){
          console.log("error reading data");
        }
        else {
          //console.log(result);
          res.render("checkout", {"cartItems": result, "user": req.user.firstName});
        }
      });
    }
  });
});

router.post('/checkoutFinal', function(req, res){
  var obj = JSON.parse(req.body.checkoutDetail);
  console.log(obj.issueItems);
  console.log(req.body.reason);
  var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/labmgmt";

  mongoClient.connect(url, function(err, db){
    if(err){
      console.log("DB connection error");
    }
    else{
      console.log("DB connection established");
      var collection = db.collection('cart');
      //mail work
      collection.remove({userID: req.user._id}, function(err){
        if(err){
          console.log("Error");
        }
        else{
          console.log("Request Successful");
          res.redirect('/cart');
        }
      });     
    }
  });
});

router.post('/signup', passport.authenticate('local-signup', {  
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', { 
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));



router.get('/profile', isLoggedIn, function(req, res) {  
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', isLoggedIn, function(req, res) {  
  req.logout();
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}