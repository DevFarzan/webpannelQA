var express = require('express');
var path = require("path");
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var cloudinary = require('cloudinary');
var fs = require('fs');
var async = require("async");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User');
var Profile = mongoose.model('Profile');

var Reset = mongoose.model('Reset');
var Order = mongoose.model('Order');
var FavDish = mongoose.model('FavDish');
var MarkedChef = mongoose.model('MarkedChef');
var MarkedDish = mongoose.model('MarkedDish');
var userSubscribeEmail = mongoose.model('userSubscribe')
var categoryQuestionAns = mongoose.model('categoryQuestionAnswer')
var categorySkill = mongoose.model('categorySkill');

var config = require('../config/config'); 

var jwt = require('express-jwt');
var auth = jwt({secret: config.secretkey , userProperty: 'payload'});
  
cloudinary.config({
  cloud_name: 'homechefpk',
  api_key: '499669623812192',
  api_secret: 'VZy7ryBJecL78l-sE48_hZGnJxs'
});

router.get('/', function (req, res) { 
  res.render('index');     
});  

router.get('/dashboard', function (req, res) { 
  res.render('index');     
});   

router.get('/dashboard/allorders', function(req, res, next) {
  res.render('index');
});
router.get('/dashboard/allusers', function(req, res, next) {
  res.render('index');
});
router.get('/dashboard/orderdetails', function(req, res, next) {
  res.render('index');
});
 
router.get('/userlistdishes', function(req, res, next) {
  res.render('index');
});

router.get('/editprofile', function(req, res, next) {
  res.render('index');
});

router.get('/dishPreview', function(req, res, next) {
  res.render('index');
});

router.get('/profilepreview',  function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render('index');
});

router.get('/userlistdishes', function(req, res, next) {
  res.render('index');
}); 


router.get('/customerslist', function(req, res, next) {
  console.log("customerslist...................");
  Profile.find({}).populate("regisId").exec( function(err, users){
    if(err){ 
      return next(err); 
    }
    console.log(users);
    res.json(users);
  });

}); 
  

router.param('userid', function(req, res, next, id) {
    
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
      Profile.findOne( {'regisId': id }, function (err, profile) {
     
          if (err) {
             console.log(err.name);
             return res.status(400).json(  {message: 'Profile details not found.' }  );
          }
          
          console.log('profile found.' , profile );
           
          req.profile = profile;
          return next();
      });
  } else {
    
    res.send("The <b>profile</b> does not exists.");
  }
});

router.get('/userprofile/:userid', function(req, res, next) {
  console.log( "/userprofile/:userid " ) ;
  req.profile.populate('regisId', function(err, profile) {
    if (err) { return next(err); }
    console.log(profile);
    res.json(profile);
  });
});

 
router.param('useriddish', function(req, res, next, id) {
 
 
  try{

      if (id.match(/^[0-9a-fA-F]{24}$/)) {
          Dish.findOne( {'user': id }, function (err, dish) {     
                if (err) {
                   console.log("Got erro" , err );
                   return res.status(400).json(  {message: 'Dish details not found.' }  );
                }          
                console.log('Dish found.' , dish );           
                req.dish = dish;
                 
              Profile.findOne( {'regisId': id }, function (err, profile) {     
                if (err) {
                   console.log("Got erro" , err );
                   return res.status(400).json(  {message: 'profile details not found.' }  );
                }          
                console.log('profile found.' , profile );           
                req.businessname = (profile && profile.businessname);
                return next();
              });
          });
 

      } else {    
        res.send("The <b>Dish</b> does not exists.");
      }

  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }
 
});

 
router.get('/dishlist/:useriddish', function(req, res, next) {
  console.log( "/dishlist/:useriddish " ) ;
  try{
      req.dish.populate('user', function(err, dish) {
      if (err) { 
        console.log("Got erro" , err );
        return next(err); 
      }
        console.log(dish);
        res.json(dish);
      });
  }catch(Exception){
    console.log("Got erro" , Exception );
    res.send("unexpected error");
  }
  
  
});

