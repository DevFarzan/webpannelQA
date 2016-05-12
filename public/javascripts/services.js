'use strict';

/* Services */

var appServices = angular.module('appServices', []);
 
appServices.factory('UserService',['$http' , 'auth' ,function($http , auth){
  var o = {
    customersArray: [] ,
    userProfile: [] ,
  };

  	o.getAllCustomers = function() { 
	    return $http.get('/customerslist').success(function(data){
	    	console.log(  data );
	      	angular.copy(data, o.customersArray);
	    });
  	};

  	o.updateCustRecord = function(customer) {
  		console.log( "calling updateCustRecord.." );
  		var json = angular.toJson(customer);
  		console.log( " updateCustRecord..json: " , json ); 
	  	return $http.post('/updatecustomers' , json  ,  {
		  	  	}).success(function(data){
			      	return data;
				});
	};
  
  return o;
}]);

appServices.factory('ProfileService',['$http','auth',function($http , auth){
	var o = {
	    userProfile: []  
	};
 
 	o.updateProfile = function(profile) {
  		console.log( "calling updateprofile.." );
  		var json = angular.toJson(profile); 
	  	return $http.post('/updateprofile' , json  , {
    				 
		  	  	}).success(function(data){
			      	return data;
				});
	};

 	o.populateUserProfile = function(userid) { 
	    return $http.get('/userprofile/' + userid).success(function(data){
	    	console.log(  data );
	    	console.log(' data.regisId.username ', data.regisId.username);
	      	angular.copy(data, o.userProfile);
	    });
  	};

  	o.passwordReset = function(user) { 
	    console.log( "calling passwordReset.." );
  		var json = angular.toJson(user); 
	  	return $http.post('/resetPassword' ,json, {}).success(function(data){
	  				console.log("succesfull" , data);
			      	return data;
				});
  	};

  	o.deleteChefProfile = function(profile) {
  		console.log( "calling deleteChefProfile.." , profile);  		 
  		var json = angular.toJson(profile);   		 
	  	return $http.post('/deletechefprofile' , json , {}).success(function(data){
  	  		try{
  	  			console.log(  data );
				return data;
	    	}catch(Exception) {
	    		console.log("Exception:: " , Exception)
	    	}			      	
		});
	}; 

	o.updateChefStatus = function(profile) {
  		console.log( "calling updateChefStatus.." , profile);  		 
  		var json = angular.toJson(profile);   		 
	  	return $http.post('/updatechefstatus' , json, {}).success(function(data){
  	  		try{
  	  			console.log(  data );
				return data;
	    	}catch(Exception) {
	    		console.log("Exception:: " , Exception)
	    	}			      	
		});
	};

	o.populateListOfUsersProfiles = function(users) { 
	   console.log( "calling populateListOfUsersProfiles.." , users);  		 
  		var json = angular.toJson(users);   		 
	  	return $http.post('/getListOfUersProfiles' , json, {}).success(function(data){
  	  		try{
  	  			console.log(  data );
				return data;
	    	}catch(Exception) {
	    		console.log("Exception:: " , Exception)
	    	}			      	
		});
  	};

  	return o;

}]);

