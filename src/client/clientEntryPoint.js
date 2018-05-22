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
//import Gun from 'gun';//node
import Gun from 'gun/gun';//browser
import 'gun/sea';
//custom chain gun.js
import 'gun/nts';
import 'gun/lib/time';
import 'gun/lib/path';
//import 'gun/lib/load';
//import 'gun/lib/open';
import 'gun/lib/then';
//import 'gun/lib/unset';

function init(){
	//console.log(SEA);
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
//console.log(gun);
gun.on('hi', peer => {//peer connect
	//console.log('connect peer to',peer);
	console.log('peer connect!');
	displayeffectmessage('Connect to peer!');
});
gun.on('bye', (peer)=>{// peer disconnect
	//console.log('disconnected from', peer);
	console.log('Disconnected from peer!');
	//displayeffectmessage('Disconnected from peer!');
});
//gun.get('data').once(()=>{console.log("connect!");});
//gun.get('data').put({text:'text'});
//===============================================
// SEA.js
//===============================================

	//#region html view dialog 
	var html_dialog_aliaskey = `
	<div id="dialog-pub" title="Alias Public Key:">
	<p> Public Key: <input id="aliaspubkey">  </p>
	</div>
	`;
	//dialog grant alias acces
	var html_dialog_alias = `
	<div id="dialog-alias" title="Access Confirm!">
	<p> Grant Access to <label id="whoalias">Null</label> </p>
	</div>
	`;
	//display message effect
	var html_message = `
	<div id="togglemessage" class="toggler">
		<center>
		<div id="effect" class="ui-widget-content">
	  		<h3 class="ui-widget-header">Message:</h3>
	  		<p id="displaymessage">
				Message none.
	  		</p>
		</div>
		</center>
	</div>
	`;
	//#endregion
	
	//#region html view default 
	//<button id="buttoneffect">Effect</button>
	$('#app').empty().append( html_dialog_alias + html_dialog_aliaskey +`
	<div id="main">
		<div id="navtopbar" style="height:auto;">
			<span>Themes:</span>
			<button id="light">Light</button>
			<button id="dark">Dark</button>
			<button id="checkuserdata">Is User Session?</button>
			<button id="gunconnect">Connect</button>
			<button id="gundisconnect">Disconnect</button><button id="buttoneffect">Effect</button>
			<br><span id="displayAlias">null</span>
			<button id="copypublickey">Copy Public Key</button><input id="dashpublickey" style="width:700px;" readonly>
		</div>
		<div id="view"></div>
	</div>
	` + html_message);
	//#endregion
	//setup scroll from parent with child1 and child2 with contain
	function setupscrollparentc1c2(_parent,_child1,_child2){
		$("#"+_child2).css("height", ($('#'+_parent).height()-$("#"+_child1).height()));
		$( window ).resize(function() {
			//child2 > parent > child1
			$("#"+_child2).css("height", ($('#'+_parent).height()-$("#"+_child1).height()));
		});
	}
	//setup scroll for main area render
	setupscrollparentc1c2("main","navtopbar","view");
	//jquery effect drop down center
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
		options = {direction: "up"};//Blind effect's direction option now supports up, down, left, and right
		// Run the effect
		//console.log($("#effect").css('position')); //static
		$("#effect").css('position','relative');
		$("#effect").show( selectedEffect, options, 500, callbackeffect );
	};
	//callback function to bring a hidden box back
    function callbackeffect() {
		setTimeout(function() {
			$("#effect:visible").removeAttr( "style" ).fadeOut();
		}, 1000 );
	};
	$("#buttoneffect").on("click",()=>{//display message effect
		runEffect();
	});
	$("#effect").hide();
	//call effect with message text
	function displayeffectmessage(_msg){
		$('#displaymessage').text(_msg);
		runEffect();
	}
	//simple confirm dialog for search alias check key
	$("#dialog-pub").dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		autoOpen: false,
		buttons: {
			"Ok": async function() {
				$(this).dialog( "close" );
				let to = gun.user($('#aliaspubkey').val());//get alias public key input value
				let who = await to.get('alias').then();
				$('#whoalias').text(who);
				//console.log('who',who);
				if(!who){
					displayeffectmessage('No Alias!');
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
	// grant access to alias to user info
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
				//console.log("Pass Grant!");
			},
			Cancel: function() {
				$(this).dialog("close");
				//console.log("Cancel grant!");
				displayeffectmessage("Cancel Grant Access!")
			}
		}
	});
	//this does not work correct yet
	$('#gunconnect').click(()=>{
		//console.log('connect!?');
		let peers = gun.back('opt.peers');//get current peers list
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
			//console.log(peers[url]);
			peers[url].url = url;
			peers[url].wire.onopen();
			gun.get('a').put({a:'a'});
		}
	});

	$('#gundisconnect').click(()=>{
		let peers = gun.back('opt.peers');//get current peers list
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
	//theme change to light or default setting
	$('#light').click(()=>{
		document.querySelector('body').classList.remove("dark");
		document.querySelector('body').classList.add("light");
	});
	//theme change to night theme
	$('#dark').click(()=>{
		document.querySelector('body').classList.remove("light");
		document.querySelector('body').classList.add("dark");
	});
	//simple user copy key
	$('#copypublickey').click(()=>{
		$('#dashpublickey').select();
		document.execCommand("copy");
	});
	//check if user is login if there session is active.
	$('#checkuserdata').click(()=>{
		//check if user exist
		if(user.is){
			view_auth();//go to main render for public access to current user sign in.
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
	<div id="chatroom_parent" style="height:100%;width:100%;">
		<div id="messages" style="height:100%;overflow:auto;">
		</div>
		<div id="chatbox" style="height:auto;">
			<input id="enterchat"><button id="sendchat">Chat</button><button id="authback">Back</button>
		</div>
	</div>
	`;
	//#endregion

	//#region html view To Do List
	var html_todolist = `
	<div id="todolist_parent" style="height:100%;width:100%;">
		<div id="todolist_child1">
			<button id="authback">Back</button>
			<br>To Do List:
			<br><input id="inputtodolist"><button id="addtodolist">Add</button>
		</div>
		<div id="todolist_child2" style="overflow:auto;">
			<ul id="todolist"></ul>
		</div>
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
	<div id="messsage_parent" style="height:100%;width:100%;">
		<div id="messsage_child1">
			<button id="authback">Back</button>
			` + html_contacts + `
			<br><label>Alias Public Key:</label><input id="pub"><label id="publickeystatus">Status: None</label>
			<br><label>Private Message:</label><input id="message">
			<br><label>Action:</label><button id="send">Send</button>
			<br>Messages:
		</div>
		<div id="messagelist">
			<ul id="messages"></ul>
		</div>
	<div>
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

	//display html and setup login page.
	function view_login(){
		$('#view').empty().append(html_login);//render html
		$('#login').click(()=>{//login action
			//console.log('login...?');
			authalias($('#alias').val(),$('#passphrase').val());//call and check for login
		});
		$('#signup').click(()=>{//sign up action
			//console.log('signup...?');
			createalias($('#alias').val(),$('#passphrase').val());//call and check exist and register user.
		});
		$('#forgot').click(()=>{//forgot action
			//console.log('forgot...?');
			view_forgot();//go to html render and setup
		});
	}
	//display html and setup fogot page.
	function view_forgot(){
		$('#view').empty().append(html_forgot);//render html
		
		$('#backlogin').click(()=>{//back to login page
			//console.log('backlogin...?');
			view_login();
		});

		$('#gethint').click(()=>{
			getforgotpasswordhint();//call check hint and check if correct
		});
	}
	//display html and setup change password page.
	async function view_changepassword(){
		$('#view').empty().append(html_changepasword);// render html
		$('#authback').click(()=>{
			view_auth();
		});
		$('#changepassword').click(()=>{
			changeforgotpassword();
		});
	}
	//display html and password hint setup page.
	async function view_passwordhint(){
		$('#view').empty().append(html_passwordhint);// render html
		$('#authback').click(()=>{//go back to home
			view_auth();
		});
		let epub = user.pair().epub;// private key
		let q1 = await user.get('forgot').get('q1').then(); //get question 1
		let dec = await Gun.SEA.secret(epub, user.pair()); // set secret key for decrypt
		q1 = await Gun.SEA.decrypt(q1,dec); //decrypt question string
		$('#q1').val(q1); //set input question 1
		let q2 = await user.get('forgot').get('q2').then(); //get question 2
		q2 = await Gun.SEA.decrypt(q2,dec); //decrypt question string
		$('#q2').val(q2); //set input question 2
		let hint = await user.get('hint').then(); //get hint hash string
		dec = await Gun.SEA.work(q1,q2); // decrypt hash key
		hint = await Gun.SEA.decrypt(hint,dec); //hash data to string
		$('#hint').val(hint); //set hint string input

		$('#setpasswordhint').click(()=>{
			applyforgotpasswordhint(); //apply and save data to user current profile.
		});
	}
	//display html and setup private message page.
	async function view_privatemessage(){
		$('#view').empty().append(html_privatemessage);//render html element
		setupscrollparentc1c2("messsage_parent","messsage_child1","messagelist");//setup scroll

		$('#authback').click(()=>{//back to main page
			view_auth();
		});
		$('#pub').on('keyup', checkuserid); //input key check pub alias
		$('#message').on('keyup',(e)=>{ //listen user input key up event
			e = e || window.event;
			if (e.keyCode == 13) {//enter key
				//console.log("message enter");
				let text = ($('#message').val() || '').trim();//get text input
				if(!text){//if string is empty, do not pass and return from begin.
					return true;	
				}
				privatemessage($('#pub').val(),$('#message').val());//alias public key, text message
				return false;
			}
			return true;
		});
		$('#send').click(()=>{
			//console.log("apply");
			privatemessage($('#pub').val(),$('#message').val());
		});
		//get contacts to up date the list
		UpdateContactList();
		//https://stackoverflow.com/questions/2888446/get-the-selected-option-id-with-jquery
		$('#contacts').on('change',function(){
			var id = $(this).find('option:selected').attr('id');
			//console.log(id);
			setpubkeyinput(id,'pub');
		});

		$('#contactadd').on('click', ()=>{addcontact('pub')});
		$('#contactremove').on('click',()=>{removecontact('pub')});
	}
	//display and setup auth page.
	async function view_auth(){
		$('#view').empty().append(html_auth);//render html element
		$('#alias').text('Alias: '+user.is.alias);//get current user name
		$('#publickey').val(user.is.pub);//get user public key
		$('#displayAlias').text('Alias: '+user.is.alias);//get current user name
		$('#dashpublickey').val(user.is.pub);//get user public key
		$('#logout').click(()=>{
			user.leave();
			view_login();
		});
		//get profile params and set input to value
		profilesetdata('name');
		profilesetdata('born');
		profilesetdata('education');
		profilesetdata('skills');
		//grant access to info. Not yet worked on.
		profilegrantdata('name');
		profilegrantdata('born');
		profilegrantdata('education');
		profilegrantdata('skills');

		$('#passwordhint').click(()=>{//button to password hint render element
			view_passwordhint();
		});
		$('#privatemessage').click(()=>{//button to private message render element
			view_privatemessage();
		});
		$('#copykey').click(()=>{ //copy public key
			$('#publickey').select();
			document.execCommand("copy");
		});
		$('#changepassword').click((e)=>{//button to change password render element
			view_changepassword();
		})

		$('#profilesearch').on('keyup', searchuserid);//input type look up alias public key search

		//update contact list 
		UpdateContactList();
		//https://stackoverflow.com/questions/2888446/get-the-selected-option-id-with-jquery
		$('#contacts').on('change',function(){//select event list view info.
			//var id = $(this).children(":selected").attr("id");
			var id = $(this).find('option:selected').attr('id');
			//console.log(id);
			setpubkeyinput(id,'profilesearch');
		});

		$('#contactremove').on('click', ()=>{removecontact('profilesearch')});
		$('#contactadd').on('click', ()=>{addcontact('profilesearch')});

		$('#chatroom').on('click', ()=>{//button to chat room render element
			view_chatroom();
		});

		$('#todolist').on('click', ()=>{//button to to do list render element
			view_todolist();
		});
	}

	//Display html and setup Chat Room element.
	function view_chatroom(){
		let chatroom = gun.get('chatroom');
		$('#view').empty().append(html_chatroom);//render html element 
		setupscrollparentc1c2("chatroom_parent","chatbox","messages");//setup scroll page
		//back to auth main
		$('#authback').click(()=>{//return back to hom
			chatroom.off();
			view_auth();
		});

		chatroom.time((data, key, time)=>{//listen subscribe for time graph
			//console.log('time');
			//console.log(data);
			//console.log(key);
			//console.log('gun #key');
			gun.get(data['#']).once((d,id)=>{
				//console.log(id);
				//console.log(d);
				//check if id div html element exist
				var div = $('#' + id).get(0) || $('<div>').attr('id', id).appendTo('#messages');//check for exist element else create element
				if(d){//check for element exist
					if((d == null)||(d == 'null')){//check for null if there edit or delete changes.
						$(div).hide();	
					}
					$(div).empty();//empty element
					//time = moment.unix(time/1000).format('dddd, MMMM Do, YYYY h:mm:ss A')
					time = moment.unix(time/1000).format('h:mm:ss A');//convert time to
					$('<span>').append('[' + time + '] ').appendTo(div);//add time
					$('<span>').append('Alias:'+ d.alias  + ' > ').appendTo(div);//add alias name
					$('<span>').text(d.message).appendTo(div);//add message
					$("#messages").scrollTop($("#messages")[0].scrollHeight);//scroll to bottom
				}else{
					$(div).hide();//hidden element
				}
			});

		}, 20);//limit list

		$('#enterchat').on("keyup",function(e){// keybaord event
			e = e || window.event;
			//console.log("test?");
			if (e.keyCode == 13) {//enter key
				//console.log($(this).val());
				let text = ($(this).val() || '').trim();//input text
				if(!text)//check for empty
					return;
				//console.log("enter?");
				chatroom.time({alias:user.is.alias,message:text});
				//chatroom.time(text);
				return false;
			}
			return true;
		});
		$('#sendchat').click(()=>{
			let text = ($('#enterchat').val() || '').trim();//input text
			if(!text)//check for empty
				return;
			chatroom.time({alias:user.is.alias,message:text});
		})
	}

	//Display html and setup To Do List page.
	function view_todolist(){
		$('#view').empty().append(html_todolist);//render element html
		//set scroll
		setupscrollparentc1c2("todolist_parent","todolist_child1","todolist_child2");
		$('#authback').click(()=>{//return main page
			user.get('todolist').off(); //does it turn off?
			view_auth();
		});
		$('#todolist').empty();//empty list
		user.get('todolist').map().on(async (data,id)=>{
			feedtodolist(data,id);//add list items
		});
		$('#inputtodolist').on("keyup",function(e){//keyboard event
			e = e || window.event;
			//console.log(e.keyCode);
			if (e.keyCode == 13) {//enter key
				addToDoList();//call and check to be added to list
				return false;
			}
			return true;
		});
		$('#addtodolist').click(addToDoList);//button check add to list
	}
	//check to do list item
	function feedtodolist(data,id){
		let li;//null variable
		//console.log(id);
		if(document.getElementById(id)){//check for id exist
			li = $('#' + id).get(0);//call li id
		}else{
			li = $('<li>').attr('id', id).appendTo('ul');//create new li
		}
		if(li){//check for exist
			if((data == null)||(data == 'null')){//check if data is empty
				$(li).hide();//hide list
			}
			$(li).empty();//empty groups element
			let bdone = false;//set for check input
			if(data.done == 'true'){bdone = true;}//check for true from gun.get() to boolean convert
			$('<input type="checkbox" onclick="todolistCheck(this)" ' + (bdone ? 'checked' : '') + '>').appendTo(li);//check box
			$('<span onclick="todolistTitle(this)">').text(data.text).appendTo(li);//set text and click for input change
			$('<button onclick="removeToDoList(this);">').html('x').appendTo(li);// button delete
			$("#todolist_child2").scrollTop($("#todolist_child2")[0].scrollHeight);//scroll to bottom
		}else{
			$(li).hide();//hide element
		}
	}

	function todolistTitle(element){
		//console.log("input init?");
		element = $(element)
		if (!element.find('input').get(0)) {//check if input !exist
			element.html('<input value="' + element.html() + '" onkeyup="keypressToDoListTitle(this)">');//change to input and setup key press
		}
	}

	function keypressToDoListTitle(element) {
		if (event.keyCode === 13) {//enter key
			//console.log("enter?");
			user.get('todolist').get($(element).parent().parent().attr('id')).put({text: $(element).val()});//update key and put text data
			//get input value
			let val = $(element).val();//get value
			element = $(element);//change to jquery for access functions
			//get parent and clear span element child and add text
			element.parent().empty().text(val);//empty and set text
		}
	}

	function addToDoList(){
		let text = ($('#inputtodolist').val() || '').trim(); //get input and clean up string
		//console.log('add?',text);
		user.get('todolist').set({text:text,done:'false'},ack=>{//add object id data to gun database
			//console.log('todolist:',ack);
			$('#inputtodolist').val('');//clear text string
		});
	}

	function removeToDoList(element){
		let id = $(element).parent().attr('id');//get id that is from gun.get(data,id)
		//user.get('todolist').get(id).put(null);
		user.get('todolist').get(id).put('null',ack=>{
			//console.log(ack);
			if(ack.ok){//hide li
				$(element).parent().hide();
			}
		});
	}

	function todolistCheck (element) {
		let strbool = $(element).prop('checked');
		strbool = strbool.toString();
		user.get('todolist').get($(element).parent().attr('id')).put({done:strbool})//update check boolean to string
	}
	window.todolistTitle = todolistTitle;//set window global to call outside
	window.keypressToDoListTitle = keypressToDoListTitle;
	window.removeToDoList = removeToDoList;
	window.todolistCheck = todolistCheck;

	async function setpubkeyinput(id,_name){
		let who = await user.get('contact').get(id).then() || {};//get alias object data
		//who.pub
		$('#'+_name).val(who.pub);//set input public key 
		if(_name == 'profilesearch'){
			searchuserid();//update when selected alias
		}else{
			checkuserid();//update when selected alias
		}
	}
	//add alias public key
	async function addcontact(_id){
		//console.log("add contact...");
		let pub = ($('#'+_id).val() || '').trim();//get public key and clean up space
		if(!pub) return;//if empty string
		//console.log(pub);
		let to = gun.user(pub);//get alias if exist
		let who = await to.then() || {};//get alias information
		if(!who.alias){//if not alias name exist do not run next line
			return;
		}
		let bfound = await user.get('contact').get(who.alias).then();//get alias name check exist
		//console.log(bfound);
		if((!bfound)||(bfound == 'null')){
			$('<option>').attr('id', who.alias).text(who.alias).appendTo('#contacts');//add html option select element
			user.get('contact').get(who.alias).put({name:who.alias,pub:who.pub});//add user data to contact list
		}
	}
	//remove alias contact
	async function removecontact(_id){
		//console.log("remove");
		let pub = ($('#'+_id).val() || '').trim(); // remove space 
		if(!pub) return;//check empty then do not run next line
		let to = gun.user(pub);//from alias public key get user data
		let who = await to.then() || {};//load user data
		if(!who.alias){//if alias do not exist do not run next line
			return;
		}
		$('#'+who.alias).remove();//remove alias name from select option list
		//user.get('contact').get(who.alias).put('null');//fail sea.js check null?
		user.get('contact').get(who.alias).put('null');//null contact list match id
	}
	//add contact list when call
	function UpdateContactList(){
		user.get('contact').once().map().once((data,id)=>{
			//console.log(data);
			if(!data.name)//check for name to exist
				return;
			var option = $('#' + id).get(0) || $('<option>').attr('id', id).appendTo('#contacts');//check if option id exist else create.
			if(data){
				if(data == 'null'){
					$(option).hide();//hide element
				}
				$(option).text(data.name);//set text
			} else {
				$(option).hide();//hide element
			}
		});
	}
	//grant access pub profile params
	async function profilegrantdata(_name){
		$('#g'+_name).click(()=>{//button click
			$("#dialog-pub").data('param_1',_name).dialog("open");//set param var and open dialog
		});
	}
	//setup get and set profile params
	async function profilesetdata(_name){
		let data = await user.get('profile').get(_name).then(); //get profile param variable
		$('#'+_name).val(data); //set profile param variable
		$('#'+_name).on('keyup', function(e){ //keyboard event input
			if(!user.is){ return } //check for user auth
			user.get('profile').get(_name).put($('#'+_name).val()); //from user data to update profile param variable
		});
	}
	//check change password call
	function changeforgotpassword(){
		var old = $('#oldpassword').val() || ''; //get old password input
		var pass = $('#newpassword').val() || '';//get new password input

		user.auth(user.is.alias, old, (ack) => {//user auth call
			//console.log(ack);
			let status = ack.err || "Saved!";//check if there error else saved message.
			displayeffectmessage(status);//dsiplay message effect
			//console.log(status);
		}, {change: pass});//set config to change password
	}
	//apply forgot password hint 
	async function applyforgotpasswordhint(){
		user = gun.user();
		//console.log($('#q1').val());console.log($('#q2').val());console.log($('#hint').val());
		let q1 = $('#q1').val();//get input q1
		let q2 = $('#q2').val();//get input q2
		let hint = $('#hint').val();//get input hint
		let sec = await Gun.SEA.secret(user.pair().epub, user.pair());//get user for encrypt message
		let enc_q1 = await Gun.SEA.encrypt(q1, sec);//encrypt q1
		user.get('forgot').get('q1').put(enc_q1);//set hash q1 to user data store
		let enc_q2 = await Gun.SEA.encrypt(q2, sec);//encrypt q1
		user.get('forgot').get('q2').put(enc_q2); //set hash q2 to user data store
		sec = await Gun.SEA.work(q1,q2);//encrypt key
		//console.log(sec);
		let enc = await Gun.SEA.encrypt(hint, sec);//encrypt hint
		//console.log(enc);
		user.get('hint').put(enc,ack=>{//set hash hint
			//console.log(ack);
			if(ack.ok){
				displayeffectmessage('Hint Apply!'); //display message effects
			}
		});
		
	}
	//check for q1,q2, hint and if correct get forgot password hint
	async function getforgotpasswordhint(){
		let alias = ($('#alias').val() || '').trim(); //get alias input
		let q1 =  ($('#q1').val() || '').trim(); //get q1 input
		let q2 = ($('#q2').val() || '').trim(); //get q2 input
		//console.log('get forgot hint');
		if(!alias){
			//console.log('Empty!');
			return;
		}
		if((!q1)||(!q2))
			return;
		//console.log(alias);
		let who = await gun.get('alias/'+alias).then() || {};//get alias data
		//console.log(who);
		if(!who._){
			//console.log(who);
			//console.log('Not Alias!');
			return;
		}
		let hint = await gun.get('alias/'+alias).map().get('hint').then();//get hash hint string
		let dec = await Gun.SEA.work(q1,q2);//get q1 and q2 string to key hash
		hint = await Gun.SEA.decrypt(hint,dec);//get hint and key decrypt message
		if(hint){//check if hint is string or null
			$('#hint').val(hint);//get hint and set input value
		}else{
			$('#hint').val('Fail Decrypt!');//if null set input to message user.
		}
		//console.log(hint);
	}
	//login user auth check
	function authalias(_alias,_passphrase){
		//console.log(user.is);
		user.auth(_alias,_passphrase,(ack)=>{
			//console.log(ack);
			//console.log("created!", ack.pub);
			if(ack.err){
				//console.log(ack.err);
				displayeffectmessage(ack.err);//display message if fail to login auth
				return;
			}
			if(ack.pub){
				//console.log("Login Pass! Pub:", ack.pub);
				displayeffectmessage('Login Auth!');//display message login auth 
				view_auth();//go to render auth html element
			}
		});
	}
	// create user account
	function createalias(_alias,_passphrase){
		user.create(_alias,_passphrase,(ack)=>{//sea.js user create account
			//console.log(ack);
			//console.log("created!", ack.pub);
			if(ack.err){
				//console.log(ack.err);
				displayeffectmessage(ack.err);//display message if exist or error
				return;
			}
			if(ack.pub){
				//console.log("Created! pub", ack.pub);
				displayeffectmessage(ack.pub);//display message for created account 
			}
		});
	}
	//search alias profile information
	async function searchuserid(e){
		if(!user.is){ return }//check if not user exist
		let pub = $('#profilesearch').val();//get input value
		let to = gun.user(pub);//check user and load data
		let who = await to.then() || {};//load alias data
		$('#searchstatus').text('Status: checking...');//display message text status
		if(!who.alias){//check not alias exist
			$('#searchstatus').text('Status: No Alias!'); //display message for not found alias
			//console.log('none');
			return;
		}else{
			$('#searchstatus').text('Status: Found Alias ' + who.alias + '!' ); //display message for found alias
			//console.log('found!');
		}
		//console.log(who);
		let data_name = await to.get('profile').get('name').then(); //get alisa name
		$('#aname').val(data_name); // set alisa name
		let data_born = await to.get('profile').get('born').then(); //get born name
		$('#aborn').val(data_born); // set born name
		let data_edu = await to.get('profile').get('education').then(); //get education name
		$('#aeducation').val(data_edu); // set education name
		let data_skills = await to.get('profile').get('skills').then(); //get skills name
		$('#askills').val(data_skills); // set skills name
	}

	//check Alias, clear message and add messages
	async function checkuserid(e){
		if(!user.is){ return }//if not user exist
		$('#messages').empty(); //clear messages list element
		//console.log('test');
		let pub = ($('#pub').val() || '').trim();// get public key
		if(!pub) return;
		let to = gun.user(pub); //get alias public key data
		let who = await to.then() || {};//load alias data
		$('#publickeystatus').text('Status: checking...'); //display message status
		if(!who.alias){
			$('#publickeystatus').text('Status: No Alias!'); //display message status
			//console.log('none');
			return;
		}else{
			$('#publickeystatus').text('Status: Found Alias ' + who.alias + '!' ); //display message status
			//console.log('found!');
		}
		$('#messages').empty();
		//console.log(who);
		let dec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
		user.get('message').get(pub).map().once((say,id)=>{ //get user message list from alias
			if((say == null)||(say == 'null'))
				return;
			//console.log("user chat");
			PrivateMessageUI(say,id,dec);
		});

		to.get('message').get(user.pair().pub).map().once((say,id)=>{//get alias message list from user
			if((say == null)||(say == 'null'))
				return;
			//console.log("alias chat");
			PrivateMessageUI(say,id,dec);
		});
	}

	// Display Private Message
	async function PrivateMessageUI(data, id, dec){//data, key, decrypt key
		let say = data.message;
		//console.log(say);
		say = await Gun.SEA.decrypt(say,dec);
		//console.log(say);
		//this.messages.push({id:id,message:say});
		var li = $('#' + id).get(0) || $('<li>').attr('id', id).appendTo('ul'); //check id element exist else create element id
		if(say){
			if(say == 'null'){//if say is null then hide element
				$(li).hide();	
			}
			$(li).empty(); //empty element
			let strbool = data.isread;
			console.log(strbool);
			let isread = false;
			if(data.isread == 'true'){
				isread = true;
			}
			$('<input type="checkbox" onclick="clickpmsgCheck(this)" ' + (isread ? 'checked' : '') + '>').appendTo(li); //check box
			$('<span>').text('IsRead | ').appendTo(li); //check box
			$('<span onclick="clickpmsgTitle(this)">').text(' ' +say + ' ').appendTo(li); //display text 
			$('<button onclick="clickpmsgDelete(this);">').html('Delete [x]').appendTo(li); //button delete 

			$("#messagelist").scrollTop($("#messagelist")[0].scrollHeight);//scroll message div to bottom
		} else {
			$(li).hide();
		}
	}
	//span click to change span to input
	function clickpmsgTitle(element){
		//console.log("input init?");
		element = $(element)//jquery element object
		if (!element.find('input').get(0)) {//check not exist input
			element.html('<input value="' + element.html() + '" onkeyup="keypresspmsgTitle(this)">')//create input
		}
	}
	//input press enter to change to input to span
	async function keypresspmsgTitle(element) {
		if (event.keyCode === 13) {//enter key if trigger
			console.log("enter here?");
			//todos.get($(element).parent().parent().attr('id')).put({title: $(element).val()});
			//get input value
			/*
			let val = $(element).val();//get input value
			element = $(element);//jquery object
			//get parent and clear span element child and add text
			element.parent().empty().text(val);//get parent span and set value text
			*/

			let id = $(element).parent().parent().attr('id');
			//console.log(id);
			let pub = $('#pub').val();
			let to = gun.user(pub);
			let who = await to.then() || {};//get alias data
			//console.log(who);
			let message = ($(element).val() || '' ).trim();
			if(!message) return;
			//console.log(message);
			//console.log(who);
			var sec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
			//console.log(sec);
			var message = await Gun.SEA.encrypt(message, sec); //encrypt message
			//console.log(message);

			user.get('message').get(pub).get(id).once((data)=>{
				console.log(data);
				//console.log(id);
				if(data!=null){
					user.get('message').get(pub).get(id).put({message:message},ack=>{
						console.log(ack);
						if(ack.err){
							return;
						}
						let val = $(element).val();//get input value
						element = $(element);//jquery object
						element.parent().empty().text(val);//get parent span and set value text
						//$(element).parent().hide();
					});
					console.log("found!?");
				}
			});
	
			// from Alias
			to.get('message').get(user.pair().pub).get(id).once((data)=>{
				//console.log("to chat");
				console.log(data);
				if(data!=null){
					//not working to delete
					//to.get('message').get(user.pair().pub).get(id).put(null,ack=>{ 
					to.get('message').get(user.pair().pub).get(id).put({message:message}, ack=>{
						console.log(ack);
						if(ack.err){
							$(element).parent().empty().text('error');
							//element.remove();
							return;
						}
						//let val = $(element).val();//get input value
						//element = $(element);//jquery object
						//element.empty();//get parent span and set value text
						//$(element).parent().hide();
					});
					console.log("other >> found!?");
				}
			});
		}
	}

	function clickpmsgCheck(element) {
		//todos.get($(element).parent().attr('id')).put({done: $(element).prop('checked')})
		let id = $(element).parent().attr('id');
		
		let strbool = $(element).prop('checked');
		strbool = strbool.toString();
		console.log("boolstr:",typeof(strbool));
		let pub = $('#pub').val();
		let to = gun.user(pub);

		user.get('message').get(pub).get(id).once((data)=>{
			//console.log(data);
			//console.log(id);
			if(data!=null){
				user.get('message').get(pub).get(id).put({isread:strbool},ack=>{
					console.log(ack);
					if(ack.err){
						return;
					}
					//$(element).parent().hide();
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
				to.get('message').get(user.pair().pub).get(id).put({isread:strbool}, ack=>{
					console.log(ack);
					if(ack.err){
						return;
					}
					//$(element).parent().hide();
				});
				console.log("other >> found!?");
			}
		});
	}

	//delete message check from User and other Alias
	function clickpmsgDelete(element) {
		let id = $(element).parent().attr('id');
		//console.log(id);
		let pub = $('#pub').val();
		let to = gun.user(pub);
		// current user
		user.get('message').get(pub).get(id).once((data)=>{
			//console.log(data);
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
					//console.log(ack);
					if(ack.err){
						return;
					}
					$(element).parent().hide();
				});
				//console.log("other >> found!?");
			}
		});
		//console.log('delete message?');
		//todos.get($(element).parent().attr('id')).put(null)
	}
	//add to window function since this is self contain sandbox.
	window.clickpmsgTitle = clickpmsgTitle;
	window.keypresspmsgTitle = keypresspmsgTitle;
	window.clickpmsgCheck = clickpmsgCheck;
	window.clickpmsgDelete = clickpmsgDelete;

	// Private Message
	async function privatemessage(_pubkey,_message){
		if(!user.is){ return }//check if user exist
		let pub = (_pubkey || '').trim();
		let message = (_message || '').trim();
		if(!message) return;//check if not message empty
		if(!pub) return;//check if not id empty
		let to = gun.user(pub);//get alias
		let who = await to.then() || {};//get alias data
		//console.log(who);
		if(!who.alias){
			//console.log("No Alias!");
			return;
		}
		//console.log(who);
		var sec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
		var enc = await Gun.SEA.encrypt(message, sec); //encrypt message
		user.get('message').get(pub).set({message:enc,isread:'false',bdelete:'false'},ack=>{
			console.log(ack);
		});//add message list
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

}
window.addEventListener('load',init);
//window.onload = function() {
	//init();
//};