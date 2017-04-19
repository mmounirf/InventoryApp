var InventoryApp = angular.module('InventoryApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngMaterial', 'ngMessages', 'md.data.table', 'chart.js', 'vAccordion', 'barcode', 'focus-if', 'angular.filter', 'pascalprecht.translate', 'tmh.dynamicLocale']);

InventoryApp.config(function($routeProvider, $mdThemingProvider, $translateProvider) {

    $routeProvider
        .when('/', {
            templateUrl: './app/views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/login', {
            title : 'Login',
            icon: 'lock',
            templateUrl: './app/views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/dashboard', {
            title : 'Dashboard',
            icon: 'home',
            templateUrl: './app/views/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .when('/activities', {
            title : 'Activities',
            icon: 'assignment',
            templateUrl: './app/views/activities.html',
            controller: 'ActivitiesCtrl'
        })
        .when('/check_in_product', {
            title : 'Check-In Product',
            icon: 'call_received',
            templateUrl: './app/views/check_in_product.html',
            controller: 'CheckInCtrl'
        })
        .when('/check_out_product', {
            title : 'Check-Out Product',
            icon: 'call_made',
            templateUrl: './app/views/check_out_product.html',
            controller: 'CheckOutCtrl'
        })
        .when('/rooms', {
            title : 'Rooms',
            icon: 'location_on',
            templateUrl: './app/views/rooms.html',
            controller: 'RoomsCtrl'
        })
        .when('/users', {
            title : 'Users',
            icon: 'group',
            templateUrl: './app/views/users.html',
            controller: 'UsersCtrl'
        })
        .when('/products', {
            title : 'Products',
            icon: 'shopping_cart',
            templateUrl: './app/views/products.html',
            controller: 'ProductsCtrl'
        });

    $translateProvider.useStaticFilesLoader({
          files: [{
              prefix: './app/lang/',
              suffix: '.json'
          }, {
              prefix: './app/lang/',
              suffix: '.json'
          }]
      });
    $translateProvider.preferredLanguage('en');

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink');
});

/*-----------------Start Directives-----------------*/
InventoryApp.directive('showFocus', function($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus,
            function(newValue) {
                $timeout(function() {
                    newValue && element.focus();
                });
            }, true);
    };
});
/*-----------------End Directives-----------------*/

/*-----------------Start Filters-----------------*/
InventoryApp.filter('nospace', function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});

InventoryApp.filter('beautify', function() {
    return function(value) {
        return (!value) ? '' : value.replace(/_/g, ' ');
    };
});

InventoryApp.filter('roleBeautify', function() {
  return function(role) {
    var role_name;
    switch(role){
      case 'admin':
        role_name = "Administrator"
      break;
      case 'mod':
        role_name = "Moderator"
      break;
      case 'user':
        role_name = "User"
      break;
      case 'comm':
        role_name = "Commissioner"
      break;
  }
    return role_name;
  };
});

InventoryApp.filter('stringToID', function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '_').toLowerCase();
    };
});

InventoryApp.filter('moment', function($rootScope) {
$rootScope.$watch('language', function (newValue, oldValue, scope) {
}, true);

    return function(input, momentFn) {
        var args = Array.prototype.slice.call(arguments, 2),
            momentObj = moment(input).locale($rootScope.language);
        return momentObj[momentFn].apply(momentObj, args);
    };
});
/*-----------------End Filters-----------------*/


InventoryApp.filter('floorIcon', function() {
    return function(floorNumber) {
      if (floorNumber == '100'){
        var floorIcon = "one";
      }
      if (floorNumber == '200'){
        var floorIcon = "two";
      }
      if (floorNumber == '300'){
        var floorIcon = "3";
      }
      if (floorNumber == '400'){
        var floorIcon = "4";
      }

        return floorIcon;
    };
});


/*-----------------Start Navigation Toolbar-----------------*/
InventoryApp.run(['$rootScope', '$route', '$location', '$translate', 'tmhDynamicLocale', function($rootScope, $route, $location, $translate, tmhDynamicLocale) {
  if(sessionStorage.loggedInUser){
    $rootScope.loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"))
    $location.path('dashboard');
  }else{
    $location.path('login');
  }

  $rootScope.go_to = function(page) {
      $location.path(page);
  }
  $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.page_name = $route.current.title;
      $rootScope.page_icon = $route.current.icon;
    });

  $rootScope.language = "en";
  $rootScope.changeLanguage = function(){
    $rootScope.language = $rootScope.language === 'en' ? 'ar' : 'en';
    $translate.use($rootScope.language);
    tmhDynamicLocale.set('en');
    moment.locale("en")
    $rootScope.rtl = false;
    $route.reload();
    if($rootScope.language === 'ar'){
      tmhDynamicLocale.set('ar');
      moment.locale("ar")
      $rootScope.rtl = true;
    }
    if($rootScope.language === 'en'){
        tmhDynamicLocale.set('en');
        moment.locale("en")
        $rootScope.rtl = false;
    }
  }








}]);
/*-----------------End Navigation Toolbar-----------------*/


/*-----------------Start Loading Databases-----------------*/
var Datastore = require('nedb');
var products_db = new Datastore({
    filename: './app/db/products',
    autoload: true,
    timestampData: true
});

var activities_db = new Datastore({
    filename: './app/db/activities',
    autoload: true,
    timestampData: true
});

var users_db = new Datastore({
    filename: './app/db/users',
    autoload: true,
    timestampData: true
});

var rooms_db = new Datastore({
    filename: './app/db/rooms',
    autoload: true,
    timestampData: true
});

var requests_db = new Datastore({
    filename: './app/db/requests',
    autoload: true,
    timestampData: true
});
/*-----------------End Filters-----------------*/
