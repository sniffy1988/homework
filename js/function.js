//Function construrtor for user
$(document).ready(function(){
	$('#login_form').on('click','#reg',function(){
		$('#login').addClass('hidden');
		$('#register').removeClass('hidden');
	});
	function validateRegister(){
		var pass1 = $('#pass1').val();
		var pass2 = $('#pass2').val();
		var login = $('#log').val();
		var storage = new ObjectStorage;
		debugger;
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
		storage.local[login] = {'name': login,'password': pass1, logged: true}
	};
	//enter to site!!!
	function login(){
		var login = $('#name').val();
		var pass = $('#password').val();
	};
	$('#registration').submit(function(){
		validateRegister();
	});
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