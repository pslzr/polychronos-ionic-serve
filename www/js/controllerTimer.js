angular.module('polyChronos.controllers')

// FOR ONE SET WITH MULTIPLE INTERVALS
.controller('TimerController',
 
        ['$state', '$ionicModal', '$window', '$scope','$rootScope',
         'sets','baseURL', 'AuthFactory', 'timersFactory', '$ionicPopup', '$ionicPlatform',
          
        function($state, $ionicModal, $window, $scope, $rootScope, 
                sets, baseURL, AuthFactory, timersFactory, $ionicPopup, $ionicPlatform) {

        $scope.baseURL      = baseURL;
        
        $scope.timer        = $rootScope.editingTimer; // it is signaled before entering this route
        if ($scope.timer == undefined)
            $scope.timer = {name:""};
        
        if ($scope.timer.sets == undefined)
            $scope.timer.sets = [];
                    
        $scope.sets    = sets;
        $scope.newSet = {setId:"",cycles:1};

        $scope.getBack = function () {
            if ($scope.timer == undefined)
                prevIonicGoBack();
            // its updating  
            timersFactory.update ({id:$scope.timer._id}, $scope.timer,
                        function(response) {
                            prevIonicGoBack();

                        },
                        function(response){
                            var popUp = $ionicPopup.alert({
                                title: 'Unsuccessful update',
                                template: JSON.stringify (response.data.message)
                            });
                            popUp.then ( function (res) {
                                prevIonicGoBack();
                                });
                        }
            );
        }
        
        $scope.cancelBack = function () {
            $state.go('app.timers');
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
        
        $scope.findSetArray = function (id){
            for (var i in $scope.sets) {
                if (id == $scope.sets[i]._id)
                    return $scope.sets[i];
                }
            return {
              name:"Not found"  
            };
        }
        
        $scope.upTimerSet  = function (index){
            if (index > 0) {
                var setRef = $scope.timer.sets.splice(index, 1);
                $scope.timer.sets.splice (index-1, 0, setRef);
            }
        }
        
        $scope.downTimerSet = function (index){
            if (index < $scope.timer.sets.length-1) {
                var setRef = $scope.timer.sets.splice(index, 1);
                $scope.timer.sets.splice (index+1, 0, setRef);
            }
        }
        
        $scope.deleteTimerSet = function (index){
            $scope.timer.sets.splice(index, 1);
        }
        
        /////////////////////////////
        // FORM MODAL
        $ionicModal.fromTemplateUrl('templates/timerModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.timerform = modal;
        });

        // Triggered in the timer modal to close it
        $scope.closeTimer  = function() {
            $scope.timerform.hide();
        };

        $scope.newTimerSet = function() {
            $scope.updating = false;
            $scope.selectedValue = "";
            $scope.showTimer();
        }
        
        $scope.setSelected = function (selectedValue) {
            $scope.newSet.setId = selectedValue; // this is a new set
        }        

        // Open the timer modal
        $scope.showTimer = function() {
            $scope.timerform.show();
        };

        // Perform the timer action when the user submits the timer form
        $scope.completeTimer  = function() {
            //console.log('completing', JSON.stringify($scope.newSet));
            //console.log('sets', JSON.stringify($scope.timer.sets));
            if ($scope.updating) {
                $scope.timer.sets[$scope.index] = Object.assign({},$scope.newSet);
            }
            else{
                $scope.timer.sets.push(Object.assign({},$scope.newSet));
            }
            //console.log('completed', JSON.stringify($scope.timer.sets));
                
            $scope.timerform.hide();
        };
        
        $scope.editTimerSet = function(index) {
            var setTimer = $scope.timer.sets[index];
            if (setTimer == undefined)
                return;
            $scope.updating         = true;
            $scope.newSet           = Object.assign({},setTimer);
            $scope.selectedValue    = setTimer.setId;
            $scope.index            = index;
            $scope.showTimer();
        }
    }]);