router.param('onedishid', function(req, res, next, id) {
  console.log( "router.param(onedishid) : " , id ) ;   
  console.log( mongoose.Types.ObjectId.isValid(id)  ) ;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
     
      try {
        var dishesArr = req.dish.dishes;        
        var foundADish = {};
        for(var i=0; i < dishesArr.length; i++ ){            
            if( dishesArr[i]._id == id) {
                foundADish  = dishesArr[i];
                //console.log('-----  got match dishesArr[i]  ----- ' , foundADish );
            }
        }
 
        //console.log('-----  Wow got a  Dish   ----- ' , foundADish ); 
        req.dish.dishes = [];
        req.dish.dishes.push(foundADish);
        return next();

      }catch(Exception) {
        console.log( Exception);
        return next();
      }

  } else {    
    res.send("The <b>Dish</b> does not exists.");
  }
});

router.get('/onedishlist/:useriddish/:onedishid', function(req, res, next) {
  console.log( "/dishlist/:useriddish/:onedishid " ) ;
  try{

    req.dish.populate('user', function(err, dish) {
      if (err) { 
        return res.send("Unexpect error occurerd");
      }            
      res.json({d: dish , busname: req.businessname });
    });  

  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }  
   
});


router.post('/fileupload', function(req, res) {
    console.log(" ---- Uploading Profile Image    "   );
    //console.log(" fileupload... " , req.busboy );
    var fstream;
    var localPath; 
    var localFileName;
    var fileExt = ".jpg"; //set all to jpg

    try{

        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
                console.log("Uploading: " + filename); 

                localPath = path.resolve(__dirname) + "\\tempPics\\";
                localFileName = filename;       
                console.log ( "path: " + path.resolve(__dirname) );

                fstream = fs.createWriteStream( path.resolve(__dirname) + "\\tempPics\\" + filename);
                file.pipe(fstream);
                fstream.on('close', function () {                            
                    res.send("uploaded successuly");
                });
        });

        req.busboy.on('field', function(fieldname, val) {     
              //console.log(fieldname, val);
              var oldPath = localPath + "" + localFileName;       
              var newPath = localPath + "" + val + "" + fileExt;       
              if( oldPath || newPath ) {
                fs.rename( oldPath , newPath , function (err) {
                    console.log('File renamed successuly '); 
                });
              } 
        });

    }catch(Excpetion ) {
         console.log(Excpetion);
         res.send("Unexpected Excpetion" , Excpetion);
    }
});
 
 
router.post('/updateprofile', function(req, res, next) {
  
  console.log('/updateprofile  '  , req.body );
  console.log( req.body  );

  var docId = req.body._id;
  var query = { _id: docId };   

  var secmobile = req.body.secmobile || "";  
  var aboutdetails = req.body.aboutdetails || "";  
  var businessname = req.body.businessname || "";  
  var city = req.body.city || "";  
  var region = req.body.region || "";   
  var address = req.body.address || "";
  var nearlandmark = req.body.nearlandmark || "";
  var altername = req.body.altername || "";
  var altermobile = req.body.altermobile || "";
  var cuisines = req.body.cuisines || "" ;
  var speciality = req.body.speciality || "" ;
  var foodstory = req.body.foodstory || "" ;
  var previousImg = req.body.img ||  "";
  var previousImgPublic_id = req.body.imgpublicid ||  "";
  var updateProfileImg = req.body.doUpdateImg || false;

  console.log("---------->>> previousImg " , previousImg );
  var serverImgPath;
  var cloudinaryImgPath;
  var newImgPublic_id;
 
 try{

      User.findOne( {'_id': req.body.regisId._id }, function (err, user) {
        if (err) {
           console.log(err.name);
           return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
        }
         if (user) {
          user.username = req.body.regisId.username;
          user.mobile = req.body.regisId.mobile;
          user.email = req.body.regisId.email;
         
            user.save(function (err){
              if(err){ 
                return next(err); 
              }

  
                if( updateProfileImg === true ){
                  serverImgPath = path.resolve(__dirname) + "\\tempPics\\" + req.body.regisId.mobile + '.jpg';//default image
                   
                  console.log("Set Server serverImgPath path: " , serverImgPath );    
                  console.log( " ----- Going to upload on cloudinary  --------- ");

                    cloudinary.uploader.upload( serverImgPath ,function(result){
                      console.log( " ----- cloudinary File Upload successfully --------- ");
                      
                      console.log( result || result.url );

                      // set clound image path, in case of error set default image path
                      cloudinaryImgPath  = result ? result.url : config.defaultChefImgURL;
                      newImgPublic_id = result ? result.public_id : config.defaultChefImgPublicID ;
                      console.log( "cloudinary url - " , cloudinaryImgPath );
                      console.log( "cloudinary newImgPublic_id - " , newImgPublic_id );

                      var dtTime = new Date(); 
                      var days = ['SUN','MON','TUE','WED','THR','FRI','SAT'];
                      var dishAddTime =  days[dtTime.getDay()] + "-" + dtTime.getMonth() +"-"+ dtTime.getFullYear() + " " + dtTime.getHours() + ":" + dtTime.getMinutes();
                      
                      Profile.update( query , 
                        { 
                          secmobile: secmobile , aboutdetails: aboutdetails , businessname:businessname , city:city , 
                          region: region, address:address , nearlandmark:nearlandmark , altername:altername ,
                          altermobile: altermobile , cuisines:cuisines , speciality:speciality, foodstory: foodstory, 
                          img: cloudinaryImgPath , imgpublicid : newImgPublic_id ,
                          profiledate: dishAddTime  
                        }, 
                        { safe:true, upsert: true }, function(err, result){
                     
                          if(err) {
                              console.log('Error ' , err);
                              res.send( {error: err} );
                          }
                          else{
                              console.log(result );
                              console.log( " -----  Now delete file from Node Server --------- ");
                              try {
                                  fs.unlink( serverImgPath , function (err) {
                                      if (err) throw err;
                                      console.log('successfully deleted file');
                                  });
                              }catch(Exception) {
                                console.warn( Exception);
                              }
                              
                              // lets delete previous image
                              console.log("---------------- Calling Delete router ---------");
                              try {  
                                    console.log("---------->>> previousImgPublic_id " , previousImgPublic_id );             
                                    cloudinary.uploader.destroy( previousImgPublic_id  , function(result) { 
                                      console.log("delete status" , result); 
                                      res.send(" Profile DB:: Updated successfully.");    
                                    });
                              }catch(Exception) {
                                console.warn( Exception);
                                res.send(" Profile DB:: Updated successfully."); 
                              }
                                            
                          }           
                      });
               
                    }); // , { public_id: req.body.regisId.mobile } 

                } else {
                  //otherwise set default image
                  console.log('setting default image');
                  cloudinaryImgPath = previousImg || config.defaultChefImgURL; 

                  try{
                    var dtTime = new Date(); 
                    var days = ['SUN','MON','TUE','WED','THR','FRI','SAT'];
                    var dishAddTime =  days[dtTime.getDay()] + "-" + dtTime.getMonth() +"-"+ dtTime.getFullYear() + " " + dtTime.getHours() + ":" + dtTime.getMinutes();

                    Profile.update( query , 
                      { 
                        secmobile: secmobile , aboutdetails: aboutdetails , businessname:businessname , city:city , 
                        region: region, address:address , nearlandmark:nearlandmark , altername:altername ,
                        altermobile: altermobile , cuisines:cuisines , speciality:speciality, foodstory: foodstory, 
                        img: cloudinaryImgPath , profiledate: dishAddTime 
                      }, 
                      {safe:true, upsert: true}, function(err, result){
                     
                        if(err) {
                            console.log('Error ' , err);
                            res.send( {error: err} );
                        }
                        else{
                            console.log(result );
                            res.send(" Profile DB:: Updated successfully.");
                             
                        }           
                    });

                  }catch(Excpetion ) {
                     console.log(Excpetion);
                     res.send("Unexpected Excpetion" , Excpetion);
                  }
                  
                }
  
          
            }); //end User save

          } else {
          console.log('User does not exists.');
          return res.status(400).json(  {message: 'User does not exists.'} );
        }
        
        
    }); //end user search

  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }       


}); 


