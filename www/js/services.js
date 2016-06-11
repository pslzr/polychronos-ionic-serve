'use strict';

angular.module('polyChronos.services', ['ngResource', 'ionic'])
        .constant("baseURL","http://localhost:3000/")
        .factory('$localStorage', ['$window', function($window) {
          return {
            store: function(key, value) {
              $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
              return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function(key, value) {
              $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key,defaultValue) {
              return JSON.parse($window.localStorage[key] || defaultValue);
            }
          }
        }])
        
        .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', '$ionicPopup', 
            function($resource, $http, $localStorage, $rootScope, $window, baseURL, $ionicPopup){
            
            var authFac = {};
            var TOKEN_KEY = 'Token';
            var isAuthenticated = false;
            var username = '';
            var authToken = undefined;
            

        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }
        
        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }
        
        function useCredentials(credentials) {
            isAuthenticated = true;
            username    = credentials.username;
            authToken   = credentials.token;
            // console.log('authToken', authToken);
        
            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }
        
        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }
            
        authFac.login = function(loginData) {
                
                $resource(baseURL + "users/login", {}, {query: {method: 'POST'}})
                .save(loginData,
                function(response) {
                    storeUserCredentials({username:loginData.username, token: response.token});
                    $window.location.reload(true);
                    $rootScope.$broadcast('login:Successful');
                    //$ionicPopup.alert({
                    //    title: 'Login Successful',
                    //    template: ''
                    //});
                },
                function(response){
                    isAuthenticated = false;
                    $rootScope.$broadcast('login:Unsuccessful');
                    $ionicPopup.alert({
                        title: 'Login failed',
                        template: (response.data == null ? "No response" : response.data.err.message)
                    });
                }
                
                );

            };
            
            authFac.logout = function() {
                $resource(baseURL + "users/logout").get(function(response){
                });
                destroyUserCredentials();
            };
            
            authFac.register = function(registerData) {
                
                $resource(baseURL + "users/register")
                .save(registerData,
                function(response) {
                    authFac.login({username:registerData.username, password:registerData.password});
                    if (registerData.rememberMe) {
                        $localStorage.storeObject('userinfo',
                            {username:registerData.username, password:registerData.password});
                    }
                
                    $rootScope.$broadcast('registration:Successful');
                    $ionicPopup.alert({
                        title: 'Registration completed',
                        template: ''
                    });
                },
                function(response){
                    $ionicPopup.alert({
                        title: 'Registration failed',
                        template: (response.data == null ? "No response" : response.data.err.message)
                    });
                }
                
                );
            };
            
            authFac.isAuthenticated = function() {
                return isAuthenticated;
            };
            
            $rootScope.getUsername = function() {
                return username;  
            };

            loadUserCredentials();
            
            return authFac;
            
        }])
                
        .factory('alarmsFactory', ['$resource', 'baseURL', function($resource,baseURL) {
             return $resource(  baseURL+"alarms/:id", null, {
                                        'update': {
                                            method: 'PUT'
                                         }
                                });
            
        }])
        
        .factory('intervalsFactory', ['$resource', 'baseURL', function($resource,baseURL) {
             return $resource(  baseURL+"intervals/:id", null, {
                                        'update': {
                                            method: 'PUT'
                                         }
                                });
            
        }])
        
        .factory('setsFactory', ['$resource', 'baseURL', function($resource,baseURL) {
             return $resource(  baseURL+"sets/:id", null, {
                                        'update': {
                                            method: 'PUT'
                                         }
                                });
            
        }])

        .factory('timersFactory', ['$resource', 'baseURL', function($resource,baseURL) {
             return $resource(  baseURL+"timers/:id", null, {
                                        'update': {
                                            method: 'PUT'
                                         }
                                });
            
        }])
        
        .factory('recentsFactory', ['$resource', 'baseURL', function($resource,baseURL) {
             return $resource(  baseURL+"recents/:id", null, {
                                        'update': {
                                            method: 'PUT'
                                         }
                                });
            
        }])
//        .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage',
//                         function  ($resource, baseURL, $localStorage) {
//            var favFac = {};
//            var favorites = $localStorage.getObject('favorites','[]');
//
//            favFac.addToFavorites = function (index) {
//                for (var i = 0; i < favorites.length; i++) {
//                    if (favorites[i].id == index)
//                        return;
//                }
//                favorites.push({id: index});
//                $localStorage.storeObject('favorites',favorites);
//            };
//
//            favFac.deleteFromFavorites = function (index) {
//                for (var i = 0; i < favorites.length; i++) {
//                    if (favorites[i].id == index) {
//                        favorites.splice(i, 1);
//                        $localStorage.storeObject('favorites',favorites);
//                        return;
//                    }
//                }
//            }
//            
//            favFac.getFavorites = function () {
//                return favorites;
//            };            
//            
//            return favFac;
//            }])
;
