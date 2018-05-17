// client-side js
localStorage.clear(); //clear database for gun

import '../scss/main.scss';
import $ from 'jquery';

//gun.js
import Gun from 'gun';
import 'gun/sea';

//custom chain gun.js
import 'gun/nts';
import 'gun/lib/time';

import 'gun/lib/path';
import 'gun/lib/load';
import 'gun/lib/open';
import 'gun/lib/then';
import 'gun/lib/unset';

var SEA = Gun.SEA;
window.SEA = SEA;
//console.log(SEA);
/*
;(async () => {
	var SEA = Gun.SEA;
	var pair = await SEA.pair();
	var enc = await SEA.encrypt('hello self', pair);
	var data = await SEA.sign(enc, pair);
	console.log(data);
	var msg = await SEA.verify(data, pair);
	var dec = await SEA.decrypt(msg, pair);
	var proof = await SEA.work(dec, pair);
	var check = await SEA.work('hello self', pair);
	console.log(dec);
	console.log(proof === check);
	})();
	*/
//localhost 8080 , proxy doesn't work for reason when 8080 > 3000
var gun;
if(location.origin == 'http://localhost:3000'){
	gun = Gun({
		peers:['http://localhost:8080' + '/gun'],
		secure: false, //not added?
	});
	console.log('local gun.js');
}else{
	gun = Gun(location.origin + '/gun');
	console.log('host gun.js');
}
console.log(gun);

gun.on('hi', peer => {//peer connect
	//console.log('connect peer to',peer);
	console.log('peer connect!');
});
  
gun.on('bye', (peer)=>{// peer disconnect
	//console.log('disconnected from', peer);
	console.log('disconnected from peer!');
});

//gun.get('data').once(()=>{console.log("connect!");});
//gun.get('data').put({text:'text'});
//gun.get('@').time((data, key, time)=>{ // subscribe to all incoming posts
	//console.log(data);
    // data might be a soul that you have to GET, I haven't made `time` be chainable yet
//}, 99); // grab the last 99 items

(function(){
	//'use strict';
	//console.log('hello world :o');
	var user = gun.user();

	//default
	$('#app').html(`
	<span>Theme</span>
	<button id="light">Light</button>
	<button id="dark">Dark</button>
	<br>
	<br>
	<div id="view"></div>
	`);

	$('#light').click(()=>{
		document.querySelector('body').classList.remove("dark");
		document.querySelector('body').classList.add("light");
	});

	$('#dark').click(()=>{
		document.querySelector('body').classList.remove("light");
		document.querySelector('body').classList.add("dark");
	});

	//login view
	var html_login = `
	<span>Alias</span>
	<input id="alias">
	<br><span>Passphrase</span>
	<input id="passphrase">
	<br><button id="login">Login</button>
	<button id="signup">Sign up</button>
	<button id="forgot">Forgot</button>
	`;
	//forgot view
	var html_forgot = `
	<span>Alias</span><input id="alias">
	<br><span>Q1</span><input id="q1">
	<br><span>Q1</span><input id="q2">
	<br><span>Hint</span><input id="hint">

	<br>
	<button id="backlogin">Back</button>
	<button id="gethint">Get Hint</button>
	`;

	var html_auth = `
	<button id="logout">Logout</button>
	<button id="passwordhint">Password Hint</button>
	<button id="privatemessage">Private Message</button>
	<br><span id="alias">User Alias</span>
	<br><span id="publickey">Public Key</span>
	`;

	var html_passwordhint = `
	<button id="authback">Back</button>
	<br><span>Alias: <input id="alias"></span>
	<br><span>Q1:<input id="q1"</span>
	<br><span>Q2:<input id="q1"></span>
	<br><span>Hint:<input id="hint"></span>
	<br><button id="setpasswordhint">Apply</button>
	`;

	var html_privatemessage = `
	<button id="authback">Back</button>
	<br>
	<br><label>Alias Public Key:</label><input id="pub"><label id="status">Status: None</label>
	<br><label>Private Message:</label><input id="message">
	<br><label>Action:</label><button id="send">Send</button>
	<br>Messages:
	<div id="messages"></div>
	`;

	function view_login(){
		$('#view').html(html_login);
		$('#login').click(()=>{
			//console.log('login...?');
			//console.log($('#alias').val());
			//console.log($('#passphrase').val());
			authalias($('#alias').val(),$('#passphrase').val());
		});
		$('#signup').click(()=>{
			//console.log('signup...?');
			//console.log($('#alias').val());
			//console.log($('#passphrase').val());
			createalias($('#alias').val(),$('#passphrase').val());
		});
		$('#forgot').click(()=>{
			console.log('forgot...?');
			view_forgot()
		});
	}

	function view_forgot(){
		$('#view').html(html_forgot);
		
		$('#backlogin').click(()=>{
			console.log('backlogin...?');
			view_login();
		});
	}

	function view_passwordhint(){
		$('#view').html(html_passwordhint);
		$('#authback').click(()=>{
			view_auth();
		});

		$('#setpasswordhint').click(()=>{
			console.log("apply");
		});
	}

	function view_privatemessage(){
		$('#view').html(html_privatemessage);
		$('#authback').click(()=>{
			view_auth();
		});

		$('#send').click(()=>{
			console.log("apply");
		});
	}

	function view_auth(){
		$('#view').html(html_auth);
		$('#alias').text('Alias:'+user.is.alias);
		$('#publickey').text('Public Key:'+user.is.pub);

		$('#logout').click(()=>{
			console.log(user);
			user.leave();
			view_login();
		});

		$('#passwordhint').click(()=>{
			user.leave();
			view_passwordhint();
		});

		$('#privatemessage').click(()=>{
			view_privatemessage();
		});


		
	}

	function authalias(_alias,_passphrase){
		user.auth(_alias,_passphrase,(ack)=>{
			console.log(ack);
			//console.log("created!", ack.pub);
			if(ack.err){
				console.log(ack.err);
				return;
			}
			if(ack.pub){
				console.log("Login Pass! Pub:", ack.pub);
				view_auth();
			}
		});
	}

	function createalias(_alias,_passphrase){
		user.create(_alias,_passphrase,(ack)=>{
			//console.log(ack);
			//console.log("created!", ack.pub);
			if(ack.err){
				console.log(ack.err);
				return;
			}
			if(ack.pub){
				console.log("Created! pub", ack.pub);
			}
		});
	}

	//init render!
	//view_login();
	//https://stackoverflow.com/questions/49519571/gun-v0-9-92-using-sea-cant-put-nested-data-when-not-logged-in
	window.onload = function() {
		view_login();
	};

})();
