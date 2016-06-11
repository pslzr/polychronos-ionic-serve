angular.module('polyChronos.controllers')

.controller('AlarmsController',
 
        ['$state', '$ionicModal', '$window', '$scope','$rootScope',
         'alarms','baseURL', 'AuthFactory', 'alarmsFactory', '$ionicPopup',
          
        function($state, $ionicModal, $window, $scope, $rootScope, 
                alarms, baseURL, AuthFactory, alarmsFactory, $ionicPopup) {

        $scope.baseURL = baseURL;
        $scope.alarms = alarms;
        $scope.playing = false;
        
        $scope.findAlarmArray = function (id){
            for (var i in $scope.alarms) {
            if (id == $scope.alarms[i]._id)
                return $scope.alarms[i];
            }
        }
        
        $scope.deleteAlarmArray = function (id){
            for (var i in $scope.alarms) {
            if (id == $scope.alarms[i]._id) {
                
                $scope.alarms.splice(i, 1);
                // $state.go($state.current, {}, {reload: true});
                return;
            }
            }
        }
        
        $scope.updateAlarmArray = function (id, alarm){
            for (var i in $scope.alarms) {
            if (id == $scope.alarms[i]._id) {
                $scope.alarms[i] = alarm;
                // $state.go($state.current, {}, {reload: true});
                return;
            }
            }
        }
        
        /////////////////////////////
        // POP OVER
        //$ionicPopover.fromTemplateUrl('templates/alarmPopover.html', {
        //    scope: $scope
        //    }).then(function(popover) {
        //    $scope.alarmPopover = popover;
        //    });    

        // user request to see popover
        //$scope.openPopover = function($event) {
        //        $scope.alarmPopover.show($event);
        //};

        /////////////////////////////
        // FORM MODAL
        $ionicModal.fromTemplateUrl('templates/alarmModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.alarmform = modal;
        });

        // Triggered in the alarm modal to close it
        $scope.closeAlarm  = function() {
            $scope.alarmform.hide();
        };

        $scope.newAlarm = function() {
            $scope.alarm = {
                                name:"",
                                filename:"",
                                seconds:1,
                                confirmed:false,
                                confSeconds:0,
                                vibrate:false,
                                volume:90 
                            };
            $scope.updating = false;
            $scope.showAlarm();
        }

        // Open the alarm modal
        $scope.showAlarm = function() {
            $scope.alarmform.show();
        };

        // Perform the alarm action when the user submits the alarm form
        $scope.completeAlarm  = function() {
            // console.log('Adding alarm', JSON.stringify($scope.alarm));
            if ($scope.updating) {
            // its updating  
            alarmsFactory.update ({id:$scope.alarm._id}, $scope.alarm,
                        function(response) {
                            // reload page
                            $scope.updateAlarmArray ($scope.alarm._id, response);
                            // $window.location.reload(true);
                            // $scope.alarms.push ($scope.alarm);
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
            alarmsFactory.save ($scope.alarm,
                        function(response) {
                            // reload page
                            // $window.location.reload(true);
                            //$ionicPopup.alert({
                            //    title: 'Added',
                            //    template: JSON.stringify (response)
                            //});
                            
                            $scope.alarms.push (response);
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
            $scope.alarmform.hide();
        };
        
        $scope.deleteAlarm = function(id) {
            var alarm = $scope.findAlarmArray(id);
            if (alarm == undefined)
            return;
            var doConfirm = $ionicPopup.confirm({
                title: 'Delete',
                template: alarm.name
            });
            doConfirm.then (function(res){
                if (res) {
                    alarmsFactory.delete ({id: alarm._id}, 
                        function(response) {
                            // reload page
                            $scope.deleteAlarmArray (alarm._id);
                            // $window.location.reload(true);
                            // $scope.alarms.push ($scope.alarm);
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
        $scope.editAlarm = function(id) {
            var alarm = $scope.findAlarmArray(id);
            if (alarm == undefined)
                return;
            $scope.updating = true;
            $scope.alarm = Object.assign({},alarm);
            $scope.showAlarm();
        }
        $scope.playSound = function(id){
            var alarm;
            if (id == undefined)
                alarm = $scope.alarm;
            else {
                alarm = $scope.findAlarmArray(id);
                if (alarm == undefined)
                    return;
            }
            $scope.playAudio(alarm.filename, 0, alarm.volume);
        }
        
    }]);

