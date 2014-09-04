//Function construrtor for user
$(document).ready(function(){
	var storage = new ObjectStorage();
	var user = localStorage.getItem("logged");
	var greet = $('.greet').text();
	var latitudeCurrent = 0 , longitudeCurrent = 0;
	navigator.geolocation.getCurrentPosition(showPosition);
	if (user !== "" && user !== null) {
		user = storage.local[user].name;
		$('.greet').text(greet+user);
		$('#login').addClass('hidden');
		$('.menu').removeClass('hidden');
	}
	$('#login_form').on('click','#reg',function(){
		$('#login').addClass('hidden');
		$('#register').removeClass('hidden');
	});
	function validateRegister(){
		var pass1 = $('#pass1').val();
		var pass2 = $('#pass2').val();
		var login = $('#log').val();
		if (login === "") {
			$('.login').text('Login must contains 4 simbols minimum!');
			$('.login').addClass('error');
			return false;
		}
		if (login.length <4) {
			$('.login').text('Login must contains 4 simbols minimum!');
			$('.login').addClass('error');
			return false;
		}
		if (pass1 != pass2) {
			$('.pass').text('Passsword are not equal!');
			$('.pass').addClass('error');
			$('#pass1').addClass('error_inp');
			$('#pass2').addClass('error_inp');
			return false;
		}
		for( var key in storage.local){
			if (login === storage.local[key].name){
				$('.login').text('Name is already exist!');
				$('.login').addClass('error');
			}
		}
		storage.local[login] = {'name': login,'password': pass1, markers:[], f_users: []};
		localStorage.setItem('logged', login);
		$('.greet').text(greet+login);
		$('#register').addClass('hidden');
		$('.menu').removeClass('hidden');
	};
	//enter to site!!!
	function login(){
		debugger;
		var login = $('#name').val();
		var pass = $('#password').val();
		var log = localStorage.getItem('logged');
		var password = "";
		if(log){
			var user = localStorage.getItem('logged');
		}
		if (login === "") {
			$('.log').text('please type your login!');
			$('.log').addClass('error');
		}
		if (pass === "") {
			$('.pas').text('please type your pasword!');
			$('.pas').addClass('error');
		}
		for( var key in storage.local){
			if (login === storage.local[key].name) {
				password = storage.local[key].password;
			}
		}
		if (password === "") {
			$('.log').text('wrong username!');
			$('.log').addClass('error');
			return false;
		}
		if (pass === password) {
			user = storage.local[login];
			$('.greet').text(greet+login);
			$('#login').addClass('hidden');
			$('.menu').removeClass('hidden');
			localStorage.setItem('logged',login);
		}else{
			$('.pas').text('wrong pasword');
			$('.pas').addClass('error');
		}
	};
	function logout(){
			localStorage.setItem('logged', "");
			$('.greet').text(greet);
			$('.menu').addClass('hidden');
			$('#login').removeClass('hidden');
			$('#name').val("");
			$('#password').val("");
	};
	$('#registration').submit(function(){
		validateRegister();
	});
	$('#login_form').submit(function(){
		login();
	});
	$('.logout').click(function(){
		logout();
	});
	$('.map_btn').click(function(){
		$('.menu').addClass('hidden');
		$('.map').removeClass('hidden');
		initialize();
		getListUser();
		getFavorite();
	});
	$('.users').on('click','li', function(){
		$('.add_user').removeClass('hidden');
		$('.show_map').removeClass('hidden');
		$('.remove_user').addClass('hidden');
		$('body').find('.active').removeClass('active');
		$(this).addClass('active');
	});
	$('.add_user').click(function(){
		var favourite = $('.users').find('.active').text();
		for(var i = 0; i < storage.local[user].f_users.length; i++){
			if (favourite === storage.local[user].f_users[i]) {
				alert('Selected user is already in favourite users!');
				return false;
			}
		}
		storage.local[user].f_users.push(favourite);
		getFavorite();
	});
	$('.favor').on('click','li', function(){
		$('body').find('.active').removeClass('active');
		$(this).addClass('active');
		$('.add_user').addClass('hidden');
		$('.show_map').removeClass('hidden');
		$('.remove_user').removeClass('hidden');
	});
	$('.remove_user').click(function(){
		var favourite = $('.favour').find('.active').text();
		for ( var i = 0; i < storage.local[user].f_users.length; i++){
			if (storage.local[user].f_users[i] === favourite) {
				storage.local[user].f_users.splice(i,1);
			}
		}
		getFavorite();
	});



	//geoposition
	function showPosition (position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		latitudeCurrent = latitude;
		longitudeCurrent = longitude;
		console.log(latitude);
		console.log(longitude);
	}

//MAP
		var map;
		var mapOptions = {
		    zoom: 13,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
		    center: new google.maps.LatLng(latitudeCurrent,longitudeCurrent)
 		 }
		function initialize() {
  		map = new google.maps.Map(document.getElementById("map-canvas"),
      	mapOptions);
      	var userMarker = storage.local[user].markers;
		for(var i =0; i < userMarker.length; i++){
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(userMarker[i].location.B, userMarker[i].location.k),
				map: map,
				title: userMarker[i].title
			});
		}
  		google.maps.event.addListener(map, 'click', function(event) {
    		placeMarker(event.latLng);
  		});
}

  	
function placeMarker(location) {
  var marker = new google.maps.Marker({
      position: location,
      map: map,
      title: prompt('enter title')
  });
  //storing marker
  storage.local[user].markers.push({
  	location : marker.position,
  	title: marker.title
  });
  }
