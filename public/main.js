window.plotter = new LeapDataPlotter({
	el: document.getElementById('plots')
});

var sample;
var volume = 1.0; // default max volume
var ymin = 100, ymax = 350; // min and max heights for detecting hand height

var app = angular.module('LeapShowcase', ['ui.bootstrap',]);
app.controller('mainController', function($scope){
  sample = new Audio('resources/sounds/work.mp3');

  $scope.volume = 100;
  $scope.rate = sample.playbackRate;

  $scope.play = function(){
    play();
    $scope.rate = sample.playbackRate;
  }
  $scope.pause = function(){
    pause();
  }
  $scope.quieter = function(){
    quieter();
    $scope.volume = Math.round(sample.volume * 100);
  }
  $scope.louder = function(){
    louder();
    $scope.volume = Math.round(sample.volume * 100);
  }
  $scope.fasterSpeed = function(){
    fasterSpeed();
    $scope.rate = sample.playbackRate;
  }
  $scope.slowerSpeed = function(){
    slowerSpeed();
    $scope.rate = sample.playbackRate;
  }

});

Leap.loop({enableGestures: true, background: true}, function(frame){
  var hand1 = frame.hands[0];
  var hand2 = frame.hands[1];
  if (!hand1 && !hand2) return;

  if (hand1){

    var x1 = hand1.palmPosition[0];
    var y1 = hand1.palmPosition[1];
    var v1x = hand1.palmVelocity[0];
    var v1y = hand1.palmVelocity[1];

    if (hand1.grabStrength > 0.9){
      if (y1 < ymin){
        y1 = ymin;
      }else if(y1 > ymax){
        y1 = ymax;
      }

      y1 = (y1 - ymin) / (ymax - ymin);
      setVolume(y1);
    }

    // call this once per frame per plot
    plotter.plot('height 1', y1, {
      precision: 3,
      units: 'mm'
    });

    plotter.plot('x velocity 1', v1x, {
      precision: 4,
      units: 'mm/s'
    });

    plotter.plot('y velocity 1', v1y, {
      precision: 4,
      units: 'mm/s'
    });
  }


  if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
        switch (gesture.type){
          case "circle":
              var state = gesture.state;
              var circleProgress = gesture.progress;
              var completeCircles = Math.floor(circleProgress);

              // check direction
              var clockwise = false;
              var pointableID = gesture.pointableIds[0];
              var direction = frame.pointable(pointableID).direction;
              var dotProduct = Leap.vec3.dot(direction, gesture.normal);
              if (dotProduct  >  0) clockwise = true;

              if (completeCircles >= 1 && state=="update"){
                if (clockwise){
                  fasterSpeed();
                  console.log("faster");
                  console.log(sample.playbackRate);
                }
                if (!clockwise){
                  slowerSpeed();
                  console.log("slower");
                  console.log(sample.playbackRate);
                }
              }

              break;

          // case "keyTap":
          //     console.log("Key Tap Gesture");
          //     break;

          case "screenTap":
               console.log("Screen Tap Gesture");
               sample.playbackRate = 1.0;
               break;

          // case "swipe":
          //     console.log("Swipe Gesture");
          //     break;
        }
    });
  }

  // call this once per frame
  plotter.update()
});


function play(){
  sample.play();
  sample.playbackRate = 1.0;
}
function fasterSpeed() {
  sample.playbackRate = sample.playbackRate*1.005;
}
function slowerSpeed() {
  sample.playbackRate= sample.playbackRate/1.005;
}
function reverseSong() {
  sample.playbackRate= -1.0;
}
function pause(){
  sample.pause();
}
function setVolume(vol){
  sample.volume = vol;
}
function quieter(){
  if (sample.volume < 1.0)
  {
    sample.volume += 0.1;
  }
}
function louder(){
  if (sample.volume > 0.0)
  {
    sample.volume -= 0.1;
  }
}

// Adds the rigged hand plugin to the controller
visualizeHand = function(controller){

  controller.use('playback').on('riggedHand.meshAdded', function(handMesh, leapHand){
	  handMesh.material.opacity = 0.8;
  });

  var overlay = controller.plugins.playback.player.overlay;
  overlay.style.right = 0;
  overlay.style.left = 'auto';
  overlay.style.top = 'auto';
  overlay.style.padding = 0;
  overlay.style.bottom = '13px';
  overlay.style.width = '180px';


  controller.use('riggedHand', {
		scale: 1.3,
		boneColors: function (boneMesh, leapHand){
		  if (boneMesh.name.indexOf('Finger_') == 0){
				return {
				  hue: 0.75,
				  saturation: leapHand.grabStrength,
				  lightness: 0.5
				}
		  }
		}
  });

  var camera = controller.plugins.riggedHand.camera;
  camera.position.set(0,20,-25);
  camera.lookAt(new THREE.Vector3(0,3,0));
};
visualizeHand(Leap.loopController);
