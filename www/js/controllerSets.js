angular.module('polyChronos.controllers')

// FOR ALL AVAILABLE SETS
.controller('SetsController',
 
        ['$state', '$ionicModal', '$window', '$scope','$rootScope',
         'sets','baseURL', 'AuthFactory', 'setsFactory', '$ionicPopup',
          
        function($state, $ionicModal, $window, $scope, $rootScope, 
                sets, baseURL, AuthFactory, setsFactory, $ionicPopup) {

        $scope.baseURL = baseURL;
        $scope.sets = sets;
        
        $scope.findSetArray = function (id){
            for (var i in $scope.sets) {
            if (id == $scope.sets[i]._id)
                return $scope.sets[i];
            }
        }
        
        $scope.deleteSetArray = function (id){
            for (var i in $scope.sets) {
            if (id == $scope.sets[i]._id) {
                
                $scope.sets.splice(i, 1);
                // $state.go($state.current, {}, {reload: true});
                return;
            }
            }
        }
        
        $scope.updateSetArray = function (id, set){
            for (var i in $scope.sets) {
                if (id == $scope.sets[i]._id) {
                    $scope.sets[i] = set;
                    // $state.go($state.current, {}, {reload: true});
                    return;
                }
            }
        }
        
        /////////////////////////////
        // FORM MODAL
        $ionicModal.fromTemplateUrl('templates/setsModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.setform = modal;
        });

        // Triggered in the set modal to close it
        $scope.closeSet  = function() {
            $scope.setform.hide();
        };

        $scope.newSet = function() {
            $scope.set = {
                             name:"",
                             intervals:[]
                         };
            $scope.updating = false;
            $scope.showSet();
        }
        
        // Open the set modal
        $scope.showSet = function() {
            $scope.setform.show();
        };

        // Perform the set action when the user submits the set form
        $scope.completeSet  = function() {
            // console.log('Adding set', JSON.stringify($scope.set));
            if ($scope.updating) {
                // its updating  
                setsFactory.update ({id:$scope.set._id}, $scope.set,
                            function(response) {
                                // reload page
                                $scope.updateSetArray ($scope.set._id, response);
                                // $window.location.reload(true);
                                // $scope.sets.push ($scope.set);
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
                setsFactory.save ($scope.set,
                        function(response) {
                            // reload page
                            // $window.location.reload(true);
                            //$ionicPopup.alert({
                            //    title: 'Added',
                            //    template: JSON.stringify (response)
                            //});
                            
                            $scope.sets.push (response);
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
            $scope.setform.hide();
        };
        
        $scope.deleteSet = function(id) {
            var set = $scope.findSetArray(id);
            if (set == undefined)
            return;
            var doConfirm = $ionicPopup.confirm({
                title: 'Delete',
                template: set.name
            });
            doConfirm.then (function(res){
                if (res) {
                    setsFactory.delete ({id: set._id}, 
                        function(response) {
                            // reload page
                            $scope.deleteSetArray (set._id);
                            // $window.location.reload(true);
                            // $scope.sets.push ($scope.set);
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
        $scope.editSet = function(id) {
            var set = $scope.findSetArray(id);
            if (set == undefined)
                return;
            $scope.updating = true;
            $scope.set              = Object.assign({},set);
            $scope.set.intervals    = set.intervals;
            $scope.showSet();
        }
        
        $scope.editSetList = function(id) {
            var set = $scope.findSetArray(id);
            if (set == undefined)
                return;
            console.log('set', JSON.stringify(set));
                
            $rootScope.editingSet  = Object.assign({},set);
            $state.go('app.set');
            // $window.location.reload(true);            
        }
    }]);

