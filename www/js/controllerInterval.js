angular.module('polyChronos.controllers')

.controller('IntervalsController',
 
        ['$state', '$ionicModal', '$window', '$scope','$rootScope',
         'alarms', 'intervals','baseURL', 'AuthFactory', 'intervalsFactory', '$ionicPopup',
          
        function($state, $ionicModal, $window, $scope, $rootScope, 
                alarms, intervals, baseURL, AuthFactory, intervalsFactory, $ionicPopup) {

        $scope.baseURL = baseURL;
        $scope.alarms = alarms;
        $scope.intervals = intervals;
        
        $scope.findIntervalArray = function (id){
            for (var i in $scope.intervals) {
            if (id == $scope.intervals[i]._id)
                return $scope.intervals[i];
            }
        }
        
        $scope.deleteIntervalArray = function (id){
            for (var i in $scope.intervals) {
            if (id == $scope.intervals[i]._id) {
                
                $scope.intervals.splice(i, 1);
                // $state.go($state.current, {}, {reload: true});
                return;
            }
            }
        }
        
        $scope.updateIntervalArray = function (id, interval){
            for (var i in $scope.intervals) {
            if (id == $scope.intervals[i]._id) {
                $scope.intervals[i] = interval;
                // $state.go($state.current, {}, {reload: true});
                return;
            }
            }
        }
        
        /////////////////////////////
        // FORM MODAL
        $ionicModal.fromTemplateUrl('templates/intervalModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.intervalform = modal;
        });

        // Triggered in the interval modal to close it
        $scope.closeInterval  = function() {
            $scope.intervalform.hide();
        };

        $scope.newInterval = function() {
            $scope.interval = {
                                    name:"",
                                    alarm:"",
                                    seconds:60
                                };
            $scope.updating = false;
            $scope.selectedValue = "";
            $scope.showInterval();
        }
        
        $scope.alarmSelected = function (selectedValue) {
            $scope.interval.alarm = selectedValue;
            $scope.selectedValue = selectedValue; 
        }        

        // Open the interval modal
        $scope.showInterval = function() {
            $scope.intervalform.show();
        };

        // Perform the interval action when the user submits the interval form
        $scope.completeInterval  = function() {
            // console.log('Adding interval', JSON.stringify($scope.interval));
            if ($scope.updating) {
                // its updating  
                intervalsFactory.update ({id:$scope.interval._id}, $scope.interval,
                            function(response) {
                                // reload page
                                $scope.updateIntervalArray ($scope.interval._id, response);
                                // $window.location.reload(true);
                                // $scope.intervals.push ($scope.interval);
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
                intervalsFactory.save ($scope.interval,
                        function(response) {
                            // reload page
                            // $window.location.reload(true);
                            //$ionicPopup.alert({
                            //    title: 'Added',
                            //    template: JSON.stringify (response)
                            //});
                            
                            $scope.intervals.push (response);
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
            $scope.intervalform.hide();
        };
        
        $scope.deleteInterval = function(id) {
            var interval = $scope.findIntervalArray(id);
            if (interval == undefined)
            return;
            var doConfirm = $ionicPopup.confirm({
                title: 'Delete',
                template: interval.name
            });
            doConfirm.then (function(res){
                if (res) {
                    intervalsFactory.delete ({id: interval._id}, 
                        function(response) {
                            // reload page
                            $scope.deleteIntervalArray (interval._id);
                            // $window.location.reload(true);
                            // $scope.intervals.push ($scope.interval);
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
        $scope.editInterval = function(id) {
            var interval = $scope.findIntervalArray(id);
            if (interval == undefined)
            return;
            $scope.updating = true;
            $scope.interval         = Object.assign({},interval);
            $scope.interval.alarm   = interval.alarm._id;
            $scope.selectedValue    = interval.alarm._id;
            $scope.showInterval();
        }
        
    }]);