// update list a dish
router.post('/updatelistdish', function(req, res, next) {
  
  console.log('/updatelistdish  '  , req.body );
 //console.log(" updateprofile... " , req.busboy );
  var dishid = req.body.dishTableID;
  var query = { "_id" : dishid  };   
  var oneDishRecordID = req.body.dish._id || "";
  console.log( " --------------- query --------------- " , query );
   
  var dtTime = new Date(); 
  var days = ['SUN','MON','TUE','WED','THR','FRI','SAT'];
  var dishAddTime =  days[dtTime.getDay()] + "-" + dtTime.getMonth() +"-"+ dtTime.getFullYear() + " " + dtTime.getHours() + ":" + dtTime.getMinutes();

  var dishRecord = {  
    name : req.body.dish.name || "" , 
    type : req.body.dish.type || "",  
    descdish : req.body.dish.descdish || "", 
    servingtype : req.body.dish.servingtype || "", 
    servingquantity : req.body.dish.servingquantity || "", 
    cuisine : req.body.dish.cuisine || "", 
    features : req.body.dish.features || "", 
    dishphotos : req.body.dish.dishphotos || "",        
    price : req.body.dish.price || "", 
    discount : req.body.dish.discount || "" ,       
    advancebooking :  req.body.dish.advancebooking || "",   
    premake : req.body.dish.premake || "",
    regulardishes : [],
    regdishstatus: req.body.dish.regdishstatus || "",
    dishtime : dishAddTime
           
  }  
    
  var regDishArray ="" ;

  if( req.body.dish.regulardishes !=undefined ) {
     
    for(var i=0; i <  req.body.dish.regulardishes.length; i++) {

      console.log( req.body.dish.regulardishes[i] , req.body.dish.regulardishes[i]   );

      regDishArray = ( req.body.dish.regulardishes[i].weekday || "" ) +
          "," + ( req.body.dish.regulardishes[i].orderby || "" ) +
          "," + ( req.body.dish.regulardishes[i].readyby || "" ) +
          "," + ( req.body.dish.regulardishes[i].readyday || "" ) +
          "," + ( req.body.dish.regulardishes[i].pickfrom || "") +
          "," + ( req.body.dish.regulardishes[i].pickto || "") +
          "," + ( req.body.dish.regulardishes[i].qty || "" ) ;
          
         
         dishRecord.regulardishes.push( regDishArray );
         regDishArray = "" ;
    }
  }  
  
  //console.log( " ***************** dishRecord ************************* ");
  //console.log(  dishRecord );
  
  try{
      Dish.findOne( query ).exec(function (err, dishTable) {
        if(err){
            console.log("Dish DB find Error:::", err);
            return res.status(400).json({"Unexpected Error:: ": err});
        }
 
        console.log( dishTable );     

        if( dishTable.dishes != undefined && dishTable.dishes.length > 0) {
          var indexFound = 0;          
          for(var i=0; i < dishTable.dishes.length; i++ ) {                
            if( dishTable.dishes[i]._id == oneDishRecordID  ) {
               console.log("---- Found Index:" , i);
               indexFound = i;
               break; //exit from loop
            }
        } 

        console.log( "We found existing Dish so lets modify it" );
        dishTable.dishes[i].name = dishRecord.name;  
        dishTable.dishes[i].type  = dishRecord.type;
        dishTable.dishes[i].descdish  = dishRecord.descdish;
        dishTable.dishes[i].servingtype  = dishRecord.servingtype;
        dishTable.dishes[i].servingquantity  = dishRecord.servingquantity;
        dishTable.dishes[i].cuisine  = dishRecord.cuisine;
        dishTable.dishes[i].features  = dishRecord.features; 
        dishTable.dishes[i].dishphotos   = dishRecord.dishphotos ;       
        dishTable.dishes[i].price  = dishRecord.price;
        dishTable.dishes[i].discount  = dishRecord.discount ;       
        dishTable.dishes[i].advancebooking   = dishRecord.advancebooking ;       
        dishTable.dishes[i].premake  = dishRecord.premake ;      
        dishTable.dishes[i].regulardishes  = dishRecord.regulardishes;
        dishTable.dishes[i].regdishstatus  = dishRecord.regdishstatus;
        dishTable.dishes[i].dishtime  = dishRecord.dishtime;
        
        console.log("Lets save the modified Dish ");

        dishTable.save(function(err, model) {
             if(err){
              console.log("Dish DB Error:::", err);
              return res.status(400).json({"Unexpected Error:: ": err});
             }
             console.log( "Dish DB updated" , model);
              return res.json(model);
        });
         
      } else {
        console.log("--------- Adding first Dish-----------");
        dishTable.dishes.push( dishRecord );

        dishTable.save(function(err, model) {
          if(err){
            console.log("Dish DB Error:::", err);
            return res.status(400).json({"Unexpected Error:: ": err});
          }
          console.log( "Dish DB updated" , model);
          return res.json(model);
        });
      }        
    });

  } catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }
 
}); 


