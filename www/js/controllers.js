angular.module('polyChronos.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $localStorage, 
                                AuthFactory, recentsFactory, $ionicPopup, $state, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.isSelected = function (item) {
    return $state.includes("**."+item+".**"); 
  }
  
  $scope.select = function (item) {
    $ionicHistory.nextViewOptions({
        disableBack: true
    });    
    $state.go(item, {}, {location:true});
  }
   
  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    //console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);
      
    // Simulate a login delay. Remove this and replace with your login
    AuthFactory.login ($scope.loginData);
    $scope.modal.hide();
    
    // code if using a login system
    //$timeout(function() {
    //  $scope.closeLogin();
    //}, 400);
  };

  // do logout
  $scope.logout = function() {
    AuthFactory.logout ();
    // $scope.modal.show();
  };
    
  $scope.newRecent = function(timerId) {
    var recent = {timer:timerId,
                  status:0,
                  setIdx:0,
                  intIdx:0,
                  set:"",
                  cycle:0,
                  interval:"",
                  seconds:0   
                };
        // its adding
        recentsFactory.save (recent,
            function(response) {
              // ensure this recent timer to be shown first
              $scope.addingRecent = response;

              // redirect state to recent timers,.. ensure reload recent timers
              $scope.select ("app.recents");
            },
            function(response){
                // $rootScope.$broadcast('login:Unsuccessful');
                $ionicPopup.alert({
                    title: 'Unsuccessful adding',
                    template: JSON.stringify (response.data.message)
                });
                
            }
        );
  };


  stopAudio = function (audio) {
      audio.pause();
      audio.callback();
  }

  doVibrate = function () {
      var alertPopup = $ionicPopup.alert({
          title: 'Vibrating',
          template: "simulation"
      });
    
      $timeout(function() {
          alertPopup.close();
      }, 500);
  }

  $scope.playAudio = function (file, timeToPlay, volume, callback){
    var audioFile = 'http://i.cloudup.com/YdDNGA0sj5.ogg';
    // by now, just use predefined names
    switch (file){
      case "bottle":
            audioFile = 'http://i.cloudup.com/baNnhH1I7M.ogg';
            break;
      case "funk":
            audioFile = 'http://i.cloudup.com/7SSbOm5XZS.ogg';
            break;
      case "glass":
            audioFile = 'http://i.cloudup.com/3gveeCqUD6.ogg';
            break;
      case "morse":
            audioFile = 'http://i.cloudup.com/b0EXCVaceT.ogg';
            break;
      case "pop":
            audioFile = 'http://i.cloudup.com/4TnDj0v9GE.ogg';
            break;
      case "purr":
            audioFile = 'http://i.cloudup.com/YdDNGA0sj5.ogg';
            break;
      case "submarine":
            audioFile = 'http://i.cloudup.com/2OPb5OYAI2.ogg';
            break;
      case "tink":
            audioFile = 'http://i.cloudup.com/SNi1RX8iwb.ogg';
            break;
    }
    
    curAudio = new Audio(audioFile); 
    curAudio.timeToPlay = timeToPlay;
    curAudio.timePlaying = 0.0;
    curAudio.callback = callback;
    //console.log("playing audio", curAudio.timePlaying , curAudio.timeToPlay);
    
    if (volume != undefined) {
      //console.log("volume is ", volume);
      curAudio.volume = volume / 100;
    }
       
    curAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.timePlaying = this.timePlaying + this.duration;
        //console.log("end audio", this.timePlaying , this.timeToPlay);
        if (this.timePlaying < this.timeToPlay)
          this.play();
        else
          if (this.callback != undefined)
            this.callback();
        
    }, false);
    
    curAudio.play();
    return curAudio;
  }

  // code to execute timer countdown and sound playing
  $scope.recentPlaying  = [];
  
  $scope.findRecentPlaying = function (id){
    for (var i in $scope.recentPlaying) {
      if (id == $scope.recentPlaying[i]._id)
          return $scope.recentPlaying[i];
      }
    }
  $scope.deleteRecentPlaying = function (id){
      for (var i in $scope.recentPlaying) {
        if (id == $scope.recentPlaying[i]._id) {
            
            $scope.recentPlaying.splice(i, 1);
            // $state.go($state.current, {}, {reload: true});
            return;
        }
      }
  }

  $scope.nextCounter = function (recent, timer, set, interval) {
      // search next interval
      //console.log("next counter");
      if (recent.intIdx+1 < set.intervals.length) {
          interval=set.intervals[recent.intIdx+1];
          
          recent.intIdx  = recent.intIdx+1;
          recent.seconds = interval.seconds;
          recent.status = 1;
          
          //console.log("next seconds, seconds " + recent.seconds);
          
          $timeout(function(){ 
              $scope.countDown(recent); 
            }, 1000);
          return;
      }

      if (recent.cycle +1 < timer.sets[recent.setIdx].cycles) {
          interval=set.intervals[0];
          
          recent.intIdx = 0;
          recent.cycle = recent.cycle + 1;      
          recent.seconds = interval.seconds;
          recent.status = 1;
          
          //console.log("interval " + recent.intIdx);
          $timeout(function(){ 
              $scope.countDown(recent); 
            }, 1000);
          return;
      }

      // if set y completed, check cycles
      //console.log("next set");
      if (recent.setIdx+1 < timer.sets.length) {
          set=timer.sets[0].setId;
          interval=set.intervals[0];
          
          recent.intIdx = 0;
          recent.cycle = 0;
          recent.setIdx = recent.setIdx+1;
          recent.seconds = interval.seconds;
          recent.status = 1;
          
          //console.log("first interval ", recent.intIdx);
          $timeout(function(){ 
              $scope.countDown(recent); 
            }, 1000);
          return;
      }

      $scope.deleteRecentPlaying(recent._id);
      
      recent.setIdx = 0;
      recent.intIdx = 0;
      recent.cycle  = 0;
      recent.status = 0; // completed
      
      // if cycles are completed finish the timer
      //console.log("finished", recent._id);
      $state.reload();
  }

  $scope.confirmTimer = function(recent, timer, set, interval) {
    // while paused
    if (recent.status != 2)
      return;
      
    //console.log("waiting confirmation");
    
    recent.promise =   
      $timeout(function() {
          recent.promise = undefined;
                  
          if (recent.status != 2)
            return;

          //console.log("playing sound again until confirmation");
          if (interval.alarm.vibrate)
            doVibrate ();
          recent.audio = $scope.playAudio (interval.alarm.filename, interval.alarm.seconds, 
                      interval.alarm.volume,
                      function () {
                        recent.audio = undefined;
                        
                        // if stoped, do not continue
                        if (recent.status == 0)
                          return;
                        // if play was pressed continue directly
                        if (recent.status == 1) {
                          $scope.nextCounter(recent, timer, set, interval);               
                          return;
                        }
                        
                        if (interval.alarm.confirmed) {
                          //console.log("confirmed, waiting ");
                          $scope.confirmTimer(recent, timer, set, interval);
                          return;               
                        }
                      }
                );
            
      }, interval.alarm.confSeconds * 1000);
  }               


  $scope.countDown = function (recent) {
      if (recent.status != 1)
        return;
      recent.seconds = recent.seconds - 1;
      //console.log("countDown interval = " +recent.intIdx + " seconds= " + recent.seconds );
      
      if (recent.seconds > 0) {
        $timeout(function(){ 
            $scope.countDown(recent); 
          }, 1000);
        return;
      }
      
      var timer=recent.timer;
      var set=timer.sets[recent.setIdx].setId;
      var interval=set.intervals[recent.intIdx];

      // play sound if defined
      if (interval.name == "") {
          $scope.nextCounter(recent, timer, set, interval);
          return;
      }

      recent.status = 2; // pausado, esperando continuar
      // simulate cell sound, with html5
      if (interval.alarm.vibrate)
        doVibrate ();
        
      recent.audio = $scope.playAudio (interval.alarm.filename, interval.alarm.seconds, 
                  interval.alarm.volume,
                  function () {
                    recent.audio = undefined;
                    
                    // if stoped, do not continue
                    if (recent.status == 0)
                      return;
                    // if play was pressed continue directly
                    if (recent.status == 1) {
                      $scope.nextCounter(recent, timer, set, interval);               
                      return;
                    }
                    // if not confirmed.. preceed playing 
                    if (!interval.alarm.confirmed) {
                      $scope.nextCounter(recent, timer, set, interval);               
                    }
                      
                    if (interval.alarm.confirmed) {
                      //console.log("confirmed, start waiting ");
                      $scope.confirmTimer(recent, timer, set, interval);
                      return;               
                    }
                  }
            );
                                 
      //var alertPopup = $ionicPopup.alert({
      //    title: 'Playing ',
      //    template: interval.alarm.name
      //});
    
      //$timeout(function() {
      //    alertPopup.close(); //close the popup after 3 seconds for some reason
      //}, 2000);

  }


  $scope.deleteTimer = function(recent) {
      console.log("deleting", recent._id);
      
      var recent = $scope.findRecentPlaying(recent._id);
      if (recent != undefined) {
        console.log("found, deleting", recent._id);
        recent.status = 0;
        $scope.deleteRecentPlaying(recent._id);
        if (recent.audio != undefined)
          recent.audio.pause();        
        else
          if (recent.promise != undefined)
            $timeout.cancel (recent.promise);
      }
  }
  $scope.pauseTimer = function(recent) {
      var recent = $scope.findRecentPlaying(recent._id);
      if (recent != undefined) {
        recent.status = 2; // status paused
      }
  }
  
  $scope.playTimer = function(recent) {
    
            var nextrecent = $scope.findRecentPlaying(recent._id);
            if (nextrecent == undefined) {
              $scope.recentPlaying.push (recent);
              recent.setIdx = 0;
              recent.intIdx = 0;
              recent.cycle  = 0;
              var timer=recent.timer;
              
              //console.log(JSON.stringify(timer));
              var sets =recent.timer.sets;
              if (sets[recent.setIdx]  == undefined)
                return; 
              var set=sets[recent.setIdx].setId;
              //console.log(JSON.stringify(set));
              var interval=set.intervals[recent.intIdx];
              //console.log(JSON.stringify(interval));
              //console.log("seconds =");
              recent.seconds = interval.seconds;
              recent.status = 1;
              $scope.countDown (recent);
              return;
            }

            // if in the middle of a sound.. stop it
            if (nextrecent.audio != undefined) {
              nextrecent.status = 1;
              stopAudio (nextrecent.audio);
              return;
            }
            // if in a middle of a confirmation, cancel it
            if (nextrecent.promise != undefined) {
              // console.log("confirmed");
              $timeout.cancel (nextrecent.promise);
              nextrecent.promise = undefined;
              var timer=nextrecent.timer;
              var set=timer.sets[nextrecent.setIdx].setId;
              var interval=set.intervals[nextrecent.intIdx];
              
              $scope.nextCounter(nextrecent, timer, set, interval);
              return;               
            }    
          nextrecent.status = 1;
          $scope.countDown (nextrecent);
        }
  
    
});

