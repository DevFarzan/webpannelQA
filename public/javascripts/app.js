'use strict';

/* App Module */

var myApp =  angular.module('myApp',['ui.router', 'appControllers','appDirectives','appServices']); 

myApp.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {

	  $stateProvider		 	     
		.state('dashboard', {
		  url: '/dashboard',
		   views: {
		  	'': { 
		  		templateUrl: '/partials/dashboard.html', 	  
		  		controller: 'adminControler' 
		  	},
		  	'dashboard-contents@dashboard': { 
		  		templateUrl: '/partials/dashboard_overview.html' 
		  	}		 
		  }
		})
		.state('dashboard.allorders', {
		   url: '/addquestions',
		   views: {
		   		'dashboard-contents@dashboard': { 
		  		templateUrl: '/partials/dashboard_addquestions.html',
		  		controller: 'adminControler' 
		  	}
		   }		   		    
		})
		.state('dashboard.allusers', {
		   url: '/allcategory',
		   views: {
		   		'dashboard-contents@dashboard': { 
		  		templateUrl: '/partials/dashboard_allcategory.html',
		  		controller: 'adminControler' 
		  	}
		   }		   		    
		})
		  .state('dashboard.allskils', {
			  url: '/allskils',
			  views: {
				  'dashboard-contents@dashboard': {
					  templateUrl: '/partials/dashboard_allSkills.html',
					  controller: 'OrderDetailsController'
				  }
			  }
		  })
		  .state('dashboard.skillsQuestionsAnswer', {
			  url: '/skillquestionanswer',
			  views: {
				  'dashboard-contents@dashboard': {
					  templateUrl: '/partials/dashboard_skillquestionanswer.html',
					  controller: 'OrderDetailsController'
				  }
			  }
		  })

		  .state('dashboard.subscribeusers',{
			  url:'/subscribeuser',
			  views: {
				  'dashboard-contents@dashboard': {
					  templateUrl: '/partials/dashboard_allsubscribeusers.html',
					  controller: 'adminControler'
				  }
			  }
		  })
		.state('dashboard.orderupdate', {
		   url: '/orderupdate',
		   views: {
		   		'dashboard-contents@dashboard': { 
		  		templateUrl: '/partials/dashboard_orderupdate.html',
		  		controller: 'OrderDetailsController' 
		  	}
		   }		   		    
		})   
		
		.state('profilepreview', {
		  url: '/profilepreview?u',		 
		  templateUrl: '/partials/profilepreview.html', 	  
		  controller: 'userProfileControler'
		})

		.state('editprofile', {
		  url: '/editprofile?u',		 
		  templateUrl: '/partials/userprofile.html', 	  
		  controller: 'userProfileControler'
		})
		.state('listDishes', {
		  url: '/listDishes?d&c',		 
		  templateUrl: '/partials/listdishcontainer.html', 	  
		  controller: 'listDishControler'
		}) 
		.state('dishPreview', {
		  url: '/dishPreview?d&c',		 
		  templateUrl: '/partials/dishpreview.html', 	  
		  controller: 'listDishControler'
		})
		.state('userlistdishes', {
		  url: '/userlistdishes?u',		 
		  templateUrl: '/partials/useralldishes.html', 	  
		  controller: 'UserAllDishesControler'
		});


	  	$urlRouterProvider.otherwise('dashboard');

	  	$locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});

}]);