function getListUser(){
	var listUsers = [];
	for (var key in storage.local){
		if (user === storage.local[key].name) {
			continue;
		}else{
			listUsers.push(storage.local[key].name);
		}
	}
	var list = $('<ul/>')
	for(var i = 0; i < listUsers.length; i++){
		var li = $('<li/>');
		li.text(listUsers[i]);
		li.addClass('user_entry');
		li.appendTo(list);
	}
	list.addClass('list_users');
	list.appendTo($('.users'));
}
function getFavorite(){
	var listUsers = [];
	if($('.favour')){
		$('.favour').detach();
	}
	for (var i = 0; i < storage.local[user].f_users.length; i++){
		listUsers.push(storage.local[user].f_users[i]);
	}
	var fav_ul = $('<ul/>');
	fav_ul.addClass('favour');
	for( var i = 0; i< listUsers.length; i++){
		var fav_li = $('<li/>');
		fav_li.text(listUsers[i]);
		fav_li.appendTo(fav_ul);
	}
	fav_ul.appendTo($('.favor'));
}
});
var ObjectStorage = function ObjectStorage( name, duration ) {
    var self,
        name = name || '_objectStorage',
        defaultDuration = 5000;
        
    // дабы не плодить кучу экземпляров, использующих один и тот же ключ хранилища, 
    // просто возвращаем единственный с заданным именем,
    // меняя только duration (если имеется)
    if ( ObjectStorage.instances[ name ] ) {
        self = ObjectStorage.instances[ name ];
        self.duration = duration || self.duration;
    } else {
        self = this;
        self._name = name;
        self.duration = duration || defaultDuration;
        self._init();
        ObjectStorage.instances[ name ] = self;
    }
    
    return self;
};
ObjectStorage.instances = {};
ObjectStorage.prototype = {
    // type == local || session
    _save: function ( type ) {
        var stringified = JSON.stringify( this[ type ] ),
            storage = window[ type + 'Storage' ];
        if ( storage.getItem( this._name ) !== stringified ) {
            storage.setItem( this._name, stringified );
        }
    },

    _get: function ( type ) {
        this[ type ] = JSON.parse( window[ type + 'Storage' ].getItem( this._name ) ) || {};
    },

    _init: function () {
        var self = this;
        self._get( 'local' );
        self._get( 'session' );

        ( function callee() {
            self.timeoutId = setTimeout( function () {
                self._save( 'local' );
                callee();
            }, self._duration );
        })();

        window.addEventListener( 'beforeunload', function () {
            self._save( 'local' );
            self._save( 'session' );
        });
    },
    // на случай, если нужно удалить таймаут (clearTimeout( storage.timeoutId ))
    timeoutId: null,
    local: {},
    session: {}
};