router.post('/uploaddishimages', function(req, res) {
    console.log(" ---- Uploading  dish images Image    "   );
    //console.log(" fileupload... " , req.busboy );
    var fstream;
    var localPath; 
    var localFileName;
    //var fileExt = ".jpg"; //set all to jpg
  try {

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        localPath = path.resolve(__dirname) + "\\tempPics\\";
        localFileName = filename;       
        console.log ( "path: " + path.resolve(__dirname) );
 
            fstream = fs.createWriteStream( localPath + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                    
                var cloudinaryImgPath = "";
                cloudinary.uploader.upload( localPath + filename ,function(result){
                    console.log( " ----- cloudinary File Upload successfully --------- ");
                    
                    console.log( result || result.url );
                    // set clound image path, in case of error set default image path
                    cloudinaryImgPath  = result ? result.url : "";                 
                    console.log( "cloudinary url - " , cloudinaryImgPath );
                    
                    try {
                        fs.unlink( localPath + filename , function (err) {
                          if (err) throw err;
                          console.log('successfully deleted file');
                        });
                    }catch(Exception) {
                      console.warn( Exception);
                      return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
                    }

                    res.json({furl: cloudinaryImgPath });
                });             
            });
        
    });

  }catch(Exception) {
      console.log( Exception);
      return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
  }
        
});

