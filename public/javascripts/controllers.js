'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', ['appServices','appDirectives']);
 
appControllers.controller('userProfileControler', ['$scope','$state','$stateParams','ProfileService', 'auth' ,  
    'ListDishService' , '$anchorScroll' , '$location', 'uploadsService', 'fileReader',
  function($scope, $state, $stateParams, ProfileService, auth, ListDishService , $anchorScroll , $location , uploadsService, fileReader){ 
  
  $scope.isError =  false;
  $scope.isError2 =  false;
  $scope.errorMessage = "";  
  $scope.errorMessage2 = "" ;

  $scope.allDishesArray = [];
  $scope.isEmpty = false; 

  var chefId = $stateParams.u;

  $scope.defaultDishImg = "images/dishImg.png";
 
  $scope.doShowError = function() { 
    return $scope.isError; 
  }
  $scope.hideShowError = function(tohideShow) { 
    $scope.isError = tohideShow; 
  }
  $scope.doShowError2 = function() { 
    return $scope.isError2; 
  }
  $scope.hideShowError2 = function(tohideShow) { 
    $scope.isError2 = tohideShow; 
  }

  $scope.cityList = [      
    { name: "Karachi" }
  ];
  $scope.selectedCity = "";

  $scope.listOfRegions = [     
    { name: "Airport" }, { name: "AKUH" }, { name: "Ayesha Manzil" } , { name: "Bahadurabad"},
    { name: "Baloch Colony"}, {name: "Bath Island"}, {name: "Burns Road"}, {name: "CANTT"},
    { name: "Clifton"}, { name: "DHA (All Phases)" }, {name: "Federal B. Area"}, { name: "Frere Town"},
    { name: "Garden East/West" }, { name: "Gizri"}, { name: "Gulistan-e-Jauhar" }, { name: "Gulshan-e-Jamal"},
    { name: "Gulshan-e-Iqbal" }, { name: "Guru Mandir" },{ name: "Hill Park" }, {name: "Hyderi" }, 
    { name: "II Chundrigar Road"}, { name: "Jamshed Road"}, { name: "Karimabad"}, { name: "Karsaz"},
    { name: "Kashmir Road" }, { name: "KDA"}, {name: "Khalid Bun Waleed Road"}, {name: "Kharadar"},
    { name: "KMCHS"}, { name: "Korangi Industrial Area" }, { name: "Liaquatabad"}, {name: "M.T. Khan Road"},
    { name: "Malir Cantt" }, { name: "Mohammad Ali Society"}, { name: "Muslimabad"}, {name: "Nagan Chowrangi"}, 
    { name: "National Stadium"}, { name: "KMCHS" }
  ];
  $scope.selectedRegion = "";

  $scope.listOfCuisines = [ { name: "American" }, { name: "Asian Fusion" },{ name: "BBQ" }, { name: "British" },
        { name: "Caribbean" }, { name: "Chinese" }, { name: "Continental" },{ name: "East European" },{ name: "European" },
        { name: "French" }, { name: "Italian" },{ name: "Japanese" }, { name: "Lebanese" }, { name: "Mexican" },
        { name: "Moroccan" }, { name: "Indian" }, { name: "Pakistani" },{ name: "Portuguese" },{ name: "Spanish" },
        { name: "Srilankan" }, { name: "Thai" }, { name: "Turkish" }, { name: "Vietnamese" } ,
        { name: "Other" }
    ];
  $scope.selectedCuisine = "";
  $scope.selListOfCuisinesArray = [];
  
  $scope.imageSrc = "";
 
  $scope.isProfilePicUploaded = false;
  $scope.defaultProfileImg = "http://res.cloudinary.com/homechefpk/image/upload/v1440681644/defaultChefImg_cr4jou.png";

  $scope.getFile = function () {
      console.log( "getFile..." , $scope.file );
      $scope.uploadFile( $scope.file , $scope.userProfile.regisId.mobile );
      
      $scope.isProfilePicUploaded = false;
      $("#profilePicProgressId").show();
      $("#profilePicProgFailedMsgId").hide();

      fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
      });
  };
  
  $scope.uploadFile = function(files , usermobile) {
      uploadsService.uploadFile(files, usermobile).then(function(promise){
          $scope.userProfile.doUpdateImg = true;  
          $scope.code = promise.code();
          $scope.fileName = promise.fileName();

          $scope.isProfilePicUploaded = true;
          $("#profilePicProgressId").hide();

      }).catch(function(e){

        console.log("got an error in upload",e);
        $("#profilePicProgressId").hide();
        if( ! $scope.isProfilePicUploaded ) {          
          $("#profilePicProgFailedMsgId").show();
        }
    
    });
  };

  $scope.init = function() { 
      $("#profilePicProgressId").hide();
      $("#profilePicProgFailedMsgId").hide();
        console.log("Open Profile for Edit: ", chefId);

        ProfileService.populateUserProfile(chefId).then(function(results){
          $scope.userProfile = results.data;
          $scope.selListOfCuisinesArray = $scope.userProfile.cuisines || [];  
          if( $scope.userProfile.img !=undefined ) {
            
            $scope.imageSrc = $scope.userProfile.img;
          }
          
          $scope.userProfile.endorsed = $scope.userProfile.endorsed   ? "Yes" : "No";
          $scope.userProfile.featuredchef = $scope.userProfile.featuredchef  ? "Yes" : "No";
          $scope.userProfile.verifiedchef = $scope.userProfile.verifiedchef  ? "Yes" : "No";
           
          //console.log( "userProfileControler :" , $scope.userProfile );    
        });

        ListDishService.populateAllUserDishes(chefId).then(function(results){
          if( results.data.dishes) {
            $scope.allDishesArray = results.data.dishes;
            $scope.isEmpty = true;
          } else {
            $scope.allDishesArray = [];
            $scope.isEmpty = false;
          }          
          console.log("$scope.allDishesArray " , $scope.allDishesArray);
          
        });

  };

  $scope.init();

  $scope.showTabs =function(tabID) {
      var tabToShow = '#profileTab a[href="#'+ tabID + '"]';
      if( tabID === "profileAboutTab") {
          $(tabToShow).tab('show');
      }
      
      if( tabID === "profileCookingTab") {
        if( !$scope.userProfile.regisId.username || $scope.userProfile.regisId.username.length < 3 ) {
            return;
        }
        if( !$scope.userProfile.aboutdetails || $scope.userProfile.aboutdetails.length < 20 ) {           
          return;
        }
        if(  !$scope.userProfile.city || $scope.userProfile.city == "" ) {           
          return;
        }
        if(  !$scope.userProfile.region || $scope.userProfile.region == "" ) {
            return;
        }

        $(tabToShow).tab('show');
      }
        
      if( tabID === "profileImageTab") {
        if( !$scope.userProfile.regisId.username || $scope.userProfile.regisId.username.length < 3 ) {
            return;
        }
        if( !$scope.userProfile.aboutdetails || $scope.userProfile.aboutdetails.length < 20 ) {           
          return;
        }
        if(  !$scope.userProfile.city || $scope.userProfile.city == "" ) {           
          return;
        }
        if(  !$scope.userProfile.region || $scope.userProfile.region == "" ) {
            return;
        }
        if( $scope.selListOfCuisinesArray.length < 1 ) {         
          return;
        }
          $(tabToShow).tab('show');
      }
       
  }
 
  $scope.updateUserProfile =function( profile , page) {
    console.log( " updating ..." , profile._id , page , profile.city , profile.region );
    $scope.errorMessage =  "";
    $scope.errorMessage2 = "";
    profile.doUpdateImg = false;
    var $btn = "";

    if( page === 'first') {
      $btn = $("#btnProfileSaveBtn1"); 
      console.log( "first page..");
      if( !profile.regisId.username || profile.regisId.username.length < 3 ) {
        
        $scope.usernameError = "Please enter a valid name.";
        $location.hash('userProfileregisIdusername');       
        $anchorScroll();
        return;
      }
      if( !profile.aboutdetails || profile.aboutdetails.length < 20 ) {         
        $scope.aboutdetailsError = "Please enter a brief introduction about yourself." ;         
        $location.hash('userProfileaboutdetails');       
        $anchorScroll();
        return;
      }
      if(  !profile.city || profile.city == "" ) {         
        $scope.cityError = "Please select a city." ;
        $location.hash('userProfilecity');       
        $anchorScroll();
        return;
      }
      if(  !profile.region || profile.region == "" ) {        
        $scope.regionError = "Please select a city, zone/region.";
        $location.hash('userProfileregion');       
        $anchorScroll();
        return;
      }
      if( !profile.address || profile.address.length < 5 ) {         
        $scope.addressError = "Please enter a valid address." ;
        $location.hash('userProfileaddress');       
        $anchorScroll();
        return;
      } 
    }
    if( page === 'second') {
      $btn = $("#btnProfileSaveBtn2"); 
      console.log( "second page.." , $scope.selListOfCuisinesArray , $scope.selListOfCuisinesArray.length );

      if( $scope.selListOfCuisinesArray.length < 1 ) {         
        $scope.selectedCuisineError = "Please add some cuisines." ; 
        $location.hash('selectedCuisineId');       
        $anchorScroll();
        return;
      }
      profile.cuisines = $scope.selListOfCuisinesArray ;
    }

    
    $btn.html("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");
    
    ProfileService.updateProfile(profile).then(function(results){  
      console.log( " updated succesfuly ..."   );      
        console.log( results ); 
        $location.hash('columns');       
        $anchorScroll();   
        if( page === 'first' ) {
          $('#profileTab a[href="#profileCookingTab"]').tab('show');          
        } 
        if( page === 'second' ) {
          $('#profileTab a[href="#profileImageTab"]').tab('show');
        } 
        $btn.html("Save and Continue");
    });         
  };

  $scope.resetUserPassword =function(umobile) {
    var pass = $("#newPass").val();

    if( pass && pass.length > 5 ){
        console.log("resetUserPassword... " , umobile , $("#newPass").val() );
        var user = { 
            mobileNo: umobile,
            password: pass
        }
        ProfileService.passwordReset(user).then(function(results){  
              console.log( "Password updated succesfuly ..."  , results );      
              alert("Password updated succesfuly.");
        });

    } else {
      alert("Password must be more than 5 characters");
    }
      
  };

  $scope.saveShowProfilePreview = function( profile) {
    var $btn = $("#btnProfilePreview"); //.button('loading');
    $btn.html("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");
     
    ProfileService.updateProfile(profile).then(function(results){
        $btn.html("Submit and Preview");
        $state.go('profilepreview', { u: profile.regisId._id } );    
    });         
  };

  $scope.editProfile = function( chefId) {   
    $state.go('editprofile' , {u: chefId });
  }
   
  $scope.logOut = function(){       
    auth.logOut()        
    $state.go('dashboard');      
  };

  $scope.helpScreen = function(){              
    $state.go('help');      
  };
   
  $scope.userDashboard = function(){              
    $state.go('userDashboard');     
  };
    
  $scope.showListDishesScreen = function(){              
    $state.go('userlistdishes');      
  };

  $scope.showAddDishScreen = function(){ 
    ListDishService.toPopulate = false; 
    ListDishService.selectedDishID = "";              
    $state.go('listDishes');      
  };
    
  $scope.AddCuisines = function() {
      $scope.isError2 =  false;
      console.log("AddCuisines..."   );
      if( $scope.selectedCuisine.name !=undefined && $scope.selListOfCuisinesArray.indexOf( $scope.selectedCuisine.name ) < 0 )
        $scope.selListOfCuisinesArray.push ( $scope.selectedCuisine.name ) ;
    console.log( $scope.selListOfCuisinesArray );
       
  }

  $scope.removeCuisines = function(item) {
      console.log("removeCuisines..." , item );
        $scope.selListOfCuisinesArray.splice( $scope.selListOfCuisinesArray.indexOf( item ) ,1 );
    console.log( $scope.selListOfCuisinesArray );
       
  }
  
  $scope.reloadRoute = function() {  
    window.location.reload(true);
  };

  $scope.deleteChefProfile = function(profileId, chefID, name){
      
      if($scope.allDishesArray.length > 0) {
        alert("Please delete all Dishes of this Chef before deleting his/her profile.");
        return;
      }
 
      var yesNo = confirm("Do you want to delete this Chef('" + name + "') Profile permanently?");
      if(yesNo  ) {
        console.log("deleting Pictures first...");

        var btn = $("#delChefProfileImgBtn");
        btn.html("<span class='glyphicon btn-danger glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");
    
        var imgUrl = $scope.userProfile.img;
        console.log(imgUrl , (imgUrl != $scope.defaultDishImg) );

        if( imgUrl && imgUrl.length > 5 && imgUrl != $scope.defaultDishImg ) {            
            var picID = imgUrl.substring( imgUrl.lastIndexOf("/") +1 , imgUrl.length - 4);
            console.log("Now delete profile Pic:: " , picID );

             ListDishService.removeDishImage(picID).then(function(results){  
              console.log("Profile image removed successfully.");              
            }); 
        }
          
        console.log( " ProfileID , chefID " , profileId , chefID ); 

        var profileDetails = {
          profileId: profileId,
          chefID:  chefID     
        }

        console.log( profileDetails );

        // now delete the Chef database record
         ProfileService.deleteChefProfile(profileDetails).then(function(results) {
            btn.html("Delete this Profile");
            alert("Profile has been deleted successfully.");
            $state.go("dashboard");
        }); 
 

      } else {
        console.log("do not delete");
      }     
  }

  $scope.showDishPreview = function(chefID, dishid) {
    console.log("showDishPreview ..." , chefID, dishid);
    ListDishService.toPopulate = true;
     
    $state.go('dishPreview' , { d: dishid , c: chefID  });
  }

  $scope.updateChefStatus = function(profileId){
    var totalDishes = $scope.allDishesArray && $scope.allDishesArray.length || 0;
    var obj = {
      profileid : $scope.userProfile._id,
      chefId: $scope.userProfile.regisId._id,
      name: $scope.userProfile.regisId.username,
      img: $scope.userProfile.img,
      dishes : totalDishes,
      endorsed : $scope.userProfile.endorsed == 'Yes' ? true : false ,
      featuredchef: $scope.userProfile.featuredchef == 'Yes' ? true : false ,
      verifiedchef : $scope.userProfile.verifiedchef == 'Yes' ? true : false  
    }
    console.log("updateChefStatus :" , obj );
    
    ProfileService.updateChefStatus( obj ).then(function(results) {            
      alert("Profile has been updated successfully.");  
    });
  }

  

}]); 
 
