// client-side js
localStorage.clear(); //clear database for gun

import '../scss/main.scss';
import moment from 'moment';
//import _ from 'lodash';
import _ from 'lodash/core';
import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/controlgroup.css';
import 'jquery-ui/themes/base/menu.css';
import 'jquery-ui/themes/base/button.css';
//import 'jquery-ui/themes/base/selectable.css';
import 'jquery-ui/themes/base/dialog.css';
import 'jquery-ui/themes/base/button.css';
import 'jquery-ui/ui/core';
//import 'jquery-ui/ui/widget';
//import 'jquery-ui/ui/data';
//import 'jquery-ui/ui/effect';
import 'jquery-ui/ui/effects/effect-drop';
//import 'jquery-ui/ui/widgets/selectable';
import 'jquery-ui/ui/widgets/dialog';

//gun.js
//import Gun from 'gun';
import Gun from 'gun/gun';
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
	$('#displaymessage').text('Connect to peer!');
	runEffect();
});
gun.on('bye', (peer)=>{// peer disconnect
	//console.log('disconnected from', peer);
	console.log('Disconnected from peer!');
	//$('#displaymessage').text('Disconnected from peer!');
	//runEffect();
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

	//#region html view dialog 
	var html_dialog_aliaskey = `
	<div id="dialog-pub" title="Alias Public Key:">
	<p> Public Key: <input id="aliaspubkey">  </p>
	</div>
	`;

	var html_dialog_alias = `
	<div id="dialog-alias" title="Access Confirm!">
	<p> Grant Access to <label id="whoalias">Null</label> </p>
	</div>
	`;
	
	var html_message = `
	<div id="togglemessage" class="toggler">
		<div id="effect" class="ui-widget-content">
	  		<h3 class="ui-widget-header">Message:</h3>
	  		<p id="displaymessage">
				Message none.
	  		</p>
		</div>
	</div>
	`;
	//#endregion
	
	//#region html view default 
	//<button id="buttoneffect">Effect</button>
	$('#app').empty().append( html_dialog_alias + html_dialog_aliaskey +`
	<div id="main" style="position:absolute;top:0px;left:0px;">
		<span>Themes: </span>
		<button id="light">Light</button>
		<button id="dark">Dark</button>
		<button id="checkuserdata">Is User Session?</button>
		<button id="gunconnect">Connect</button>
		<button id="gundisconnect">Disconnect</button>
		
		<br>
		Alias: <span id="displayAlias"> Null </span>
		<button id="copypublickey">Copy Public Key</button><input id="dashpublickey" style="width:700px;" readonly>
		<br>
		<br>
		<div id="view"></div>
	</div>
	` + html_message);
	//#endregion

	function runEffect() {
		// get effect type from
		var selectedEffect = 'drop';
		// Most effect types need no options passed by default
		var options = {};
		// some effects have required parameters
		if ( selectedEffect === "scale" ) {
			options = { percent: 50 };
		} else if ( selectedEffect === "size" ) {
			options = { to: { width: 280, height: 185 } };
		}
		// Run the effect
		//$("#effect").css('zIndex','9999');
		//console.log($("#effect").css('position')); //static
		$("#effect").css('position','relative');
		//$("#effect").show(callback);
		$("#effect").show( selectedEffect, options, 500, callback );
		//$("#effect").show( selectedEffect);
	};
	//callback function to bring a hidden box back
    function callback() {
		//$(this).css('zIndex', '10');
		setTimeout(function() {
			$("#effect:visible").removeAttr( "style" ).fadeOut();
			//$("#toggler").css('z-index', -1);
			//$("#effect:visible").hide();
		}, 1000 );
	};

	$("#buttoneffect").on("click",()=>{
		runEffect();
	});
	$("#effect").hide();

	$("#dialog-pub").dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		autoOpen: false,
		buttons: {
			"Ok": async function() {
				$(this).dialog( "close" );
				let to = gun.user($('#aliaspubkey').val());
				let who = await to.get('alias').then();
				$('#whoalias').text(who);
				console.log('who',who);
				if(!who){
					$('#displaymessage').text('No Alias!');
					runEffect();
					return;
				}
				$("#dialog-alias").data('param_1',$("#dialog-pub").data('param_1')); //id name,born,education ,skills
				$("#dialog-alias").dialog("open");
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		}
	});

	$("#dialog-alias").dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		autoOpen: false,
		buttons: {
			"Ok": async function() {
				$(this).dialog( "close" );
				/*
				console.log($(this).data('tag'));
				//console.log($('#inputpubkey').val());
				let to = gun.user($('#inputpubkey').val());
				let who = await to.get('alias').then();
				//console.log('who',who);
				if(!who)
					return;
				*/
				console.log("Pass Grant!");
			},
			Cancel: function() {
				$(this).dialog("close");
				console.log("Cancel grant!");
			}
		}
	});
	//this does not work correct yet
	$('#gunconnect').click(()=>{
		//console.log('connect!?');
		let peers = gun.back('opt.peers');
		console.log(peers); //need to call else it will not connect for some reason
		let url = '';
		/*
		if(location.origin == 'http://localhost:3000'){
			url ='http://localhost:8080' + '/gun';
		}else{
			url = location.origin + '/gun';
		}
		*/
		for(let address in peers){
			//console.log(address);
			url = address;
			break;//first peer url break
		}
		//console.log(gun);
		if(peers[url] == null)return;
		if(url == '')return;

		if(peers[url].url == null){//if url is null and set url for connect
			console.log(peers[url]);
			peers[url].url = url;
			peers[url].wire.onopen();
			gun.get('a').put({a:'a'});
		}
	});

	$('#gundisconnect').click(()=>{
		let peers = gun.back('opt.peers');
		let url;
		if(location.origin == 'http://localhost:3000'){
			url ='http://localhost:8080' + '/gun';
		}else{
			url = location.origin + '/gun';
		}
		//console.log(peers);
		peers[url].wire.close();
		peers[url].url = null;
		clearTimeout(peers[url].defer);
	});

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

	//#region html contacts
	var html_contacts = `
	<select id="contacts">
		<option disabled selected> Select contact </option>
	</select>
	<button id="contactadd">Add</button>
	<button id="contactremove">Remove</button>
	`;
	//#endregion

	//#region html view Alias Profile 
	var html_aliasprofile = `
	<br><label>Profile Search:</label><input id="profilesearch" style="width:700px;"><label>Status:</label><label id="searchstatus">None</label>
	<br>` + html_contacts + `
	<table><tr><td>
		<label>Name:</label>
		</td><td>
			<input id="aname">
		</td></tr><tr><td>
			<label>Born:</label>
		</td><td>
			<input id="aborn">
		</td></tr><tr><td>
			<label>Education:</label>
		</td><td>
			<input id="aeducation">
		</td></tr><tr><td>
			<label>Skills:</label>
		</td><td>
			<input id="askills">
		</td></tr>
	</table>
	`;
	//#endregion
	
	//#region html view auth / main area
	var html_auth = `
	<button id="logout" style="float:right;">Logout</button>
	<button id="passwordhint">Password Hint</button>
	<button id="changepassword">Change Password</button>
	<button id="privatemessage">Private Message</button>
	<button id="chatroom">Chat Room</button>
	<button id="todolist">To Do List</button>
	<br><span id="alias">User Alias</span>
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
	` + html_aliasprofile;
	//#endregion

	//#region html view chat room
	var html_chatroom = `
	<button id="authback">Back</button>
	<div id="messages" style="height:200px;overflow:auto;"></div>
	<input id="enterchat">
	<button>Chat</button>
	`;
	//#endregion

	//#region html view To Do List
	var html_todolist = `
	<button id="authback">Back</button>
	<br>To Do List:
	<br><input id="inputtodolist"><button id="addtodolist">Add</button>
	<br><div style="height:200px;overflow:auto;">
		<ul id="todolist"></ul>
	</div>
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
	` + html_contacts + `
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
	<br><label>Old Password:</label> <input id="oldpassword">
	<br><label>New Password:</label> <input id="newpassword">
	<br><button id="changepassword">Change</button>
	`;
	//#endregion

	function view_login(){
		$('#view').empty().append(html_login);
		$('#login').click(()=>{
			//console.log('login...?');
			authalias($('#alias').val(),$('#passphrase').val());
		});
		$('#signup').click(()=>{
			//console.log('signup...?');
			createalias($('#alias').val(),$('#passphrase').val());
		});
		$('#forgot').click(()=>{
			console.log('forgot...?');
			view_forgot()
		});
	}

	function view_forgot(){
		$('#view').empty().append(html_forgot);
		
		$('#backlogin').click(()=>{
			console.log('backlogin...?');
			view_login();
		});

		$('#gethint').click(()=>{
			getforgotpasswordhint();
		});
	}

	async function view_changepassword(){
		$('#view').empty().append(html_changepasword);
		$('#authback').click(()=>{
			view_auth();
		});
		$('#changepassword').click(()=>{
			changeforgotpassword();
		});
	}

	async function view_passwordhint(){
		$('#view').empty().append(html_passwordhint);
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
		$('#view').empty().append(html_privatemessage);
		$('#authback').click(()=>{
			view_auth();
		});
		$('#pub').on('keyup', checkuserid);
		$('#send').click(()=>{
			//console.log("apply");
			privatemessage($('#pub').val(),$('#message').val());
		});

		UpdateContactList();
		//https://stackoverflow.com/questions/2888446/get-the-selected-option-id-with-jquery
		$('#contacts').on('change',function(){
			//var id = $(this).children(":selected").attr("id");
			var id = $(this).find('option:selected').attr('id');
			//console.log(id);
			//user.get('contact').get(id).then();
			setpubkeyinput(id,'pub');
		});

		$('#contactadd').on('click', addcontact);
		$('#contactremove').on('click', removecontact);
	}

	async function view_auth(){
		$('#view').empty().append(html_auth);
		$('#alias').text('Alias: '+user.is.alias);
		$('#publickey').val(user.is.pub);
		$('#displayAlias').text('Alias: '+user.is.alias);
		$('#dashpublickey').val(user.is.pub);
		$('#logout').click(()=>{
			user.leave();
			view_login();
		});

		profilesetdata('name');
		profilesetdata('born');
		profilesetdata('education');
		profilesetdata('skills');

		profilegrantdata('name');
		profilegrantdata('born');
		profilegrantdata('education');
		profilegrantdata('skills');

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

		$('#profilesearch').on('keyup', searchuserid);

		UpdateContactList();
		//https://stackoverflow.com/questions/2888446/get-the-selected-option-id-with-jquery
		$('#contacts').on('change',function(){
			//var id = $(this).children(":selected").attr("id");
			var id = $(this).find('option:selected').attr('id');
			//console.log(id);
			//user.get('contact').get(id).then();
			setpubkeyinput(id,'profilesearch');
		});

		$('#contactremove').on('click', removecontact);
		$('#contactadd').on('click', addcontact);

		$('#chatroom').on('click', ()=>{
			view_chatroom();
		});

		$('#todolist').on('click', ()=>{
			view_todolist();
		});
	}

	//Chat Room
	function view_chatroom(){
		let chatroom = gun.get('chatroom');
		$('#view').empty().append(html_chatroom);

		//back to auth main
		$('#authback').click(()=>{
			chatroom.off();
			view_auth();
		});

		chatroom.time((data, key, time)=>{
			//console.log('time');
			//console.log(data);
			//console.log(key);
			//console.log('gun #key');
			gun.get(data['#']).once((d,id)=>{
				//console.log(id);
				//console.log(d);
				//check if id div html element exist
				var div = $('#' + id).get(0) || $('<div>').attr('id', id).appendTo('#messages');
				if(d){
					if((d == null)||(d == 'null')){
						$(div).hide();	
					}
					$(div).empty();
					//time = moment.unix(time/1000).format('dddd, MMMM Do, YYYY h:mm:ss A')
					time = moment.unix(time/1000).format('h:mm:ss A')
					$('<span>').append('[' + time + '] ').appendTo(div);
					$('<span>').append('Alias:'+ d.alias  + ' > ').appendTo(div);
					$('<span>').text(d.message).appendTo(div);

					$("#messages").scrollTop($("#messages")[0].scrollHeight);
				}else{
					$(div).hide();
				}
			});

		}, 20);//limit list

		$('#enterchat').on("keyup",function(e){
			//do stuff here
			e = e || window.event;
			//console.log("test?");
			if (e.keyCode == 13) {
				//console.log($(this).val());
				let text = ($(this).val() || '').trim();
				if(!text)
					return;
				//console.log("enter?");
				//chatroom.set({alias:user.is.alias,message:text});
				chatroom.time({alias:user.is.alias,message:text});
				//chatroom.time(text);
				return false;
			}
			return true;
		 });
	}

	//To Do List
	function view_todolist(){
		$('#view').empty().append(html_todolist);

		$('#authback').click(()=>{
			user.get('todolist').off();
			view_auth();
		});

		console.log("todolist?? get???");

		$('#todolist').empty();

		user.get('todolist').map().on((data,id)=>{
			let li;
			console.log(id);
			if($("#" + id).length == 0) {
				li = $('<li>').attr('id', id).appendTo('#todolist');
			}else{
				li = $("#" + id);
			}
				//li = $('#' + id).get(0);
			//}else{
				//li = $('<li>').attr('id', id).appendTo('#todolist');
			//}
			//li = $('#' + id).get(0) || $('<li>').attr('id', id).appendTo('#todolist');
			//todolist id
			console.log("test??");
			if(li){
				if((data == null)||(data == 'null')){
					$(li).hide();	
				}
				$(li).empty();
				//console.log(data.done);
				let bdone = false;
				if(data.done == 'true'){bdone = true;}
				$('<input type="checkbox" onclick="todolistCheck(this)" ' + (bdone ? 'checked' : '') + '>').appendTo(li);
				$('<span onclick="todolistTitle(this)">').text(data.text).appendTo(li);
				$('<button onclick="removeToDoList(this);">').html('x').appendTo(li);
			}else{
				$(li).hide();	
			}
		});

		$('#inputtodolist').on("keyup",function(e){
			//do stuff here
			e = e || window.event;
			//console.log(e.keyCode);
			if (e.keyCode == 13) {
				addToDoList();
				return false;
			}
			return true;
		});
		$('#addtodolist').click(addToDoList);
	}

	function todolistTitle(element){
		console.log("input init?");
		element = $(element)
		if (!element.find('input').get(0)) {
			element.html('<input value="' + element.html() + '" onkeyup="keypressToDoListTitle(this)">')
		}
	}

	function keypressToDoListTitle(element) {
		if (event.keyCode === 13) {
			console.log("enter?");
			user.get('todolist').get($(element).parent().parent().attr('id')).put({text: $(element).val()});
			//get input value
			let val = $(element).val();
			element = $(element);
			//get parent and clear span element child and add text
			element.parent().empty().text(val);
		}
	}

	function addToDoList(){
		let text = ($('#inputtodolist').val() || '').trim();
		console.log('add?',text);
		user.get('todolist').set({text:text,done:'false'},ack=>{
			console.log('todolist:',ack);
		});
	}

	function removeToDoList(element){
		let id = $(element).parent().attr('id');
		//console.log(id);
		//user.get('todolist').get(id).put(null);
		user.get('todolist').get(id).put('null',ack=>{
			//console.log(ack);
			if(ack.ok){//hide li
				$(element).parent().hide();
			}
		});
	}

	function todolistCheck (element) {
		//console.log($(element).prop('checked'));
		let strbool = $(element).prop('checked');
		strbool = strbool.toString();
		//console.log(strbool);
		user.get('todolist').get($(element).parent().attr('id')).put({done:strbool})
	}
	window.todolistTitle = todolistTitle;
	window.keypressToDoListTitle = keypressToDoListTitle;
	window.removeToDoList = removeToDoList;
	window.todolistCheck = todolistCheck;

	async function setpubkeyinput(id,_name){
		let who = await user.get('contact').get(id).then() || {};
		//who.pub
		$('#'+_name).val(who.pub);
	}

	async function addcontact(){
		console.log("add contact...");
		let pub = ($('#profilesearch').val() || '').trim();
		//console.log(pub);
		let to = gun.user(pub);
		let who = await to.then() || {};
		if(!who.alias){
			return;
		}
		let bfound = await user.get('contact').get(who.alias).then();
		console.log(bfound);
		if((!bfound)||(bfound == 'null')){
			user.get('contact').get(who.alias).put({name:who.alias,pub:who.pub});
		}
	}

	async function removecontact(){
		console.log("remove");
		let pub = ($('#profilesearch').val() || '').trim();
		let to = gun.user(pub);
		let who = await to.then() || {};
		if(!who.alias){
			return;
		}
		//user.get('contact').get(who.alias).put('null');//fail sea.js check null?
		user.get('contact').get(who.alias).put('null');
	}

	function UpdateContactList(){
		//user.get('contact').once().map().once((data,id)=>{
		user.get('contact').once().map().once((data,id)=>{
			console.log(data);
			if(!data.name)
				return;
			var option = $('#' + id).get(0) || $('<option>').attr('id', id).appendTo('#contacts');
			if(data){
				if(data == 'null'){
					$(option).hide();	
				}
				$(option).text(data.name);
			} else {
				$(option).hide();
			}
		});
	}

	async function profilegrantdata(_name){
		$('#g'+_name).click(()=>{
			$("#dialog-pub").data('param_1',_name).dialog("open");
		});
	}

	async function profilesetdata(_name){
		let data= await user.get('profile').get(_name).then();;
		$('#'+_name).val(data);
		$('#'+_name).on('keyup', function(e){
			if(!user.is){ return }
			user.get('profile').get(_name).put($('#'+_name).val());
		});
	}

	function changeforgotpassword(){
		var old = $('#oldpassword').val();
		var pass = $('#newpassword').val() || '';

		user.auth(user.is.alias, old, (ack) => {
			//console.log(ack);
			let status = ack.err || "Saved!";
			$('#displaymessage').text(status);
			runEffect();
			//console.log(status);
		}, {change: pass});
	}

	async function applyforgotpasswordhint(){
		user = gun.user();
		//console.log($('#q1').val());console.log($('#q2').val());console.log($('#hint').val());
		let q1 = $('#q1').val();
		let q2 = $('#q2').val();
		let hint = $('#hint').val();
		let sec = await Gun.SEA.secret(user.pair().epub, user.pair());
		let enc_q1 = await Gun.SEA.encrypt(q1, sec);
		user.get('forgot').get('q1').put(enc_q1);
		let enc_q2 = await Gun.SEA.encrypt(q2, sec);
		user.get('forgot').get('q2').put(enc_q2);
		sec = await Gun.SEA.work(q1,q2);
		//console.log(sec);
		let enc = await Gun.SEA.encrypt(hint, sec);
		//console.log(enc);
		user.get('hint').put(enc);
		$('#displaymessage').text('Hint Apply!');
		runEffect();
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
		user.auth(_alias,_passphrase,(ack)=>{
			//console.log(ack);
			//console.log("created!", ack.pub);
			if(ack.err){
				//console.log(ack.err);
				$('#displaymessage').text(ack.err);
				runEffect();
				return;
			}
			if(ack.pub){
				//console.log("Login Pass! Pub:", ack.pub);
				$('#displaymessage').text('Login Auth!');
				runEffect();
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
				$('#displaymessage').text(ack.err);
				runEffect();
				return;
			}
			if(ack.pub){
				console.log("Created! pub", ack.pub);
				$('#displaymessage').text(ack.pub);
				runEffect();
			}
		});
	}
	//search alias profile information
	async function searchuserid(e){
		if(!user.is){ return }
		let pub = $('#profilesearch').val();
		let to = gun.user(pub);
		let who = await to.then() || {};
		$('#searchstatus').text('Status: checking...');
		if(!who.alias){
			$('#searchstatus').text('Status: No Alias!');
			//console.log('none');
			return;
		}else{
			$('#searchstatus').text('Status: Found Alias ' + who.alias + '!' );
			//console.log('found!');
		}
		//console.log(who);
		let data_name = await to.get('profile').get('name').then();
		$('#aname').val(data_name);
		let data_born = await to.get('profile').get('born').then();
		$('#aborn').val(data_born);
		let data_edu = await to.get('profile').get('education').then();
		$('#aeducation').val(data_edu);
		let data_skills = await to.get('profile').get('skills').then();
		$('#askills').val(data_skills);
	}

	//check Alias, clear message and add messages
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
		//console.log(who);
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

	// Display Private Message
	async function UI(say, id, dec){
		say = await Gun.SEA.decrypt(say,dec);
		//console.log(say);
		//this.messages.push({id:id,message:say});
		var li = $('#' + id).get(0) || $('<li>').attr('id', id).appendTo('ul');
		if(say){
			if(say == 'null'){
				$(li).hide();	
			}
			//$(li).text(say + '<button>x</button>');
			let html = '<span onclick="clickTitle(this)" style="width:300px;">' + say + '</span>';
			html = '<input type="checkbox" onclick="clickCheck(this)" ' + (say.done ? 'checked' : '') + '>' + html
			html += '<button onclick="clickDelete(this)">x</button>'
			$(li).empty().append(html);
		} else {
			$(li).hide();
		}
	}
	//span click to change span to input
	function clickTitle(element){
		console.log("input init?");
		element = $(element)
		if (!element.find('input').get(0)) {
			element.html('<input value="' + element.html() + '" onkeyup="keypressTitle(this)">')
		}
	}
	//input press enter to change to input to span
	function keypressTitle(element) {
		if (event.keyCode === 13) {
			//todos.get($(element).parent().parent().attr('id')).put({title: $(element).val()});
			//get input value
			let val = $(element).val();
			element = $(element);
			//get parent and clear span element child and add text
			element.parent().empty().text(val);
		}
	}

	function clickCheck(element) {
		//todos.get($(element).parent().attr('id')).put({done: $(element).prop('checked')})
	}

	//delete message check from User and other Alias
	function clickDelete(element) {
		let id = $(element).parent().attr('id');
		console.log(id);
		let pub = $('#pub').val();
		let to = gun.user(pub);
		// current user
		user.get('message').get(pub).get(id).once((data)=>{
			console.log(data);
			//console.log(id);
			if(data!=null){
				user.get('message').get(pub).get(id).put('null',ack=>{
					if(ack.err){
						return;
					}
					$(element).parent().hide();
				});
				console.log("found!?");
			}
		});
		// from Alias
		to.get('message').get(user.pair().pub).get(id).once((data)=>{
			//console.log("to chat");
			if(data!=null){
				//not working to delete
				//to.get('message').get(user.pair().pub).get(id).put(null,ack=>{ 
				to.get('message').get(user.pair().pub).get(id).put('null', ack=>{
					console.log(ack);
					if(ack.err){
						return;
					}
					$(element).parent().hide();
				});
				console.log("other >> found!?");
			}
		});
		console.log('delete message?');
		//todos.get($(element).parent().attr('id')).put(null)
	}
	//add to window object since this is self contain sandbox?
	window.clickTitle = clickTitle;
	window.keypressTitle = keypressTitle;
	window.clickCheck = clickCheck;
	window.clickDelete = clickDelete;

	// Private Message
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
		$("#loading").empty();//empty element html when finish loading javascript...
	//};
//})();