//----- Register Users -------------------------------------
router.post('/resetPassword', function(req, res, next){
  console.error("resetPassword   " ,req.body );
   
  try{

      User.findOne( {'mobile': req.body.mobileNo }, function (err, user) {
           
        if (err) {
           console.log(err.name);
           return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
        }
        if (user) {
          user.setPassword(req.body.password);
         
          user.save(function (err){
              if(err){ 
                return next(err); 
              }else {                              
                return res.status(200).json( {message: 'Password reset successfully.' } );
              }    
          });

        } else {
          console.log('User does not exists.');
          return res.status(400).json(  {message: 'User does not exists.'} );
        }
        
        
    });

  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }
   
});

router.param('delpicid', function(req, res, next, id) {
  console.log( " delpicid : " , id ) ;   
  try{

    if (id.length > 10 ) { 
              req.pictuerID = id;
              return next();
           
    } else {    
        res.send("Invalid request.");
    }

  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  } 
  
});

router.get('/delete/:delpicid', function(req, res) {
  console.log( "going to delete on Cloudiary .." , req.pictuerID);
  var _status = false;
  try{
    cloudinary.uploader.destroy( req.pictuerID , function(result) { 
        console.log(result);
        _status = true;
        res.send( { status: _status } );
    });

  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }

}); 
 