appControllers.controller('UserAllDishesControler', ['$scope','$state', '$stateParams', 'ProfileService',
 'ListDishService', 'auth',
 function($scope, $state, $stateParams , ProfileService, ListDishService, auth ){ 
 
  $scope.allDishesArray = [];
  $scope.isEmpty = false; 
  var chefId = $stateParams.u;

  $scope.init = function() { 
      //console.log( " populate UserAllDishesControler   ... " , chefId ); 
      //$scope.userName = auth.username;
      ProfileService.populateUserProfile(chefId).then(function(results){
      
          $scope.userProfile = results.data;
          console.log("UserAllDishesControler " , $scope.userProfile);
      });

      ListDishService.populateAllUserDishes(chefId).then(function(results){
          if( results.data.dishes) {
            $scope.record = results.data   ;
            $scope.allDishesArray = results.data.dishes;
            $scope.isEmpty = true;
          } else {
            $scope.allDishesArray = [];
            $scope.isEmpty = true;
          }
      });
  };

  // initialize on page show
  $scope.init();
 
  $scope.updateADishDetails = function(dishid) {
    console.log("updateADishDetails ..." , dishid);
    ListDishService.toPopulate = true;
    ListDishService.selectedDishID = dishid;
    auth.dishid = dishid;
    console.log("Dish ID Selected: " , auth.dishid );
    $state.go('listDishes');
  }

  $scope.showDishPreview = function(chefid, dishid) {
    console.log("showDishPreview ..." , chefid, dishid );
    ListDishService.toPopulate = true;
    $state.go('dishPreview' , {d: dishid , c: chefid });
  }

   

}]);


