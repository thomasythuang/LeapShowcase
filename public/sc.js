SC.initialize({
  client_id: '42913cd5bdf32a8069290ef75157ca08'
});

var widget = document.getElementById('widget');
var song = document.getElementById('song');

//var track_url = 'https://soundcloud.com/chris_brown/fine-china';
//var track_url = 'https://soundcloud.com/steveaoki/steve-aoki-chris-lake-tujamo-delirious-boneless-feat-kid-ink';
//var track_url = 'https://soundcloud.com/dodgeandfuski/dodge-fuski-call-my-name';

/*
SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
  //console.log('oEmbed response: ' + oEmbed);
  //console.log(oEmbed);
  console.log(oEmbed);
  
  widget.innerHTML = oEmbed.html;
  
  var iframe = widget.childNodes[0];
  iframe.muted = true;
  
  iframe.setAttribute("id", "widget1");
  var widget1 = SC.Widget('widget1');
  widget1.setVolume(0);  
}); */

var id1 = "85882104";
var id2 = "152543359";
var id3 = "98878640";
var track;

SC.stream("/tracks/" + id2, function(sound){
	playQuiet(sound);
});	

$(document).keypress(function(e){
	switch (e.keyCode){
		case 32:
			track.togglePause();
			break;
		case 49:
			track.destruct();
			SC.stream("/tracks/" + id1, function(sound){
				playQuiet(sound);
			});
			song.innerHTML = "Chris Brown- Fine China";
			break;	
		case 50:
			track.destruct();
			SC.stream("/tracks/" + id2, function(sound){
				playQuiet(sound);
			});
			song.innerHTML = "Steve Aoki- Boneless";
			break;	
		case 51:
			track.destruct();
			SC.stream("/tracks/" + id3, function(sound){
				playQuiet(sound);
			});
			song.innerHTML = "Dodge and Fuski- Call My Name<br>(Astronaut Remix)";
			break;	
	}
});

function playQuiet(sound){
	track = sound;
	track.setVolume(15);
	track.play();
}