router.post('/deletedishrecord', function(req, res){
  console.log("inside /deletedishrecord  ::" );
  try{
      console.log( req.body );

      var query = { "_id" : req.body.dishTableID  };
      var selectedDishID = req.body.oneDishID ;
  
      Dish.findOne( query ).exec(function (err, records) {
       
        if(err) {
           console.log(err.name);
           return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
        }
        console.log(records);

        if (records) {  
          console.log("Found a Dish ..... so DELTE now");

          if( records.dishes != undefined && records.dishes.length > 0) {
            var indexFound = 0;          
            for(var i=0; i < records.dishes.length; i++ ) {                
              if( records.dishes[i]._id == selectedDishID  ) {
                 console.log("---- Found Index:" , i);
                 console.log( records.dishes[i] );
                 indexFound = i;
                 break; //exit from loop
              }
            } 
          } 
          
          records.dishes.pull({ _id : selectedDishID });
          records.save(function(err, model) {
              if(err){
                console.log("Dish DB Error:::", err);
                return res.status(400).json({"Unexpected Error:: ": err});
              }
               console.log('Dish has been removed successfully.');
               return res.status(200).json(  {message: 'Dish has been removed successfully.'} );  
          }); 
 
        } else {
          console.log('Dish does not exists.');
          return res.status(400).json(  {message: 'Dish does not exists.'} );
        }       
        
    }); 

  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }
   
});
  
router.post('/deletechefprofile', function(req, res){
  console.log("inside /deletechefprofile  ::" );
  try{
    console.log( req.body );
 
    Profile.find( { "_id" : req.body.profileId  } ).remove(function (err ) {       
        if(err) {
           console.log(err.name);
           return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
        }  
        console.log("Profile schema record deleted, now deleting uer schema record.");

        User.find( { "_id" : req.body.chefID  } ).remove(function (err ) {       
          if(err) {
             console.log(err.name);
             return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
          }      
        }); 

        Dish.find( { "user" : req.body.chefID  } ).remove(function (err ) {       
          if(err) {
             console.log(err.name);
             return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
          }      
        }); 

        MarkedChef.find( { "chefid" : req.body.profileId  } ).remove(function (err ) {       
          if(err) {
             console.log(err.name);
             return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
          }      
        });

        MarkedDish.find( { "chefid" : req.body.chefID  } ).remove(function (err ) {       
          if(err) {
             console.log(err.name);
             return res.status(400).json(  {message: 'Something went wrong, please try again.' }  );
          }      
        });

        console.log('Dish has been removed successfully.');
        return res.status(200).json(  {message: 'Dish has been removed successfully.'} );  

    }); 
     
  }catch(Excpetion ) {
     console.log(Excpetion);
     res.send("Unexpected Excpetion" , Excpetion);
  }
   
});

// Get All Orders 
router.get('/getallorders', function(req, res, next) {
  console.log( "/getallorders " ) ;
   
  try{      
    Order.find({}).exec( function(err, orders){ //.populate("regisId")
      if(err){ 
        return res.status(400).json({"Unexpected Error:: ": err});
      } 
      var alldishes = [];
       async.each( orders, 
          function(record, TopCallback){ 
              var updatedDishes = [];
            async.waterfall([
                  function(callback) {
                    console.log("record.dishes ");
                    record.populate("foodie", function(err, foodie) {
                     // record.foodie = foodie;
                      callback(null , record.dishes );
                    });
                                                                    
                  },                                    
                  function(userData , callback) {
                    if(userData !=null) {
                      console.log( userData );
                      record.dishes = userData;
                      alldishes.push( record );      
                    }                           
                    callback(null, 'done');
                  }
                ], function (err, result) {                       
                    TopCallback();
                });

            },function(err ){ // All tasks are done now                        
              console.log(alldishes.length);

              res.json(alldishes);                
        }); 
  
    });
  }catch(Exception ) {
     console.log(Exception);
     res.status(400).json({"Unexpected Exception:: ": Exception});
  }

});