appControllers.controller('adminControler', ['$scope','$state', '$rootScope', '$stateParams' , 'UserService','$http',
 'ListDishService','auth',
 function($scope, $state, $rootScope, $stateParams , UserService, $http, ListDishService, auth){



$scope.listOfCategory = [];
     
     $scope.addquestionanswer = function(){

         if($scope.category == "" || $scope.skill =="" || $scope.Question =="") {
             /*console.log($scope.category , $scope.skill,$scope.Question,$scope.Answer);*/
             alert('fill the field first');
         }
         else {
             $http.post('/postAllQuestionAnswer', {
                 category: $scope.category,
                 skill: $scope.skill,
                 Question: $scope.Question,
                 Answer: $scope.Answer
             }).success(function (response) {
                 console.log(response)
                 $scope.category = ''
                 $scope.skill = ''
                 $scope.Question = ''
                 $scope.Answer = ''
             }).error(function (error) {
                 console.log(error);
             })
         }
     }

     $scope.getAllcategoryList = function(){
         $http.get('/getallCategoryList').success(function(response){
             console.log(response);
             $scope.listOfCategory = response.data;
         }).error(function(error){
             console.log(error);
         })
     }
$scope.getAllcategoryList();
$scope.viewSkills = function(index){
    console.log(index);

    $http.post('/getperticularSkill',{
        categoryField:index
    }).success(function(response){
        console.log(response)
        $scope.skillsArray = response.data;
        localStorage.setItem('skils',JSON.stringify($scope.skillsArray));
        $state.go('dashboard.allskils')
    }).error(function (error) {
        console.log(error)
    })

}
     $scope.category = '';
     $scope.skill = '';
     $scope.categorySkill = function(){
         if($scope.category == "" | $scope.skill == ""){
             alert('fill the field first');
         }
         else {
             $http.post('/categorySkill', {
                 category: $scope.category,
                 skill: $scope.skill
             }).success(function (response) {
                 console.log(response)
                 if (response.data == null) {
                     alert('this skill of this category is already in db')
                 }
                 else if (response.data != undefined) {
                     alert('data saved in db');
                     $scope.category = '';
                     $scope.skill = '';
                     $state.go('dashboard.allorders');
                 }
             }).error(function (error) {
                 console.log(error)
             })
         }
     }




  $scope.showAllCustomers = function() {
    UserService.getAllCustomers().then(function(results){
      if(results.data) {
        console.log("All Users:: " , results.data );
        $scope.customersArray = results.data;
        $state.go("dashboard.allusers");  
      } else {
        $scope.customersArray = {};
      }
            
    });
  };


     $scope.allSubscribeUsers = [];

     $scope.subscribeUsers = function(){
         $http.get('/getAllSubscribeUsers').success(function(result){
             console.log(result);
             $scope.allSubscribeUsers = result.data;
             console.log($scope.allSubscribeUsers[0].InsertedDate[0])
             $scope.ArraySubscriber = $scope.allSubscribeUsers

             $scope.lenght = $scope.allSubscribeUsers.length;
             $state.go('dashboard.subscribeusers')

         }).error(function(error){
             console.log(error);
         })
     }
     $http.get('/getAllSubscribeUsers').success(function(result){
         console.log(result);
         $scope.allSubscribeUsers = result.data;

         $scope.ArraySubscriber = $scope.allSubscribeUsers

         $scope.lenght = $scope.allSubscribeUsers.length;


     }).error(function(error){
         console.log(error);
     })

  $rootScope.getDiscount = function( dish ) {  
   
    if( dish.discount.discoutamount == "Buy 1 Get 1 Free" ) {         
      return dish.price;
    } else {
      var percet = 1;
      if( dish.discount.discoutamount == "10%") {           
        percet = 10/100;
      }
      if( dish.discount.discoutamount == "20%") {          
        percet = 20/100;
      }
      var orgPrice = dish.price; 
      console.log(orgPrice ,  percet );        
      return orgPrice - (orgPrice * percet);
    }
  } 
  
  $scope.showChefProfile =function(cusId) {
    console.log( "showChefProfile cusId ..." , cusId );
    //auth.userid = cusId;    
    $state.go("profilepreview" , { u: cusId } );  
        
  };

  $scope.showChefDishes =function(cusId) {
    console.log( "showChefDishes cusId ..." , cusId );
    //auth.userid = cusId ;
    //auth.username = username;
    $state.go("userlistdishes" , { u: cusId } );  
        
  };

  $scope.updateCustomerTextFields =function(  customer) {
    console.log( " updating ..." , customer._id );
    customers.updateCustRecord(customer).then(function(results){  
      console.log( " updating succesful ..."   );      
        console.log( results );      
    }); 
        
  };

  $scope.updateCustomer =function(customer) {
    console.log( " updating ..." , customer );
    customers.updateCustRecord(customer).then(function(results){             
        console.log( results );      
    });
  };
    
  $scope.showAllOrders = function() {
      $state.go('dashboard.allorders'); 
      console.log("Calling service - showAllOrders:: "  );
      ListDishService.getAllOrders().then(function(results){
        console.log(results);          
        $scope.allOrdersArray = results.data;
      });
  }


  $scope.showOrdersListings = function(){ 
    if($scope.isUserChef){                 
      $state.go('dashboard.chefallorders'); 
      console.log("Calling service - getChefListOfOrders:: " , auth.getLogInUserID());
      ListDishService.getChefListOfOrders({ chefid: auth.getLogInUserID() }).then(function(results){
          console.log(results);
          $scope.chefAllOrders = results.data;
      });

    }else{
      $state.go('dashboard.foodieallorders'); 
      console.log("Calling service - getFoodieListOfOrders:: " , auth.getLogInUserID());
      ListDishService.getFoodieListOfOrders({ foodieid: auth.getLogInUserID() }).then(function(results){
          console.log(results);
          $scope.foodieAllOrders = results.data;
      });
    }

  }; 

  $scope.changeOrderStatus = function(order) {
    console.log("changeOrderStatus " , order);
    ListDishService.setOrderDetails(order);
    $state.go('dashboard.orderupdate'); 

  }
 

  $rootScope.getDishTotal = function(price, delivery) {
    console.log("getDishTotal: " , price, delivery, ( parseInt(price) + parseInt(delivery) ) );
    return parseInt(price || 0) + parseInt(delivery || 0); 
  }

  $scope.formatDate = function(date) {
    console.log("formatDate: " , date , new Date(date) );
    return new Date(date); 
  }
 
  $scope.logOut = function(){       
    auth.logOut();       
    $state.go('dashboard');      
  };

}]); 

