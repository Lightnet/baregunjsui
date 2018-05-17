// client-side js
localStorage.clear(); //clear database for gun
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

//;(async () => {
	//var SEA = Gun.SEA;
	//var pair = await SEA.pair();
	//console.log(pair);
//})();
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
//var gun = Gun(location.origin + '/gun');
//Gun.on('opt', function(at){
	//console.log('opt...');
	//console.log(at);
	//this.to.next(at); 
//});
//Gun.on('secure', function(msg){
	//var yes;
	/* enforce some rules about data */
	/* requires wire-spec understanding */
	//if(yes){
			//this.to.next(msg); // call next middleware
	//}
	//console.log('secure');
	// NOT calling next middleware firewalls the data.
//});
//Gun.get('node').map().once(function(data){
	//console.log('data',data);
//});
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

gun.get('data').once(()=>{
	console.log("connect?");
});

//gun.get('data').put({text:'text'});

//gun.get('@').time((data, key, time)=>{ // subscribe to all incoming posts
	//console.log(data);
    // data might be a soul that you have to GET, I haven't made `time` be chainable yet
//}, 99); // grab the last 99 items

//require('./test');
//gun.on('hi', peer => {
	//console.log('connect peer to',peer);
//});
//gun.on('bye', function(peer){// peer disconnect.
	//console.log('disconnected from', peer);
//});
//console.log(gun);
//gun.get('data').once(function(){});//init connection
//gun.on('auth', function(at){
	//if('sign' === c.hash){ c.hash = '' }
	//as.route(c.hash || 'people');
	//console.log('auth');
//});
//gun.on('secure', function(at){
	//console.log('secure');
//});
//var c = window.c = {};
//c.hash = location.hash.slice(1);
//console.log("c.hash ",c.hash );
//Gun.on('opt',function(data){
	//console.log("update:", data);
//});
//https://stackoverflow.com/questions/49519571/gun-v0-9-92-using-sea-cant-put-nested-data-when-not-logged-in
//window.onload = function() {
	//loginuser("test","test");
	//var user = gun.user();
	//user.create("test","test",function(ack){
		//console.log("created!", ack.pub);
	//});
	//user.auth("test", "test",function(ack){
		//console.log(ack);
		//if(ack.err){
			//console.log("fail!");
		//}else{
			//console.log("Authorized!");
		//}
	//});
//};


//(function(){
	'use strict';

	console.log('hello world :o');
	
	let test = $('.hello').text();
	console.log(test);

//})()
