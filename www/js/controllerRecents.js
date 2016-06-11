angular.module('polyChronos.controllers')

// FOR ALL AVAILABLE RECENTS
.controller('RecentsController',
 
        ['$state', '$ionicModal', '$window', '$scope','$rootScope',
         'recents', 'baseURL', 'AuthFactory', 'recentsFactory', '$ionicPopup',
          
        function($state, $ionicModal, $window, $scope, $rootScope, 
                recents, baseURL, AuthFactory, recentsFactory, $ionicPopup) {

        $scope.baseURL  = baseURL;
        $scope.recents  = recents;

        // see if a new timers was added
        $scope.$on('$ionicView.enter', function() {
            console.log('recent opened');
            // Code you want executed every time view is opened
            if ($rootScope.addingRecent != undefined) {
                console.log('new recent found!');
                $scope.recents.unshift ($rootScope.addingRecent);
                $scope.playTimer ($rootScope.addingRecent);
                $rootScope.addingRecent = undefined;
            }
        });
    
        $scope.findRecentArray = function (id){
            for (var i in $scope.recents) {
            if (id == $scope.recents[i]._id)
                return $scope.recents[i];
            }
        }
        
        $scope.deleteRecentArray = function (id){
            for (var i in $scope.recents) {
            if (id == $scope.recents[i]._id) {
                
                $scope.recents.splice(i, 1);
                // $state.go($state.current, {}, {reload: true});
                return;
            }
            }
        }
        
        $scope.updateRecentArray = function (id, recent){
            for (var i in $scope.recents) {
                if (id == $scope.recents[i]._id) {
                    $scope.recents[i] = recent;
                    // $state.go($state.current, {}, {reload: true});
                    return;
                }
            }
        }

        $scope.playRecent = function(id) {
            var recent = $scope.findRecentArray(id);
            if (recent == undefined)
                return;
            // console.log("play recent"+ recent.status);

            if (recent.status == 1)
                $scope.pauseTimer (recent);
            else                
                $scope.playTimer (recent);
        }
        $scope.stopRecent = function(id) {
            var recent = $scope.findRecentArray(id);
            if (recent == undefined)
                return;
            $scope.deleteTimer (recent);                
        }
        $scope.deleteRecent = function(id) {
            var recent = $scope.findRecentArray(id);
            if (recent == undefined)
                return;
            
            $scope.deleteTimer (recent);                
                
            recentsFactory.delete ({id: recent._id}, 
                function(response) {
                    // reload page
                    $scope.deleteRecentArray (recent._id);
                    // $window.location.reload(true);
                    // $scope.recents.push ($scope.recent);
                },
                function(response){
                    // $rootScope.$broadcast('login:Unsuccessful');
                    $ionicPopup.alert({
                        title: 'Unsuccessful Query',
                        template: JSON.stringify (response.data.message)
                    });
                } );
        }
        
    }]);