appControllers.controller('OrderDetailsController', ['$scope','$state','$stateParams','UserService',
 'ListDishService','auth','ProfileService','$http',
 function($scope, $state, $stateParams,UserService, ListDishService, auth, ProfileService,$http){

     $scope.skills = JSON.parse(localStorage.getItem('skils'));
     //console.log(JSON.parse($scope.skills));

$scope.allQuestionsAnswer = [];
     $scope.perticularskill = function(index){

         $http.post('/getskillQuestion',{
             skillFieldPerticuler:index
         }).success(function(response){
             console.log(response)
             //$state.go('dashboard.skillsQuestionsAnswer');
             $scope.allQuestionsAnswer = response.data;
             localStorage.setItem('questionArray',JSON.stringify($scope.allQuestionsAnswer))
             $state.go('dashboard.skillsQuestionsAnswer');
             //$scope.allQuestionsAnswer1 = $scope.allQuestionsAnswer
             console.log($scope.allQuestionsAnswer);
         }).error(function(error){
             console.log(error);
         })
     }
      $scope.answerArray =  JSON.parse(localStorage.getItem('questionArray'));


  $scope.orderDetails = ListDishService.getOrderDetails();

  $scope.init = function(){
    var allChefsIDs = [];
    $scope.allChefsDetails = []
    for (var i = 0, total = $scope.orderDetails.dishes.length; i < total; i++) {
      if( $.inArray($scope.orderDetails.dishes[i].purchfromchef , allChefsIDs ) < 0 ){
        allChefsIDs.push( $scope.orderDetails.dishes[i].purchfromchef );
      }  
    } 
    
    for (var i = 0, total = allChefsIDs.length; i < total; i++) {
    
       ProfileService.populateUserProfile(allChefsIDs[i]).then(function(results){
           console.log( results.data );
           $scope.allChefsDetails.push(results.data);
       });
    }
    console.log("  $scope.allChefsDetails" , $scope.allChefsDetails);
  }

  /*$scope.init();/!**!/*/

  $scope.updateOrderStatus = function(){
    var obj = {
      orderId : $scope.orderDetails._id,
      status: $scope.orderDetails.status,
      action: $scope.orderDetails.action  
    }

    console.log( obj );

    ListDishService.updateOrderStatus(obj).then(function(results){
      console.log(results);
      alert("Order has been updated");
    });

  }

  $scope.getDishDiscount = function(dish) {
    console.log("getDishDiscount: "  ,  dish.discount );
      if(  dish.discount == "Buy 1 Get 1 Free" ) {         
        return  dish.discount;
      } else {
        var percet = 1;
        if(  dish.discount == "10%") {
           
          percet = 10/100;
        }
        if(  dish.discount == "20%") {
          
          percet = 20/100;
        }
        var orgPrice = dish.price;         
        return  orgPrice - (orgPrice * percet);
      }
  }

   
}]);