// get one Chef Specific Orders listings only
router.post('/getcheflistoforders', function(req, res, next) {
  console.log( "/getcheflistoforders " ) ;
  console.log( req.body );

  try{
     var pId = require('mongoose').Types.ObjectId;
     var chefid = new pId( req.body.chefid );

     var query = {"dishes.purchfromchef" : chefid };

     Order.find(query , function(err, orders){
        if(err){ 
          return next(err); 
        }
      console.log(orders);

      res.json(  orders );
    });

  }catch(Exception ) {
     console.log(Exception);
     res.status(400).json({"Unexpected Exception:: ": Exception});
  }

});

router.post('/updatechefstatus', function(req, res, next) {
  console.log( "/updatechefstatus " ) ;
  console.log( req.body );

  try{
     var pId = require('mongoose').Types.ObjectId;
     var profileid = new pId( req.body.profileid );
     var chefID = new pId( req.body.chefId );
     var query = {"_id" : profileid };
 
      Profile.findOne(query , function(err, profile){
        if(err){ 
          return next(err); 
        }
     
        profile.endorsed = req.body.endorsed  ;
        profile.featuredchef = req.body.featuredchef  ;
        profile.verifiedchef = req.body.verifiedchef  ;
     
        profile.save(function(err, model) {
          if(err){
            console.log("Profile update Error:::", err);
            return res.status(400).json({"Unexpected Error:: ": err});
          }

          console.log( " Profile saved ---- now saving in MarkedChef ..");

          var qry = { 'chefid' : chefID } ;

          // save/update in the MarkedChef schema for welcome page /dashbaord
          MarkedChef.findOneAndUpdate( qry , 
              { 
                
                profileid: req.body.profileid,
                name: req.body.name,
                img : req.body.img,
                dishes: req.body.dishes,
                endorsed : req.body.endorsed,
                featuredchef : req.body.featuredchef,
                verifiedchef : req.body.verifiedchef
              }, 
              { upsert : true }, 
              function(err, doc){
                if(err){
                  console.log("MarkedChef Error:::", err);
                  return res.status(400).json({"Unexpected Error:: ": err});
                }
                console.log( doc);
                console.log('Profile has been updated successfully.');
                return res.status(200).json(  {message: 'Profile has been updated successfully.'} );  
              }
          );

          
       });       
    }); 

  }catch(Exception ) {
     console.log(Exception);
     res.status(400).json({"Unexpected Exception:: ": Exception});
  }

});


router.post('/updatedishstatus', function(req, res, next) {
  console.log( "/updatechefstatus " ) ;
  console.log( req.body );

  try{
     var pId = require('mongoose').Types.ObjectId;
     var objID_chefid = new pId( req.body.chefid );
     var dishid = req.body.dishId;
     var query = {"user" : objID_chefid };
 
      Dish.findOne(query , function(err, allDishes){
        if(err){ 
          return next(err); 
        }
        var index = 0;
         
        for(var i = 0, dishCount = allDishes.dishes.length; i < dishCount; i++) {
            console.log( allDishes.dishes[i].name );
          if(allDishes.dishes[i]._id == dishid ){
            console.log(" Dish match found  ");
            console.log( i );
            index = i;
            break;
          }
        }
       
        allDishes.dishes[index].isactive = req.body.isactive;
        allDishes.dishes[index].featured = req.body.featured;
        allDishes.dishes[index].popular = req.body.popular;
 
        allDishes.save(function(err, model) {
          if(err){
            console.log("Dish update Error:::", err);
            return res.status(400).json({"Unexpected Error:: ": err});
          }
  
          var qry = { 'chefid' : objID_chefid } ;
          
          //console.log( " Dish saved ---- now saving in MarkedDishes ..");

          // save/update in the MarkedDish schema for welcome page /dashbaord
          MarkedDish.findOne( qry,function(err, doc){
                if(err){
                  console.log("MarkedDish Error:::", err);
                  return res.status(400).json({"Unexpected Error:: ": err});
                }
                //console.log( doc);
 
                if( doc == null ){
                  doc = new MarkedDish();
                  doc.chefid = objID_chefid;
                }
                var found = false;
                for(var i = 0, dishCount = doc.dishes.length; i < dishCount; i++) {                    
                  if(doc.dishes[i].dishId == dishid){
                    found = true;
                    break;
                  }
                }

                if( found ){
                      console.log('Dish already exists.');
                      return res.status(200).json({message: 'Dish has been updated successfully.'} );
                }else{
                    doc.dishes.push( { 'dishId' : dishid });
                    doc.save(function(err, model) {
                      if(err){
                        console.log("Dish update Error:::", err);
                        return res.status(400).json({"Unexpected Error:: ": err});
                      }
                      console.log('Dish has been updated successfully.');
                      return res.status(200).json({message: 'Dish has been updated successfully.'} );
                    });
                }
 
              }
          );  
       });       
    }); 

  }catch(Exception ) {
     console.log(Exception);
     res.status(400).json({"Unexpected Exception:: ": Exception});
  }

});


