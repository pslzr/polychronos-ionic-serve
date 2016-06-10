angular.module('polyChronos.controllers')

// FOR ALL AVAILABLE SETS
.controller('TimersController',
 
        ['$state', '$ionicModal', '$window', '$scope','$rootScope',
         'timers','baseURL', 'AuthFactory', 'timersFactory', '$ionicPopup',
          
        function($state, $ionicModal, $window, $scope, $rootScope, 
                timers, baseURL, AuthFactory, timersFactory, $ionicPopup) {

        $scope.baseURL = baseURL;
        $scope.timers = timers;
        
        $scope.findTimerArray = function (id){
            for (var i in $scope.timers) {
            if (id == $scope.timers[i]._id)
                return $scope.timers[i];
            }
        }
        
        $scope.deleteTimerArray = function (id){
            for (var i in $scope.timers) {
            if (id == $scope.timers[i]._id) {
                
                $scope.timers.splice(i, 1);
                // $state.go($state.current, {}, {reload: true});
                return;
            }
            }
        }
        
        $scope.updateTimerArray = function (id, timer){
            for (var i in $scope.timers) {
                if (id == $scope.timers[i]._id) {
                    $scope.timers[i] = timer;
                    // $state.go($state.current, {}, {reload: true});
                    return;
                }
            }
        }
        
        /////////////////////////////
        // FORM MODAL
        $ionicModal.fromTemplateUrl('templates/timersModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.timerform = modal;
        });

        // Triggered in the timer modal to close it
        $scope.closeTimer  = function() {
            $scope.timerform.hide();
        };

        $scope.newTimer = function() {
            $scope.timer = {
                             name:"",
                             sets:[]
                         };
            $scope.updating = false;
            $scope.showTimer();
        }
        
        // Open the timer modal
        $scope.showTimer = function() {
            $scope.timerform.show();
        };

        // Perform the timer action when the user submits the timer form
        $scope.completeTimer  = function() {
            // console.log('Adding timer', JSON.stringify($scope.timer));
            if ($scope.updating) {
                // its updating  
                timersFactory.update ({id:$scope.timer._id}, $scope.timer,
                            function(response) {
                                // reload page
                                $scope.updateTimerArray ($scope.timer._id, response);
                                // $window.location.reload(true);
                                // $scope.timers.push ($scope.timer);
                            },
                            function(response){
                                // $rootScope.$broadcast('login:Unsuccessful');
                                $ionicPopup.alert({
                                    title: 'Unsuccessful update',
                                    template: JSON.stringify (response.data.message)
                                });
                            }
                );
            }
            else {
                // its adding
                timersFactory.save ($scope.timer,
                        function(response) {
                            // reload page
                            // $window.location.reload(true);
                            //$ionicPopup.alert({
                            //    title: 'Added',
                            //    template: JSON.stringify (response)
                            //});
                            
                            $scope.timers.push (response);
                        },
                        function(response){
                            // $rootScope.$broadcast('login:Unsuccessful');
                            $ionicPopup.alert({
                                title: 'Unsuccessful adding',
                                template: JSON.stringify (response.data.message)
                            });
                        }
                );
            }
            $scope.timerform.hide();
        };
        
        $scope.deleteTimer = function(id) {
            var timer = $scope.findTimerArray(id);
            if (timer == undefined)
                return;
            var doConfirm = $ionicPopup.confirm({
                title: 'Delete',
                template: timer.name
            });
            doConfirm.then (function(res){
                if (res) {
                    timersFactory.delete ({id: timer._id}, 
                        function(response) {
                            // reload page
                            $scope.deleteTimerArray (timer._id);
                            // $window.location.reload(true);
                            // $scope.timers.push ($scope.timer);
                        },
                        function(response){
                            // $rootScope.$broadcast('login:Unsuccessful');
                            $ionicPopup.alert({
                                title: 'Unsuccessful Query',
                                template: JSON.stringify (response.data.message)
                            });
                        } );
                }
                }
            );
            
        }
        $scope.editTimer = function(id) {
            var timer = $scope.findTimerArray(id);
            if (timer == undefined)
                return;
            $scope.updating = true;
            $scope.timer              = Object.assign({},timer);
            $scope.timer.sets         = timer.sets;
            $scope.showTimer();
        }
        
        $scope.editTimerList = function(id) {
            var timer = $scope.findTimerArray(id);
            if (timer == undefined)
                return;
            // console.log('timer', JSON.stringify(timer));
                
            $rootScope.editingTimer              = Object.assign({},timer);
            $state.go('app.timer');
            // $window.location.reload(true);            
        }
        
       
    }]);

