angular.module('polyChronos.controllers')

// FOR ONE SET WITH MULTIPLE INTERVALS
.controller('SetController',
 
        ['$state', '$ionicModal', '$window', '$scope','$rootScope',
         'intervals','baseURL', 'AuthFactory', 'setsFactory', '$ionicPopup', '$ionicPlatform',
          
        function($state, $ionicModal, $window, $scope, $rootScope, 
                intervals, baseURL, AuthFactory, setsFactory, $ionicPopup, $ionicPlatform) {

        $scope.baseURL      = baseURL;
        
        $scope.set          = $rootScope.editingSet; // it is signaled before entering this route
        
        $scope.intervals    = intervals;

        // console.log('deregistering');
        $scope.getBack = function () {
            // console.log('changed set');
            if ($scope.set == undefined)
                prevIonicGoBack();
            // its updating  
            setsFactory.update ({id:$scope.set._id}, $scope.set,
                        function(response) {
                            // reload page
                            // $scope.updateSetArray ($scope.set._id, response);
                            // $window.location.reload(true);
                            // $scope.sets.push ($scope.set);
                            prevIonicGoBack();
                            // $state.go('app.sets');

                        },
                        function(response){
                            // $rootScope.$broadcast('login:Unsuccessful');
                            var popUp = $ionicPopup.alert({
                                title: 'Unsuccessful update',
                                template: JSON.stringify (response.data.message)
                            });
                            popUp.then ( function (res) {
                                // $state.go('app.sets');
                                prevIonicGoBack();
                                });
                        }
            );
        }
        
        $scope.cancelBack = function () {
            $state.go('app.sets');
        }
        
        var prevIonicGoBack = $rootScope.$ionicGoBack;
        $rootScope.$ionicGoBack = $scope.getBack; 
        
        // registerBackButtonAction() returns a function which can be used to deregister it
        var deregisterHardBack= $ionicPlatform.registerBackButtonAction(
            $scope.getBack, 101
        );

        $scope.$on('$destroy', function() {
            deregisterHardBack();
            $rootScope.$ionicGoBack = prevIonicGoBack;
        });
        
        $scope.findIntervalArray = function (id){
            for (var i in $scope.intervals) {
                if (id == $scope.intervals[i]._id)
                    return $scope.intervals[i];
                }
            return {
              name:"Not found"  
            };
        }
        
        $scope.upSetInterval = function (index){
            console.log('index ' + index);
            if (index > 0) {
                var intervalId = $scope.set.intervals.splice(index, 1);
                console.log('first ' + JSON.stringify($scope.set.intervals));
                $scope.set.intervals.splice (index-1, 0, intervalId);
                console.log('second ' + JSON.stringify($scope.set.intervals));
            }
        }
        
        $scope.downSetInterval = function (index){
            if (index < $scope.set.intervals.length-1) {
                var intervalId = $scope.set.intervals.splice(index, 1);
                $scope.set.intervals.splice (index+1, 0, intervalId);
            }
        }
        
        $scope.deleteSetInterval = function (index){
            $scope.set.intervals.splice(index, 1);
        }
        
        /////////////////////////////
        // FORM MODAL
        $ionicModal.fromTemplateUrl('templates/setModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.setform = modal;
        });

        // Triggered in the set modal to close it
        $scope.closeSet  = function() {
            $scope.setform.hide();
        };

        $scope.newSetInterval = function() {
            $scope.updating = false;
            $scope.selectedValue = "";
            $scope.showSet();
        }
        
        $scope.intervalSelected = function (selectedValue) {
            $scope.selectedValue = selectedValue; // this is a new interval 
        }        

        // Open the set modal
        $scope.showSet = function() {
            $scope.setform.show();
        };

        // Perform the set action when the user submits the set form
        $scope.completeSet  = function() {
            if ($scope.updating) {
                $scope.set.intervals[$scope.index] = $scope.selectedValue; 
            }
            else {
                $scope.set.intervals.push($scope.selectedValue);
            }
            $scope.setform.hide();
        };
        
        $scope.editSetInterval = function(index) {
            $scope.editInterval     = $scope.set.intervals[index];
            if ($scope.editInterval == undefined)
                return;
            $scope.index            = index;
            $scope.updating = true;
            $scope.selectedValue = $scope.editInterval;
            $scope.showSet();
        }
        
    }]);