appServices.factory('ListDishService',['$http','auth',function($http , auth){
	var o = {
	    dishList: [],
	    selectedDishID: '',
	    toPopulate: false,
	    orderDetails : {}
	};
 
	o.populateAllUserDishes = function(userid ) { 
	    return $http.get('/dishlist/' + userid ).success(function(data){
	    	console.log(  data );
	    	  
	      	angular.copy(data, o.dishList);
	    });
  	};

  	o.updateDishList = function(listDish) {
  		//console.log( "calling updateDishList.." );

  		var json = angular.toJson(listDish); 
  		console.log("JSON::" , json);
	  	return $http.post('/updatelistdish' , json , {
		  	  	}).success(function(data){
		  	  		try{
						return data;
			    	}catch(Exception) {
			    		console.log(Exception)
			    	}
			      	
				});
	};

 	o.populateDishList = function(userid, dishid) { 
	    return $http.get('/onedishlist/' + userid + "/" + dishid).success(function(data){
	    	//console.log(   data   );	    	  
	      	angular.copy(data, o.dishList);
	    });
  	};

	o.removeDishImage = function(imrUrl) { 
		//console.log("removeDishImage - calling service.." , imrUrl);

 		return $http.get('/delete/' + imrUrl ).success(function(data){
	    	try{
				console.log(  data );	    	 
				 
	    	}catch(Exception) {
	    		console.log(Exception)
	    	}	    	
	    });
  	};

  	o.deleteADishRecord = function(dishdetails) {
  		console.log( "calling deleteADishRecord.." , dishdetails);  		 
  		var json = angular.toJson(dishdetails);   		 
	  	return $http.post('/deletedishrecord' , json , {}).success(function(data){
  	  		try{
  	  			console.log(  data );
				return data;
	    	}catch(Exception) {
	    		console.log("Exception:: " , Exception)
	    	}			      	
		});
	};
	 
	o.getAllOrders = function() {
  		console.log( "calling getAllOrders..");  
	  	return $http.get('/getallorders').success(function(data){
  	  		try{
				return data;
	    	}catch(Exception) {
	    		console.log(Exception)
	    	}	      	
		});
	};

	o.getChefListOfOrders = function(jsonObj) {
  		console.log( "calling getChefListOfOrders.." , jsonObj);

  		var json = angular.toJson(jsonObj); 
	  	return $http.post('/getcheflistoforders',json).success(function(data){
  	  		try{
				return data;
	    	}catch(Exception) {
	    		console.log(Exception)
	    	}	      	
		});
	}; 

	o.setOrderDetails = function(order){
		o.orderDetails = order;
	}

	o.getOrderDetails = function(order){
		return o.orderDetails;
	}

	o.updateDishStatus = function(profile) {
  		console.log( "calling updateDishStatus.." , profile);  		 
  		var json = angular.toJson(profile);   		 
	  	return $http.post('/updatedishstatus' , json, {}).success(function(data){
  	  		try{
  	  			console.log(  data );
				return data;
	    	}catch(Exception) {
	    		console.log("Exception:: " , Exception)
	    	}			      	
		});
	};

	o.updateOrderStatus = function(order) {
  		console.log( "calling updateOrderStatus.." , order);  		 
  		var json = angular.toJson(order);   		 
	  	return $http.post('/updateorderstatus' , json, {}).success(function(data){
  	  		try{
  	  			console.log(  data );
				return data;
	    	}catch(Exception) {
	    		console.log("Exception:: " , Exception)
	    	}			      	
		});
	};

  return o;

}]);
   

appServices.factory("fileReader",  ["$q", "$log", function ($q, $log) {
 
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
        };
}]) ;
   
   
appServices.service('uploadsService', function($http) {   

    var code = '';
    var fileName = '';
    var furl = '';

    this.uploadFile = function(files, usermobile) {
    	console.log("uploadFile .." , files , usermobile );
        var fd = new FormData();         
        if( files ) {
        	 //Take the first selected file
	        fd.append("image", files[0]);
			fd.append("usermobile", usermobile );
	        var promise =  $http.post('/fileupload', fd, {
	                withCredentials: true,
	                headers: {'Content-Type': undefined },
	                transformRequest: angular.identity
	            }).then(function(response) {
					console.log(" inside promise .." ,  response.data.code , response.data.fileName );
	            code = response.data.code;
	            fileName = response.data.fileName;
	            return{
	                code: function() {
	                    return code;
	                },
	                fileName: function() {
	                    return fileName;
	                }
	            }; 
	        });
	        return promise;
        } 
    };

    this.uploadDishImages = function(files, usermobile) {
    	 
    	$('#dishPicProgId').hide();
    	console.log("uploadDishImages .." , files , usermobile );
        var fd = new FormData();         
        if( files ) {
        	 //Take the first selected file
	        fd.append("image", files[0]);
			fd.append("usermobile", usermobile );
	        var promise =  $http.post('/uploaddishimages', fd, {
	                withCredentials: true,
	                headers: {'Content-Type': undefined },
	                transformRequest: angular.identity
	            }).then(function(response) {
	            	console.log( response );
					console.log(" inside promise .." ,  response.data.code , response.data.fileName ,
					response.data.furl );
	            code = response.data.code;
	            fileName = response.data.fileName;
	            furl = response.data.furl;
	            return{
	                code: function() {
	                    return code;
	                },
	                fileName: function() {
	                    return fileName;
	                },
	                furl: function() {
	                	return furl;
	                }
	            }; 
	        });
	        return promise;
        } 
    };

 });
 	 
 
