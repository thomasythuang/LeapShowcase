window.plotter = new LeapDataPlotter({
	el: document.getElementById('plots')
});

var output = document.getElementById('output'),
	progress = document.getElementById('progress'),
	display = document.getElementById('main');
var down, left, up;
var hit1 = false, hit2 = false; 
var posX1, posX2;
var ready1x = false, ready1yd = false, ready1yu = false, ready2x = false, ready2yd = false, ready2yu = false;
var colors = ["FF2E74", "60FF52", "1A1AD9", "ED1127", "24F0E6", "FF7226", "F2E533", ]
var colorsOn;

var app = angular.module('HandRave', ['ui.bootstrap',]);
app.controller('mainController', function($scope){
  $scope.gesture = {};
  $scope.sounds = [
    {name: 'kick1', link: 'resources/sounds/bump1.wav'},
    {name: 'kick2', link: 'resources/sounds/bump2.wav'},
    {name: 'hihat1', link: 'resources/sounds/hihat1.wav'},
    {name: 'hihat2', link: 'resources/sounds/hihat2.wav'},
    {name: 'hihat3', link: 'resources/sounds/hihat3.wav'},
    {name: 'hihat4', link: 'resources/sounds/hihat4.wav'},
    {name: 'snare1', link: 'resources/sounds/snare1.wav'},
    {name: 'snare2', link: 'resources/sounds/snare2.wav'},
  ]
  $scope.gesture.down = $scope.sounds[1];
  $scope.gesture.left = $scope.sounds[6];
  $scope.gesture.up = $scope.sounds[3];
  $scope.colorsOn = true;
  
  $scope.$watch('gesture.down', function(){
    if (!$scope.gesture.down) 
      down = null;
    else
      down = new Audio($scope.gesture.down.link);
  });
  $scope.$watch('gesture.left', function(){
    if (!$scope.gesture.left)
      left = null;
    else
      left = new Audio($scope.gesture.left.link);
  })
  $scope.$watch('gesture.up', function(){
    if (!$scope.gesture.up)
      up = null;
    else
      up = new Audio($scope.gesture.up.link);
  })
  $scope.$watch('colorsOn', function(){
    colorsOn = $scope.colorsOn;
  })

  $scope.test = function(){
    console.log("yo");
  }
});

Leap.loop({background: true}, function(frame){
  var hand1 = frame.hands[0];
  var hand2 = frame.hands[1];
  if (!hand1 && !hand2) return;

  if (hand1){
    
    var x1 = hand1.palmPosition[0];
    var y1 = hand1.palmPosition[1];
    var v1x = hand1.palmVelocity[0];
    var v1y = hand1.palmVelocity[1];

    var fingers = hand1.fingers;
    
    /*
    if (v1y < -900 && ready1yd){
      if (hand1.grabStrength > 0.9)
        bump(true, true);
      else
        bump(true);
      ready1yd = false;
    }else if (v1y > 0){
      bump(false);
      ready1yd = true;
    }

    if (v1y > 1000 && ready1yu){
      swipeUp();
      ready1yu = false;
    }else if (v1y < 0){
      ready1yu = true;
    }

    if (posX1 == undefined){
      if (x1 >= 0)
        posX1 = true;
      else
        posX1 = false;
    }

    if (v1x < -700 && ready1x){
      swipeLeft();
      ready1x = false;
    }else if (v1x > 0){
      ready1x = true;
    }*/

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

  /*
  if (hand2){
    var x2 = hand2.palmPosition[0];
    var y2 = hand2.palmPosition[1];
    var v2x = hand2.palmVelocity[0];
    var v2y = hand2.palmVelocity[1];

    if (v2y < -700 && ready2yd){
      if (hand2.grabStrength > 0.9)
        bump(true, true);
      else
        bump(true);
      ready2yd = false;
    }else if (v2y > 0){
      bump(false);
      ready2yd = true;
    }

    if (v2y > 1000 && ready2yu){
      swipeUp();
      ready2yu = false;
    }else if (v2y < 0){
      ready2yu = true;
    }

    if (posX2 == undefined){
      if (x2 >= 0)
        posX2 = true;
      else
        posX2 = false;
    }

    if (v2x < -700 && ready2x){
      swipeLeft();
      ready2x = false;
    }else if (v2x > 0){
      ready2x = true;
    }

    // call this once per frame per plot
    plotter.plot('height 2', y2, {
      precision: 3,
      units: 'mm'
    });

    plotter.plot('y velocity 2', v2y, {
      precision: 4,
      units: 'mm/s'
    });

    plotter.plot('y velocity 2', v2y, {
      precision: 4,
      units: 'mm/s'
    });
  } */

  // call this once per frame
  plotter.update()
});

function swipeLeft(){
  if (!left) return;
  left.volume = 0.5;
  left.play();
}
function swipeUp(){
  if (!up) return;
  up.volume = 0.5;
  up.play();
}
function bump(hit, AMPED){
  if (!down) return;
  if (AMPED){
    if (colorsOn)
      display.style.backgroundColor = "#bb0000";
    down.volume = 1.0;
    down.play();
  }else if (hit){
    if (colorsOn)
		  display.style.backgroundColor = randomColor();
    down.volume = 0.5;
		down.play();
	}else{
		display.style.backgroundColor = "#ededed";
	}
}

function randomColor(){
  return colors[Math.floor(Math.random()*colors.length)];
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