appControllers.controller('listDishControler', ['$scope','$state', '$rootScope', '$location', '$anchorScroll' ,
  '$stateParams', 'ListDishService', 'auth' , 'fileReader', 'uploadsService',
  function($scope, $state, $rootScope, $location, $anchorScroll,$stateParams, ListDishService, auth, fileReader ,uploadsService ){ 
 
  var chefid = $stateParams.c;
  var dishId = $stateParams.d;
  //console.log( "inside listDishControler : chefid " , chefid , dishId);

  var curDate = new Date();
  var days = ['SUN','MON','TUE','WED','THR','FRI','SAT'];
  var tempDate = curDate.getDate() + "-" + (curDate.getMonth()+1 < 10 ?  "0"+ (curDate.getMonth()+1) : (curDate.getMonth()+1) ) + "-" + curDate.getFullYear();

  $scope.dish = {
    dishTableID: '',
    userid: auth.userid,
    name: "",
    type: "",
    descdish: "",
    servingtype: "",
    servingquantity: "1",
    cuisine: "",
    features: [ ],
    dishphotos: {
      mainphoto: "/images/dishImg.png",
      secphoto: "/images/dishImg.png",
      thirdphoto: "/images/dishImg.png"
    },
    price: "",
    discount: {
      status: false ,
      discoutamount: "10%",
      fromdate: tempDate,
      todate: tempDate
    },
    advancebooking: {
      status: false ,
        mindish: "1",
        orderby: "12 Hours"
    },
    premake: {
      status: false ,
        fromdate: tempDate,
        todate: tempDate,
        aftertime: "09:00 AM",
        orderby: "09:00 AM",
        quantity: "1"
    },
    regulardishes: [ ],
    regdishstatus: false       
  };

  $scope.mainPreviewImg = ""; 
  $scope.regulardishes = [ 
      {  weekday: "Mon", orderby: "09:00 AM",readyby:"09:00 AM", readyday:"Same day", 
        pickfrom: "09:00 AM", pickto: "09:00 AM", qty: "1" },
      { weekday: "TUE", orderby: "09:00 AM",readyby:"09:00 AM", readyday:"Same day", 
        pickfrom: "09:00 AM", pickto: "09:00 AM", qty: "1" } ,
      {  weekday: "WED", orderby: "09:00 AM",readyby:"09:00 AM", readyday:"Same day", 
        pickfrom: "09:00 AM", pickto: "09:00 AM", qty: "1" },
      { weekday: "THR", orderby: "09:00 AM",readyby:"09:00 AM", readyday:"Same day", 
        pickfrom: "09:00 AM", pickto: "09:00 AM", qty: "1" },
      {  weekday: "FRI", orderby: "09:00 AM",readyby:"09:00 AM", readyday:"Same day", 
        pickfrom: "09:00 AM", pickto: "09:00 AM", qty: "1" },
      {  weekday: "SAT", orderby: "09:00 AM",readyby:"09:00 AM", readyday:"Same day", 
        pickfrom: "09:00 AM", pickto: "09:00 AM", qty: "1" },
      {  weekday: "SUN", orderby: "09:00 AM",readyby:"09:00 AM", readyday:"Same day", 
        pickfrom: "09:00 AM", pickto: "09:00 AM", qty: "1" }      
  ];

  $scope.regularDishesArray = [];
  $scope.previewRegDishLabel = "";
  $scope.previewRegDishDetails = {};
  $scope.defaultDishImg = "/images/dishImg.png";

  $scope.toShowResulargDishDeletBtn = function() {
    return ( $scope.regularDishesArray.length > 1 );
  } 
  $scope.toShowResulargDishAddBtn = function() {
    return ( $scope.regularDishesArray.length < 7 );
  }

  $scope.isError =  false;
  $scope.isError2 =  false;
  $scope.errorMessage = "";  
  $scope.errorMessage2 = "" ;
  $scope.doShowError = function() { 
    return $scope.isError; 
  }
  $scope.hideShowError = function(tohideShow) { 
    $scope.isError = tohideShow; 
  }
  $scope.doShowError2 = function() { 
    return $scope.isError2; 
  }
  $scope.hideShowError2 = function(tohideShow) { 
    $scope.isError2 = tohideShow; 
  }


  $scope.listOfFeatures = [ 
        { name: "Gluten Free" }, { name: "Low Calorie" },
        { name: "Sugar Free" }, { name: "Vegetarian" } ,
        { name: "All Natural" }, { name: "Low Fat" }         
  ];

  $scope.selectedFeature = "";
  $scope.selListOfFeaturesArray = [];
  $scope.isImageUploadedSuccessfully = false;
  $scope.defaultDishImg = "/images/dishImg.png";

  $scope.loadDishForEdit = function() {

      console.log( "loadDishForEdit:  " , chefid , dishId ); 
      
      ListDishService.populateDishList(chefid , dishId).then(function(results){
        //console.log( "results ::" , results  );  
        //console.log( "results.data.d ::" , results.data.d );  
         
        if( results.data.d.dishes[0] ) {
          $scope.dishTableID = results.data.d._id;
          $scope.userName =  results.data.d.user.username;
          $scope.userEmail =  results.data.d.user.email;
          $scope.businessname =  results.data.busname;
          $scope.usermobile = results.data.d.user.mobile;          
          $scope.dish = results.data.d.dishes[0];
          $scope.dish.regdishstatus = results.data.d.dishes[0].regdishstatus;           
          $scope.mainPreviewImg = $scope.dish.dishphotos.mainphoto || "/images/dishImg.png";           
          $scope.selListOfFeaturesArray = $scope.dish.features ;
 
          for(var i=0; i < $scope.dish.regulardishes.length; i++ ) {
            var recArray = $scope.dish.regulardishes[i].split(",");
            if( recArray.length === 7 ){
                var obj = { 
                      weekday: recArray[0], 
                      orderby: recArray[1],
                      readyby:recArray[2],
                      readyday:recArray[3], 
                      pickfrom: recArray[4],
                      pickto: recArray[5],
                      qty: recArray[6] 
                    };

                $scope.regularDishesArray.push(obj);
 
                var today = days[ curDate.getDay() ];
                var d = curDate.getDay() < 6 ? curDate.getDay()+1 : 0 ;
                var tomorrow = days[d];

                if( recArray[0] == today ) {
                  $scope.previewRegDishLabel = "Today";
                  $scope.previewRegDishDetails = { 
                      weekday: recArray[0], 
                      orderby: recArray[1],
                      readyby:recArray[2],
                      readyday:recArray[3], 
                      pickfrom: recArray[4],
                      pickto: recArray[5],
                      qty: recArray[6] 
                    }; 
                } else if ( recArray[0] == tomorrow ) {
                  $scope.previewRegDishLabel = "Tomorrow";
                  $scope.previewRegDishDetails = { 
                      weekday: recArray[0], 
                      orderby: recArray[1],
                      readyby:recArray[2],
                      readyday:recArray[3], 
                      pickfrom: recArray[4],
                      pickto: recArray[5],
                      qty: recArray[6] 
                    }; 
                } else {
                  var weekDays = { SUN: 'Sunday', MON:'Monday',TUE:'Tuseday',
                      WED:'Wednesday',THR:'Thursday',FRI:'Friday',SAT:'Saturday'
                  };
                  var theDay = weekDays[ recArray[0] ];

                  $scope.previewRegDishLabel = theDay ;
                  $scope.previewRegDishDetails = { 
                      weekday: recArray[0], 
                      orderby: recArray[1],
                      readyby:recArray[2],
                      readyday:recArray[3], 
                      pickfrom: recArray[4],
                      pickto: recArray[5],
                      qty: recArray[6] 
                    }; 
                }
            }           
          }

          if($scope.dish.advancebooking && $scope.dish.advancebooking.status === true) {
            $("#chBoxAdvDishes").prop('checked', $scope.dish.advancebooking.status ); 
          }
              
          if($scope.dish.premake && $scope.dish.premake.status === true) {
            $("#chBoxPreMakeDishes").prop('checked', $scope.dish.premake.status);
            $('#dtPickerPremakeFrom').datetimepicker({format:'DD-MM-YYYY' }); 
            $('#dtPickerPremakeFrom').val( $scope.dish.premake.fromdate ); 

            $('#dtPickerPremakeTo').datetimepicker({format:'DD-MM-YYYY' });    
            $('#dtPickerPremakeTo').val( $scope.dish.premake.todate ); 
          }
              
          if($scope.dish.regdishstatus && $scope.dish.regdishstatus  === true) {
              $("#chBoxRegulrDishes").prop('checked', $scope.dish.regdishstatus  ); 
          }

          if($scope.dish.discount && $scope.dish.discount.status === true) {
            $("#chBoxOfferDiscount").prop('checked', $scope.dish.discount.status ); 
            $('#dtPickerDiscFrom').datetimepicker({format:'DD-MM-YYYY' });  
            $('#dtPickerDiscFrom').val(  $scope.dish.discount.fromdate );

            $('#dtPickerDiscTo').datetimepicker({format:'DD-MM-YYYY' });
            $('#dtPickerDiscTo').val( $scope.dish.discount.todate );
          }
          console.log(" $scope.dish ::" , $scope.dish );
          $scope.dish.popular = $scope.dish.popular   ? 'Yes' : 'No';
          $scope.dish.featured = $scope.dish.featured  ? 'Yes' : 'No';

          //this condition is reverse applied
          $scope.dish.isactive = $scope.dish.isactive ? 'Yes' : 'No';
        }          
    });

  }

  $scope.init = function() { 
    
        console.log(" Init().... toPopulate , selectedDishID " , ListDishService.toPopulate , ListDishService.selectedDishID);
        $("#dishPicProgId").hide();
        $("#dishPicProgFailedMsgId").hide();
        $scope.isImageUploadedSuccessfully = false;
        try{
              if( ListDishService.toPopulate ) {
                  $scope.loadDishForEdit();
                  //ListDishService.toPopulate = false;
              } else {
                //reset array and add one day
                $scope.regularDishesArray = [];          
                $scope.regularDishesArray.push($scope.regulardishes[0]); 

                /***** Todo *****/
                // ---- Temporarily show current user , later on pull proper user name
                $scope.userName =  auth.currentUser();
                /***** Todo *****/

                //initialize datepickers         
                var todayDate = new Date();
                var day = todayDate.getDate();
                var month = todayDate.getMonth() + 1;
                var year = todayDate.getFullYear();
                $('#dtPickerDiscFrom').datetimepicker({format:'DD-MM-YYYY' });  
                $('#dtPickerDiscFrom').val( day + "-" + month + "-" + year );      
                $('#dtPickerDiscTo').datetimepicker({format:'DD-MM-YYYY' });
                $('#dtPickerDiscTo').val( day + "-" + month + "-" + year );             
                $('#dtPickerPremakeFrom').datetimepicker({format:'DD-MM-YYYY' }); 
                $('#dtPickerPremakeFrom').val( day + "-" + month + "-" + year );               
                $('#dtPickerPremakeTo').datetimepicker({format:'DD-MM-YYYY' });    
                $('#dtPickerPremakeTo').val( day + "-" + month + "-" + year ); 

              }
        }catch(Exception) {
          console.log(Exception);
        }        
  
  };

  $scope.init();

  $scope.editCurrentDishDetails = function(){
    ListDishService.toPopulate = true;     
    $state.go("listDishes" , {d: dishId , c: chefid });
  }

  $scope.deleteADish = function(dishId, dishName){
      
      var yesNo = confirm("Do you want to delete this Dish ('" + dishName + "') permanently?");
      if(yesNo  ) {
        console.log("deleting Pictures first...");

        var btn = $("#delDishImgBtn");
        btn.html("<span class='glyphicon btn-danger glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");
    
        var imgUrl = $scope.dish.dishphotos.mainphoto;
        console.log(imgUrl , (imgUrl != $scope.defaultDishImg) );
        if( imgUrl && imgUrl.length > 5 && imgUrl != $scope.defaultDishImg ) {            
            var picID = imgUrl.substring( imgUrl.lastIndexOf("/") +1 , imgUrl.length - 4);
            ListDishService.removeDishImage(picID).then(function(results){  
              console.log("First image removed successfully.");              
            });
        }
         
        imgUrl = $scope.dish.dishphotos.secphoto;
       console.log(imgUrl , (imgUrl != $scope.defaultDishImg) );
        if( imgUrl && imgUrl.length > 5 && imgUrl != $scope.defaultDishImg ) {            
            var picID = imgUrl.substring( imgUrl.lastIndexOf("/") +1 , imgUrl.length - 4);
            ListDishService.removeDishImage(picID).then(function(results){  
                console.log("Second image removed successfully.");              
            });
        }

        imgUrl = $scope.dish.dishphotos.thirdphoto;
       console.log(imgUrl , (imgUrl != $scope.defaultDishImg) );
        if( imgUrl && imgUrl.length > 5 && imgUrl != $scope.defaultDishImg ) {            
            var picID = imgUrl.substring( imgUrl.lastIndexOf("/") +1 , imgUrl.length - 4);
            ListDishService.removeDishImage(picID).then(function(results){ 
                console.log("Third image removed successfully.");             
            });
        }
        
        console.log("Now delete the Dish record:: dishTableID=" , $scope.dishTableID );
        console.log( " populate list Dish ... " , dishId ); 

        var dishDetails = {
          dishTableID: $scope.dishTableID,
          oneDishID: dishId
        }
        // now delete the dish database record
        ListDishService.deleteADishRecord(dishDetails).then(function(results) {
            btn.html("Delete this Dish");
            alert("Dish has been deleted successfully.");
            $scope.go("dashboard");
        }); 


      } else {
        console.log("do not delete");
      }     
  }
 

  $scope.setDishType = function(dishType) {
    console.log( dishType );
    $scope.dish.type = dishType;
  }

  $scope.showTabs =function(tabID) {
      var tabToShow = '#listDishTab a[href="#'+ tabID + '"]';
      if( tabID === "dishDetailsTab") {
          $(tabToShow).tab('show');
           return;
      }
      
      if(!$scope.dish.name || $scope.dish.name.length < 3 ) {   
            return;
      }
      if( !$scope.dish.descdish || $scope.dish.descdish.length < 15 ) {           
          return;
      }
      if( !$scope.dish.servingtype || $scope.dish.servingtype == "" ) {         
       return;
      }

      if( tabID === "dishPriceTab") {
         $(tabToShow).tab('show');
          return;
      }        
      if( tabID === "dishAvailabilityTab") {
        if( !$scope.dish.price || $scope.dish.price == "" ) {
            return;
        }
        $(tabToShow).tab('show');
      }
       
  }


  $scope.saveListDishDetails = function(updateDishDetails, page ) {
    console.log( " saveListDishDetails ..." ,   page   );
    console.log( updateDishDetails );
    $scope.errorMessage =  "";
    $scope.errorMessage2 = "";
    var $btn = "";  
    if( page === 'first') {
       console.log( "first page..");
       $btn = $("#btnListDishSaveBtn1");

       if( !$scope.dish.name || $scope.dish.name.length < 3 ) {         
        $scope.dishnameError = "Please enter a valid dish name." ;
        $location.hash('dishnameGroupID');       
        $anchorScroll();       
        return;
      }  

      if( !$scope.dish.descdish || $scope.dish.descdish.length < 15 ) {         
        $scope.descdishError = "Please describe your dish." ;
        $location.hash('dishdescdishId');       
        $anchorScroll();  
        return;
      }  
 
      if( !$scope.dish.servingtype || $scope.dish.servingtype == "" ) {         
        $scope.servingtypeError = "Please select dish serving type." ;
        $location.hash('dishservingtypeId');       
        $anchorScroll(); 
        return;
      }

    }
    if( page === 'second') {
      console.log( "second page.."  );
      $btn = $("#btnListDishSaveBtn2");

      if( !$scope.dish.price || $scope.dish.price == "" ) {         
        $scope.priceError = "Please enter the price of this dish." ;
        $location.hash('exampleInputAmount');       
        $anchorScroll(); 
        return;
      }  
    }

    if( page === 'first' ) {
          $('#listDishTab a[href="#dishPriceTab"]').tab('show');
        } 
    if( page === 'second' ) {
          $('#listDishTab a[href="#dishAvailabilityTab"]').tab('show');
    }

    if(  page === 'third' ) {
      $btn = $("#BtnDishListSavePreview");
    }
     
    $scope.dish.discount.fromdate = $('#dtPickerDiscFrom').val() ;
    $scope.dish.discount.todate = $('#dtPickerDiscTo').val() ;
    
    $scope.dish.premake.fromdate = $('#dtPickerPremakeFrom').val() ;
    $scope.dish.premake.todate = $('#dtPickerPremakeTo').val() ; 
            
    if( $scope.dish.regdishstatus ) {
        $scope.dish.regulardishes = $scope.regularDishesArray; 
    } else{
        $scope.dish.regulardishes = []; 
    }
    
  
    console.log("$scope.dish::" , $scope.dish ) ;
    $btn.html("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");
    
    //If a dish is already selected/populated then do not add a new dish
    if( !ListDishService.toPopulate && ListDishService.selectedDishID == "" ) {
        
        
        ListDishService.addANewDish( $scope.dish ).then(function(results){
          console.log(" addANewDish...:: " , results );

          $scope.dishTableID = results.data.dishTableID;
          ListDishService.selectedDishID = results.data.newdishid; 
          $scope.usermobile = results.data.umobile;

          console.log("dishTableID , selectedDishID , usermobile: " , $scope.dishTableID , 
            ListDishService.selectedDishID , $scope.usermobile ); 

          $scope.dishDetails = {};
          $scope.dishDetails.dish = $scope.dish;
          $scope.dishDetails.dish._id = ListDishService.selectedDishID;
          $scope.dishDetails.dishTableID = $scope.dishTableID;

          console.log(" dishDetails...:: " , $scope.dishDetails );

          ListDishService.updateDishList( $scope.dishDetails ).then(function(results){  
              console.log( " updated succesfuly ..."   );      
              console.log( results );    
              if( page === 'first' ) {
                $btn.html("Save and Continue");
                $('#profileTab a[href="#profileCookingTab"]').tab('show');
              } 
              if( page === 'second' ) {
                $btn.html("Save and Continue");
                $('#profileTab a[href="#profileImageTab"]').tab('show');
              } 
              if( page === 'third' ) {
                $btn.html("Submit and Preview");
                $state.go("dishPreview");   
              }
              $location.hash('columns');       
              $anchorScroll();
          }); 
 
        });

    }else {

        $scope.dishDetails = {};
        $scope.dishDetails.dish = $scope.dish;
        $scope.dishDetails.dishTableID = $scope.dishTableID;
        console.log(" $scope.dishDetails::" ,  $scope.dishDetails ) ;

        ListDishService.updateDishList( $scope.dishDetails ).then(function(results){  
            console.log( " updated succesfuly ..."   );      
            console.log( results );    
            if( page === 'first' ) {
              $btn.html("Save and Continue");
              $('#profileTab a[href="#profileCookingTab"]').tab('show');
            } 
            if( page === 'second' ) {
              $btn.html("Save and Continue");
              $('#profileTab a[href="#profileImageTab"]').tab('show');
            } 
            $location.hash('columns');       
            $anchorScroll();
            if( page === 'third' ) {
              $btn.html("Submit and Preview");
              ListDishService.toPopulate = true;
              $state.go("dishPreview" , {d: dishId , c: chefid });   
            }
        });  
    }          
 
  }

  $scope.togglerDivs = function(div , selCheckbox ) {  
    var cont = $("#"+ div);
    cont.toggle();
    var isVisible = cont.is(":visible"); 
   
    $("#"+selCheckbox).prop('checked', isVisible);

    if( selCheckbox === "chBoxOfferDiscount") {
      $scope.dish.discount.status = isVisible;
      
    } 
    if( selCheckbox === "chBoxAdvDishes") {
      $scope.dish.advancebooking.status = isVisible;
       
    }
    if( selCheckbox === "chBoxPreMakeDishes") {
      $scope.dish.premake.status = isVisible;
      
    }
    if( selCheckbox === "chBoxRegulrDishes") {
      $scope.dish.regdishstatus = isVisible;
      
    }

  }

  $scope.checkboxChanged = function() {
    console.log( this);
  }
  

  $scope.editProfile = function() {
    $state.go('welcome');
  }

  $scope.setMainPreviewImg = function(img) {
    console.log("setMainPreviewImg...-- img:: " , img);
    if( img == 1) {
      $scope.mainPreviewImg = $scope.dish.dishphotos.mainphoto;
    }
    if( img == 2) {
      $scope.mainPreviewImg = $scope.dish.dishphotos.secphoto;
    }
    if( img == 3) {
      $scope.mainPreviewImg = $scope.dish.dishphotos.thirdphoto;
    }
      
  }


  $scope.logOut = function(){       
      auth.logOut()        
      $state.go('home');      
  };

  $scope.AddFeature = function() {
    $scope.isError2 =  false;
    console.log("AddFeature..."   );
    if( $scope.selectedFeature.name !=undefined && $scope.selListOfFeaturesArray.indexOf( $scope.selectedFeature.name ) < 0 )
      $scope.selListOfFeaturesArray.push ( $scope.selectedFeature.name ) ;
    console.log( $scope.selListOfFeaturesArray );
    $scope.dish.features = $scope.selListOfFeaturesArray;
  }

  $scope.removeFeature = function(item) {
    console.log("removeFeature..." , item );
    $scope.selListOfFeaturesArray.splice( $scope.selListOfFeaturesArray.indexOf( item ) ,1 );
    console.log( $scope.selListOfFeaturesArray );
    $scope.dish.features = $scope.selListOfFeaturesArray;   
  }

  $scope.addAnotherDishDay =function(){
    console.log("addAnotherDishDay..."   );
    var size = $scope.regularDishesArray.length;
    if( size < 7) {
        $scope.regularDishesArray.push( $scope.regulardishes[size] );
        
    }
    console.log( $scope.regularDishesArray  );
  }

  $scope.removeLastDishDay =function(){
      console.log("removeLastDishDay..."   );
      var size = $scope.regularDishesArray.length;
      if( size > 1 ) {
        $scope.regularDishesArray.splice( size - 1 , 1);
      }

       console.log( $scope.regularDishesArray  );
  }
 
  $scope.showAddDishScreen = function(){  
    ListDishService.toPopulate = false; 
    ListDishService.selectedDishID = "";           
    $state.go('listDishes');      
  };
 
 

  $scope.getFile = function () {
      console.log( "getFile..." , $scope.file );
      $scope.uploadFile( $scope.file , $scope.usermobile );
      
      $("#dishPicProgId").show();
      $("#dishPicProgFailedMsgId").hide();
      $scope.isImageUploadedSuccessfully = false;

      
      fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {           
                        
      });
  };
 
  $scope.uploadFile = function(files , usermobile , imgcategary) {
      uploadsService.uploadDishImages(files, usermobile).then(function(promise){
          console.log("promise.....>>" , promise );
          $scope.code = promise.code();
          $scope.fileName = promise.fileName();

          if( imgcategary === "mainimg") {
            $scope.dish.dishphotos.mainphoto = promise.furl();
            $("#dishPicProgId").hide();
            $scope.isImageUploadedSuccessfully = true;
          }
 
          if( imgcategary === "dishimg1") {
            $scope.dish.dishphotos.secphoto = promise.furl();
            $("#dishPicProgId").hide();
            $scope.isImageUploadedSuccessfully = true;
          }

          if( imgcategary === "dishimg2") {
            $scope.dish.dishphotos.thirdphoto = promise.furl();
            $("#dishPicProgId").hide();
            $scope.isImageUploadedSuccessfully = true;
          }
            
      }).catch(function(e){
        console.log("got an error in upload",e);
        $("#dishPicProgId").hide();
        if( ! $scope.isImageUploadedSuccessfully )
           $("#dishPicProgFailedMsgId").show();
    });
  };
 
  $scope.deleteDishImage = function(img) {
      console.log("deleteDishImage:: " , img);
      var imgUrl = "";
      if( img == 1) {
        imgUrl = $scope.dish.dishphotos.mainphoto;
      }
      if( img == 2) {
        imgUrl= $scope.dish.dishphotos.secphoto;
      }
      if( img == 3) {
        imgUrl = $scope.dish.dishphotos.thirdphoto;
      }

      if( imgUrl != $scope.defaultDishImg ) {
          
          var picID = imgUrl.substring( imgUrl.lastIndexOf("/") +1 , imgUrl.length - 4);

          ListDishService.remoteDishImage(picID).then(function(results){
          
            alert("Image has been removed successfully.");

            if( img == 1) {
              $scope.dish.dishphotos.mainphoto = $scope.defaultDishImg;
            }
            if( img == 2) {
              $scope.dish.dishphotos.secphoto = $scope.defaultDishImg;
            }
            if( img == 3) {
              $scope.dish.dishphotos.thirdphoto = $scope.defaultDishImg;
            }

          });
      }

  }

  $scope.closeDishPreview = function() {
        var dishDetails = {
          username: $scope.userName,
          useremail: $scope.userEmail || "noemail",
          dishname: $scope.dish.name  
      
        } 
        ListDishService.dishConfirmationEmail(dishDetails).then(function(results){
          //console.log("results::" , results );
          $state.go('dishAdded');

        });
       
  }

  $scope.hideDefaultImage = function(img){     
      return (img != $scope.defaultDishImg);
  }

  $scope.updateDishStatus = function() {
    var obj = {
      dishId : $stateParams.d,
      chefid : $stateParams.c,
      popular : $scope.dish.popular == 'Yes' ? true : false,
      featured: $scope.dish.featured == 'Yes' ? true : false,
      isactive: $scope.dish.isactive == 'Yes' ? true : false  // this is reveser logic
    }
    console.log( obj );
 
    ListDishService.updateDishStatus(obj).then(function(results){
        console.log( results);
        alert("Dish status has been updated succesfuly");
    });

  }


  $scope.reloadRoute = function() {  
    window.location.reload(true);
  };

}]);

appControllers.controller('footerControler', ['$scope','auth', function($scope, auth){
  $scope.appVersion = "1.0";
  
}]);  

appControllers.controller('addQuestionsController',['$scope,auth',function($scope,auth){
    $scope.category = '';
    $scope.addquestionanswer = function(){
        console.log($scope.category);
    }
}])