appServices.factory('auth', ['$http', '$window' , function($http, $window){
   var auth = {};
   var isChefUser = false; 
   var keepLoggedIn = true;
   
	auth.setIsChefUser = function (userType){
	  //userType == true, then Chef , otherwise Foodie
	  auth.isChefUser = userType;
	}
	
	auth.getIsChefUser = function (){
	  return auth.isChefUser;
	}
 
	auth.saveToken = function (token){
	  $window.localStorage['homecheftoken'] = token;
	};
	
	auth.getToken = function (){
	  return $window.localStorage['homecheftoken'];
	}

	auth.saveLogInUserID = function (uid){
	  $window.localStorage['hcu'] = uid;
	};
	
	auth.getLogInUserID = function (){
	  return $window.localStorage['hcu'];
	}

	auth.isLoggedIn = function(){
	    var token = auth.getToken();
	
		try{
			if(token){
	    		var payload = JSON.parse($window.atob(token.split('.')[1]));	
		    	return payload.exp > Date.now() / 1000;
			} else {
			    return false;
			}
		}catch(Exception) {
			console.log("User session verificaion failed.");
			return false;
		}
	  
	};

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));
	
	    return payload.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){	
	  	  	  
	  	auth.keepLoggedIn = user.keepLoggedIn; 
	  	auth.userid = data.uid; 
	  	auth.saveLogInUserID(data.uid);
	    auth.saveToken(data.token);	    
	  });
	};

	auth.foodieRegister = function(user){
		var json = angular.toJson(user);
	  return $http.post('/foodieregister', json).success(function(data){
	  	auth.keepLoggedIn = user.keepLoggedIn; 
	  	auth.userid = data.uid; 
	  	auth.saveLogInUserID(data.uid);
	    auth.saveToken(data.token);	  
	    
	  });
	};

	auth.logIn = function(user){
		var json = angular.toJson(user);	
	  return $http.post('/login', json).success(function(data){
	  	auth.keepLoggedIn = user.keepLoggedIn; 
	  	auth.userid = data.uid; 
	  	auth.saveLogInUserID(data.uid);
	    auth.saveToken(data.token);	  
	  });
	};

	auth.logOut = function(){	   
   		$window.localStorage.removeItem('homecheftoken');
   		$window.localStorage.removeItem('hcu'); 
	};

    auth.sendResetPasswordEmail = function(reqJSON){
    	var json = angular.toJson(reqJSON);	
        return $http.post('/postResetEmail' , json).success(function(data){
        	console.log(data);  
        	return data;
        });
    };

    auth.changeUserPassword = function(reqJSON){
    	var json = angular.toJson(reqJSON);	
        return $http.post('/changeUserPassword', json).success(function(data){
        	console.log(data);  
        	return data;
        });
    };

    auth.verifyMobileNo = function(reqJSON){
    	var json = angular.toJson(reqJSON);	  		 
        return $http.post('/verifyMobile', json).success(function(data){
	  		console.log(data);
	  		return data;
	    });
    };

  return auth;
}]);