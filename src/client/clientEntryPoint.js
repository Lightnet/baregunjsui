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

//(function(){
	//'use strict';
	//console.log('hello world :o');
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
var user = gun.user();
//console.log(user.pair());
//user.recall({sessionStorage: true});
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
//===============================================
// SEA.js
//===============================================
	//#region html view default 
	$('#app').html(`
	<span>Themes: </span>
	<button id="light">Light</button>
	<button id="dark">Dark</button>
	<button id="checkuserdata">Is User Session?</button>
	<br>
	<span id="displayAlias"> Alias:Null </span>
	<button id="copypublickey">Copy Public Key</button><input id="dashpublickey" style="width:700px;" readonly>
	<br>
	<br>
	<div id="view"></div>
	`);
	//#endregion

	$('#light').click(()=>{
		document.querySelector('body').classList.remove("dark");
		document.querySelector('body').classList.add("light");
	});

	$('#dark').click(()=>{
		document.querySelector('body').classList.remove("light");
		document.querySelector('body').classList.add("dark");
	});

	$('#copypublickey').click(()=>{
		$('#dashpublickey').select();
		document.execCommand("copy");
	});

	$('#checkuserdata').click(()=>{
		//console.log(user);
		//console.log(user.is);
		if(user.is){
			//console.log("auth?");
			view_auth();
			//console.log(user.pair());
		}
	});

	//#region html view login
	var html_login = `
	<table><tr><td>
			<span>Alias</span>
		</td><td>
			<input id="alias" value="test">
		</td></tr><tr><td>
			<span>Passphrase</span>
		</td><td>
			<input id="passphrase" value="test">
		</td></tr><tr><td colspan="2">
			<center>
			<button id="login">Login</button>
			<button id="signup">Sign up</button>
			<button id="forgot">Forgot Password</button>
			</center>
		</td></tr>
	</table>
	`;
	//#endregion

	//#region html view forgot password
	var html_forgot = `
	<table><tr><td>
			<span>Alias</span>
		</td><td>
			<input id="alias" value="">
		</td></tr><tr><td>
			<span>Q1</span>
		</td><td>
			<input id="q1" value="">
		</td></tr><tr><td>
			<span>Q1</span>
		</td><td>
			<input id="q2" value="">
		</td></tr><tr><td>
			<span>Hint</span>
		</td><td>
			<input id="hint">
		</td></tr><tr><td colspan="2">
		<center>
			<button id="backlogin">Back</button>
			<button id="gethint">Get Hint</button>
		</center>
		</td></tr>
	</table>
	`;
	//#endregion

	//#region html view auth
	var html_auth = `
	<button id="logout">Logout</button>
	<button id="passwordhint">Password Hint</button>
	<button id="changepassword">Change Password</button>
	<button id="privatemessage">Private Message</button>
	<br><span id="alias"> User Alias</span>
	<br><span>Public Key: <input id="publickey" style="width:700px;" readonly> </span>
	<button id="copykey">Copy Key</button>
	<br>
	<table><tr><td>
		<label>Name:</label>
		</td><td>
			<input id="name">
		</td><td>
			<button id="gname">+</button>
		</td></tr><tr><td>
			<label>Born:</label>
		</td><td>
			<input id="born">
		</td><td>
			<button id="gborn">+</button>
		</td></tr><tr><td>
			<label>Education:</label>
		</td><td>
			<input id="education">
		</td><td>
			<button id="geducation">+</button>
		</td></tr><tr><td>
			<label>Skills:</label>
		</td><td>
			<input id="skills">
		</td><td>
			<button id="gskills">+</button>
		</td></tr>
	</table>
	`;
	//#endregion

	//#region html view password hint
	var html_passwordhint = `
	<button id="authback">Back</button>
	<table></tr><tr><td>
			<span>Q1:</span>
		</td><td>
			<input id="q1" value="">
		</td></tr><tr><td>
			<span>Q2:</span>
		</td><td>
			<input id="q2" value="">
		</td></tr><tr><td>
			<span>Hint:</span>
		</td><td>
			<input id="hint" value="">
		</td></tr><tr><td colspan="2">
			<button id="setpasswordhint">Apply</button>
		</td></tr>
	</table>
	`;
	//#endregion

	//#region html view private message 
	var html_privatemessage = `
	<button id="authback">Back</button>
	<br>
	<br><label>Alias Public Key:</label><input id="pub"><label id="publickeystatus">Status: None</label>
	<br><label>Private Message:</label><input id="message">
	<br><label>Action:</label><button id="send">Send</button>
	<br>Messages:
	<div>
	<ul id="messages"></ul>
	</div>
	`;
	//#endregion

	//#region html view change password
	var html_changepasword = `
	<button id="authback">Back</button>
	<br>
	<br><label>Old Password:</label> <input id="oldpassword">
	<br><label>New Password:</label> <input id="newpassword">
	<br><button id="changepassword">Change</button>

	`
	//#endregion

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

		$('#gethint').click(()=>{
			getforgotpasswordhint();
		});
	}

	async function view_changepassword(){
		$('#view').html(html_changepasword);
		$('#authback').click(()=>{
			view_auth();
		});
		$('#changepassword').click(()=>{
			changeforgotpassword();
		});
	}

	async function view_passwordhint(){
		$('#view').html(html_passwordhint);
		$('#authback').click(()=>{
			view_auth();
		});
		let epub = user.pair().epub;

		let q1 = await user.get('forgot').get('q1').then();
		let dec = await Gun.SEA.secret(epub, user.pair());
		q1 = await Gun.SEA.decrypt(q1,dec);
		$('#q1').val(q1);
		let q2 = await user.get('forgot').get('q2').then();
		q2 = await Gun.SEA.decrypt(q2,dec);
		$('#q2').val(q2);
		let hint = await user.get('hint').then();
		dec = await Gun.SEA.work(q1,q2);
		hint = await Gun.SEA.decrypt(hint,dec);
		$('#hint').val(hint);

		$('#setpasswordhint').click(()=>{
			applyforgotpasswordhint();
		});
	}

	async function view_privatemessage(){
		$('#view').html(html_privatemessage);
		$('#authback').click(()=>{
			view_auth();
		});

		$('#pub').on('keyup', checkuserid);

		$('#send').click(()=>{
			//console.log("apply");
			privatemessage($('#pub').val(),$('#message').val());
		});
	}

	async function view_auth(){
		$('#view').html(html_auth);
		$('#alias').text('Alias: '+user.is.alias);
		$('#publickey').val(user.is.pub);
		$('#displayAlias').text('Alias: '+user.is.alias);
		$('#dashpublickey').val(user.is.pub);
		$('#logout').click(()=>{
			user.leave();
			view_login();
		});

		let name = await user.get('profile').get('name').then();;
		$('#name').val(name);
		$('#name').on('keyup', function(e){
			if(!user.is){ return }
			user.get('profile').get('name').put($('#name').val());
		});

		//$('#gname').click(grantid);
		$('#gname').click(async (e)=>{
			e.preventDefault();
			var pub = prompt("What is the Public Key or DID you want to give read access to?");
			var to = gun.user(pub);
			var who = await to.get('alias').then();
			if(!confirm("You want to give access to " + who + "?")){ return }
			user.get('profile').get('name').grant(to);
		});

		$('#gborn').click(()=>{
			console.log('gborn');
		});

		$('#geducation').click(()=>{
			console.log('geducation');
		});

		$('#gskills').click(()=>{
			console.log('gskills');
		});

		$('#passwordhint').click(()=>{
			view_passwordhint();
		});

		$('#privatemessage').click(()=>{
			view_privatemessage();
		});

		$('#copykey').click(()=>{
			$('#publickey').select();
			document.execCommand("copy");
		});
		$('#changepassword').click((e)=>{
			view_changepassword();
		})
	}

	function changeforgotpassword(){
		var old = $('#oldpassword').val();
		var pass = $('#newpassword').val() || '';

		user.auth(user.is.alias, old, (ack) => {
			//console.log(ack);
			let status = ack.err || "Saved!";
			console.log(status);
		}, {change: pass});
	}

	async function applyforgotpasswordhint(){
		user = gun.user();
		console.log($('#q1').val());
		console.log($('#q2').val());
		console.log($('#hint').val());

		let q1 = $('#q1').val();
		let q2 = $('#q2').val();
		let hint = $('#hint').val();

		let sec = await Gun.SEA.secret(user.pair().epub, user.pair());
		let enc_q1 = await Gun.SEA.encrypt(q1, sec);
		user.get('forgot').get('q1').put(enc_q1);
		let enc_q2 = await Gun.SEA.encrypt(q2, sec);
		user.get('forgot').get('q2').put(enc_q2);
		//user.get('forgot').get('q2').put(enc);
		//user.get('settings').get('q1').then();
		//let pair = user.pair().epub;
		//console.log(pair);
		//console.log(user.pair());
		//let pair = user.pair();
		//console.log(pair);
		sec = await Gun.SEA.work(q1,q2);
		console.log(sec);
		let enc = await Gun.SEA.encrypt(hint, sec);
		console.log(enc);
		user.get('hint').put(enc);
		//let dec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
		//say = await Gun.SEA.decrypt(say,dec);
	}

	async function getforgotpasswordhint(){
		let alias = ($('#alias').val() || '').trim();
		let q1 =  ($('#q1').val() || '').trim();
		let q2 = ($('#q2').val() || '').trim();
		console.log('get forgot hint');
		if(!alias){
			console.log('Empty!');
			return;
		}
		if((!q1)||(!q2))
			return;
		console.log(alias);
		let who = await gun.get('alias/'+alias).then() || {};
		console.log(who);

		if(!who._){
			//console.log(who);
			//console.log('Not Alias!');
			return;
		}
		let hint = await gun.get('alias/'+alias).map().get('hint').then();
		let dec = await Gun.SEA.work(q1,q2);
		hint = await Gun.SEA.decrypt(hint,dec);
		if(hint){
			$('#hint').val(hint);
		}else{
			$('#hint').val('Fail Decrypt!');
		}
		//console.log(hint);
	}

	function authalias(_alias,_passphrase){
		//console.log(user.is);
		//if(user.is){
			//console.log("user leave...");
			//gun.user().leave();
		//}
		user.auth(_alias,_passphrase,(ack)=>{
			//console.log(ack);
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

	async function checkuserid(e){
		if(!user.is){ return }
		$('#messages').empty();
		//console.log('test');

		let pub = $('#pub').val();
		let to = gun.user(pub);
		let who = await to.then() || {};
		//$('publickeystatus').val();
		$('#publickeystatus').text('Status: checking...');
		if(!who.alias){
			$('#publickeystatus').text('Status: No Alias!');
			//console.log('none');
			return;
		}else{
			$('#publickeystatus').text('Status: Found Alias ' + who.alias + '!' );
			//console.log('found!');
		}
		//$('#messages').remove();
		$('#messages').empty();
		console.log(who);
		let dec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
		user.get('message').get(pub).map().once((say,id)=>{
			//console.log("user chat");
			UI(say,id,dec);
		});

		to.get('message').get(user.pair().pub).map().once((say,id)=>{
			//console.log("to chat");
			UI(say,id,dec);
		});
	}

	async function UI(say, id, dec){
		say = await Gun.SEA.decrypt(say,dec);
		//console.log(say);
		//this.messages.push({id:id,message:say});
		var li = $('#' + id).get(0) || $('<li>').attr('id', id).appendTo('ul');
		if(say){
			$(li).text(say);
		} else {
			$(li).hide();
		}
	}

	async function privatemessage(_pubkey,_message){
		if(!user.is){ return }

		let pub = (_pubkey || '').trim();
		let message = (_message || '').trim();
		if(!message) return;
		if(!pub) return;

		let to = gun.user(pub);
		let who = await to.then() || {};
		//console.log(who);
		if(!who.alias){
			console.log("No Alias!");
			return;
		}
		console.log(who);
		var sec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
		var enc = await Gun.SEA.encrypt(message, sec);
		user.get('message').get(pub).set(enc);
	}

	//init render!
	//view_login();
	//https://stackoverflow.com/questions/49519571/gun-v0-9-92-using-sea-cant-put-nested-data-when-not-logged-in
	//window.onload = function() {
		//let user = gun.user();
		if(!user.is){
			view_login();
			//console.log("login?");
		}else{
			view_auth();
			//console.log("auth?");
		}
	//};

//})();


