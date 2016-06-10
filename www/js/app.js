// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('polyChronos', ['ionic', 'polyChronos.controllers','polyChronos.services', '$selectBox'])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });

    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        })
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        console.log('Loading ...',toState.url);
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });    

    $rootScope.$on('$stateChangeError', function () {
        console.log('Error');
        $rootScope.$broadcast('loading:hide');
    });    

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.alarms', {
    url: '/alarms',
    views: {
      'mainContent': {
        templateUrl: 'templates/alarms.html',
        controller:  'AlarmsController',
        resolve: {
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            alarms: ['AuthFactory', 'alarmsFactory', function(AuthFactory, alarmsFactory){
                  return alarmsFactory.query();
              }]
        }
      }
    }
  })

  .state('app.intervals', {
    url: '/intervals',
    views: {
      'mainContent': {
        templateUrl: 'templates/intervals.html',
        controller:  'IntervalsController',
        resolve: {
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            alarms: ['AuthFactory', 'alarmsFactory', function(AuthFactory, alarmsFactory){
                  return alarmsFactory.query();
              }],
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            intervals: ['AuthFactory', 'intervalsFactory', function(AuthFactory, intervalsFactory){
                  return intervalsFactory.query();
              }]
        }
      }
    }
  })
  
  .state('app.sets', {
    url: '/sets',
    views: {
      'mainContent': {
        templateUrl: 'templates/sets.html',
        controller:  'SetsController',
        resolve: {
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            sets: ['AuthFactory', 'setsFactory', function(AuthFactory, setsFactory){
                  return setsFactory.query();
              }],
        }
      }
    }
  })
  
  .state('app.set', {
    url: '/set',
    views: {
      'mainContent': {
        templateUrl: 'templates/set.html',
        controller:  'SetController',
        resolve: {
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            intervals: ['AuthFactory', 'intervalsFactory', function(AuthFactory, intervalsFactory){
                  return intervalsFactory.query();
              }]
        }
      }
    }
  })
  
  .state('app.timers', {
    url: '/timers',
    views: {
      'mainContent': {
        templateUrl: 'templates/timers.html',
        controller:  'TimersController',
        resolve: {
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            timers: ['AuthFactory', 'timersFactory', function(AuthFactory, timersFactory){
                  return timersFactory.query();
              }],
        }
      }
    }
  })
  
  .state('app.timer', {
    url: '/timer',
    views: {
      'mainContent': {
        templateUrl: 'templates/timer.html',
        controller:  'TimerController',
        resolve: {
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            sets: ['AuthFactory', 'setsFactory', function(AuthFactory, setsFactory){
                  return setsFactory.query();
              }]
        }
      }
    }
  })
  
  .state('app.recents', {
    url: '/recents',
    views: {
      'mainContent': {
        templateUrl: 'templates/recents.html',
        controller:  'RecentsController',
        resolve: {
            // AuthFactory is located first, in order to complete login first
            // if possible. do not move from it even if that appears unnecesary
            recents: ['AuthFactory', 'recentsFactory', function(AuthFactory,recentsFactory){
                  return recentsFactory.query();
              }]
        }
      }
    }
  })
  
  //.state('app.aboutus', {
  //    url: '/aboutus',
  //    views: {
  //      'mainContent': {
  //        templateUrl: 'templates/aboutus.html',
  //        controller : 'AboutController'
  //      }
  //    }
  //  })
    
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/recents');
});
