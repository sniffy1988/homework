//Function construrtor for user
$(document).ready(function(){
	var storage = new ObjectStorage;
	var user = localStorage.getItem("logged");
	var greet = $('.greet').text();
	if (user !== "") {
		user = storage.local[user].name;
		$('.greet').text(greet+user);
		$('.greet').text(greet);
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
		storage.local[login] = {'name': login,'password': pass1};
		localStorage.setItem('logged', login);
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
//MAP
	var map;
	function initialize() {
  	var mapOptions = {
    	zoom: 8,
    	center: new google.maps.LatLng(-34.397, 150.644)
  	};
  	map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);
	}
});
//geoposition

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