router.post('/updateorderstatus', function(req, res, next) {
  console.log( "/updateorderstatus " ) ;
  console.log( req.body );

  try{
     var pId = require('mongoose').Types.ObjectId;
     var objID_orderId = new pId( req.body.orderId ); 
     var query = {"_id" : objID_orderId };
 
     Order.findOne(query , function(err, order) {
        if(err){
          console.log("Order update Error:::", err);
          return res.status(400).json({"Unexpected Error:: ": err});
        }
        console.log( order );
        order.status = req.body.status;
        order.action = req.body.action;

        order.save(function(err, doc){
          if(err){
            console.log("Order update Error:::", err);
            return res.status(400).json({"Unexpected Error:: ": err});
          }
          console.log('Order has been updated successfully.');
          return res.status(200).json({message: 'Order has been updated successfully.'} );

        });

     });


 }catch(Exception ) {
     console.log(Exception);
     res.status(400).json({"Unexpected Exception:: ": Exception});
  }

})

router.get('/getAllSubscribeUsers',function(req,res){
    userSubscribeEmail.find({},function(err,data){
        res.send({
            err:err,
            data:data
        })
    })
})

router.post('/postAllQuestionAnswer',function(req,res){
    var curDate = new Date();
    //var days = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];
    var tempDate = curDate.getDate() + "-" + (curDate.getMonth() + 1 < 10 ? "0" + (curDate.getMonth() + 1) : (curDate.getMonth() + 1) ) + "-" + curDate.getFullYear();
    /*categoryQuestionAnswer*/
    var category = req.body.category;
    var skill = req.body.skill;
    var question = req.body.Question;
    var answer = req.body.Answer;


    var questionanswer_info = new categoryQuestionAns({
        category:category,
        skill:skill,
        Question:question,
        answer:answer,
        InsertedDate:tempDate
    })
    questionanswer_info.save(function(err,data){
        res.send({
            err:err,
            data:data
        })
    })

})

router.get('/getallCategoryList',function(req,res){
    categoryQuestionAns.find({},function(err,data){
        res.send({
            err:err,
            data:data
        })
    })
})

router.post('/getperticularSkill',function(req,res){
//console.log('API CALL');
    var perticulercategory  = req.body.categoryField;

    categoryQuestionAns.find({
        category:perticulercategory
    },function(err,data){
        res.send({
            err:err,
            data:data
        })
    })

})
router.post('/getskillQuestion',function(req,res){
    var perticulerfield = req.body.skillFieldPerticuler
    categoryQuestionAns.find({
        skill:perticulerfield
    },function(err,data){
        res.send({
            err:err,
            data:data
        })
    })
});
router.post('/categorySkill',function(req,res){
    var category = req.body.category;
    var skill = req.body.skill;

    var categorySkill_info = new categorySkill({
        category:category,
        skill:skill
    })
    categorySkill_info.save({},function(err,data){
        res.send({
            err:err,
            data:data
        })
    })
})
//for all  unknown pages
router.use(function(req,res){
    res.render('error');
});
 
module.exports = router;