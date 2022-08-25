// CLEAR GUN DATABASE
localStorage.clear();

let gunurl = window.location.origin+'/gun';
//console.log(gunurl);
var gun = Gun(gunurl);
gun.on('hi', peer => {//peer connect
  //console.log('connect peer to',peer);
  //console.log('peer connect!');
});
gun.on('bye', (peer)=>{// peer disconnect
  //console.log('disconnected from', peer);
  //console.log('disconnected from peer!');
});

//console.log(String.random(16))
// https://github.com/amark/gun/blob/master/gun.js#L260
//console.log(Gun.state.is)

import {
  createSignal
, createEffect
, onMount
, onCleanup
, createMemo
//, on
} from "https://cdn.skypack.dev/solid-js";
import { render } from "https://cdn.skypack.dev/solid-js/web";
import html from "https://cdn.skypack.dev/solid-js/html";
import h from "https://cdn.skypack.dev/solid-js/h";

//const App = () => {
  //const [count, setCount] = createSignal(0),
    //timer = setInterval(() => setCount(count() + 1), 1000);
  //onCleanup(() => clearInterval(timer));
  //return html`<div>${count}</div>`;
  // or
  //return h("div", {}, count);
//};
//render(App, document.body);

let dispose;// for render() clean up
let disposeModal;// for render() clean up
let userName="Guest";
let userPublicKey="";

const PageNavMenu = () =>{

  function btnAccount(e){
    e.preventDefault();
    dispose();
    dispose = render(PageAccount, document.getElementById('app'));
  }

  function btnPrivateMessage(e){
    e.preventDefault();
    dispose();
    dispose = render(PagePrivateMessage, document.getElementById('app'));
  }

  function btnChatPublic(e){
    e.preventDefault();
    dispose();
    dispose = render(PagePublicChat, document.getElementById('app'));
  }

  function btnTestLab(e){
    e.preventDefault();
    dispose();
    dispose = render(PageTestLab, document.getElementById('app'));
  }
  function btnGunGraph(e){
    e.preventDefault();
    dispose();
    dispose = render(PageGunGraph, document.getElementById('app'));
  }

  return html`<div>
  <a href="#" onClick="${btnAccount}"> Account </a> <span> | </span>
  <a href="#" onClick="${btnPrivateMessage}"> Private Message </a><span> | </span>
  <a href="#" onClick="${btnChatPublic}"> Public Chat </a><span> | </span>
  <a href="#" onClick="${btnGunGraph}"> Gun Graph</a><span> | </span>
  <a href="#" onClick="${btnTestLab}"> Test Lab </a><span> | </span>
  </div>`;
}

const PageLogin = () => {
  const [alias, setAlias] = createSignal("test")
  const [passphrase, setPassphrase] = createSignal("12345678")
  const [pair, setPair] = createSignal(null)
  const [textPair, setTextPair] = createSignal("")
  const [isPair, setIsPair] = createSignal(false)

  function inputAlias(e){setAlias(e.target.value)}
  function inputPassphrase(e){setPassphrase(e.target.value)}

  function btnLogin(){
    //console.log(alias())
    //console.log(passphrase())
    let user = gun.user();
    if(isPair()){
      user.auth(pair(),(ack)=>{//user login pair
        if(ack.err){
          console.log(ack.err)
          return;
        }
        dispose()
        dispose = render(PageAccount, document.getElementById('app'));
      });
    }else{
      user.auth(alias(), passphrase(),(ack)=>{//user login username and password
        if(ack.err){
          console.log(ack.err)
          return;
        }
        dispose()
        dispose = render(PageAccount, document.getElementById('app'));
      });
    }
  }

  function btnSignUp(){
    dispose()
    dispose = render(PageSignUp, document.getElementById('app'));
  }

  function btnForgot(){
    dispose()
    dispose = render(PageForgot, document.getElementById('app'));
  }

  async function btnGeneratePair(){
    let _pair= await Gun.SEA.pair();
    console.log(_pair)
    setPair(_pair)
    setTextPair(JSON.stringify(_pair))
  }

  const displayType = createMemo(() => {
    if(isPair()){
      return html`
      <tr>
        <td>
          <button onClick="${btnGeneratePair}">Generate Pair</button>
        </td>
      </tr>
      <tr>
      <td>
        <label>SEA Pair:</label>
      </td>
      <td>
        <textarea value="${textPair}" onInput="${inputAlias}" placeholder="JSON String"/>
      </td>
    </tr>`;
    }else{
      return html`<tr>
      <td>
        <label>Alias:</label>
      </td>
      <td>
        <input value="${alias}" onInput="${inputAlias}"/>
      </td>
    </tr>
    <tr>
      <td>
        <label>Passphrase:</label>
      </td><td>
        <input value="${passphrase()}" onInput="${inputPassphrase}"/>
      </td>
    </tr>`;
    }
    
  });

  const isCheckPair =  createMemo(() => isPair());

  function togglePair(){
    setIsPair(state=>!state)
  }

  return html`<div>
    <label>Login</label> <span> | </span>
    <label> SEA Pair <input type="checkbox" checked="${isCheckPair}" onClick="${togglePair}"> </label>
    <table>
      <tbody>
        ${displayType}
        <tr>
          <td colspan="2">
            <button onClick="${btnLogin}">Login</button>
            <button onClick="${btnSignUp}">Sign Up</button>
            <button onClick="${btnForgot}">Forgot</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;
}

const PageAccountMenu = (props) =>{
  //const [message, setMessage] = createSignal(props.message || "None")

  function btnProfile(e){
    e.preventDefault();
    dispose();
    dispose = render(PageAccount, document.getElementById('app'));
  }

  function btnChangePassphrase(e){
    e.preventDefault();
    dispose();
    dispose = render(PageChangePassphrase, document.getElementById('app'));
  }

  function btnPassphraseHint(e){
    e.preventDefault();
    dispose();
    dispose = render(PagePassphraseHint, document.getElementById('app'));
  }

  return html`<div>
  <a href="#" onClick="${btnProfile}"> Profile </a> <span> | </span>
  <a href="#" onClick="${btnChangePassphrase}"> Change Passphrase  </a> <span> | </span>
  <a href="#" onClick="${btnPassphraseHint}"> Passphrase Hint </a> <span> | </span>
  </div>`;
}

const PageAccount = (props) =>{

  return html`<div>
  ${PageNavMenu()}
  ${PageAccountMenu()}
  <br/>
  ${PageAliasInfo()}
  <br/>
  ${PageProfile()}  
  <br/>
  ${PageSearchProfile()}
  </div>`;
}
//${PageSearchProfile()}

const PageSignUp = () => {
  const [alias, setAlias] = createSignal("test")
  const [passphrase, setPassphrase] = createSignal("12345678")

  function inputAlias(e){setAlias(e.target.value)}
  function inputPassphrase(e){setPassphrase(e.target.value)}

  function btnRegister(){
    let user = gun.user();
    user.create(alias(), passphrase(),(ack)=>{//create user and password
      if(ack.err){
        console.log(ack.err);//if user exist or error
        return;
      }
      console.log(ack);//pass if created
      //modalmessage("Created " + $('#alias').val() + "!");
    });
  }

  function btnCancel(){
    dispose()
    dispose = render(PageLogin, document.getElementById('app'));
  }

  return html`<div>
    <label>Register</label>
    <table>
      <tbody>
        <tr>
          <td>
            <label>Alias:</label>
          </td>
          <td>
            <input value="${alias()}" onInput="${inputAlias}"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Passphrase:</label>
          </td><td>
            <input value="${passphrase()}" onInput="${inputPassphrase}"/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button onClick="${btnRegister}">Register</button>
            <button onClick="${btnCancel}">Cancel</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;
}

const PageForgot = () => {
  const [alias, setAlias] = createSignal("test")
  const [question1, setQuestion1] = createSignal("")
  const [question2, setQuestion2] = createSignal("")
  const [hint, setHint] = createSignal("")
  const [status, setStatus] = createSignal("Idle")

  function inputAlias(e){setAlias(e.target.value)}
  function inputQuestion1(e){setQuestion1(e.target.value)}
  function inputQuestion2(e){setQuestion2(e.target.value)}
  function inputHint(e){setHint(e.target.value)}

  async function btnGetHint(){
    setStatus('Checking...')
    let _alias = alias();
    _alias = await gun.get('~@'+_alias).then(); // reused variable
    if(!_alias){//check user exist if not return false.
      //modalmessage('Not Found Alias!');
      setStatus('Not Found Alias!')
      return;
    }
    let publickey;
    for(let obj in _alias){//object 
      //console.log(obj);
      publickey = obj;//property name for public key
    }
    //console.log(SEA.opt.pub)
    publickey = SEA.opt.pub(publickey);//check and convert to key or null?
    //console.log(publickey);
    let q1 = (question1() || '').trim(); //get id question1 input
    let q2 = (question2() || '').trim(); //get id question2 input

    if((!q1)||(!q2)){
      //console.log('Q Empty!');
      //modalmessage('"Question (1 || 2) Empty!"');
      setStatus("Question 1|2 Empty!")
      return;
    }

    let to = gun.user(publickey);//get user alias graph
    let _hint = await to.get('hint').then();//get encrypt hint key graph
    let dec = await Gun.SEA.work(q1,q2);//get fquestion1 and fquestion2 string to mix key
    _hint = await Gun.SEA.decrypt(_hint,dec);//get hint and key decrypt message
    //console.log("hint:",_hint)
    if(_hint){//check if hint is string or null
      setHint(_hint)
    }else{
      //modalmessage("Fail Decrypt!");
      setStatus("Fail Decrypt!")
    }
  }

  function btnCancel(){
    dispose();
    dispose = render(PageLogin, document.getElementById('app'));
  }

  return html`<div>
    <label>Forgot</label>
    <table>
      <tbody>
        <tr>
          <td>
            <label>Alias:</label>
          </td>
          <td>
            <input value="${alias}" onInput="${inputAlias}"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Question #1:</label>
          </td><td>
            <input value="${question1}" onInput="${inputQuestion1}"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Question #2:</label>
          </td><td>
            <input value="${question2}" onInput="${inputQuestion2}"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Hint: </label>
          </td><td>
            <input value="${hint}" onInput="${inputHint}"/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <label> Status: ${status} </label>
            <span style="float:right;">
              <button onClick="${btnGetHint}">Hint</button>
              <button onClick="${btnCancel}">Cancel</button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;
}

const PageAliasInfo = () =>{
  let user = gun.user();
  const [alias, setAlias] = createSignal(user?.is?.alias || "Guest")
  const [publicKey, setPublicKey] = createSignal(user?.is?.pub || "")
  const [toggleKey, setToggleKey] = createSignal(true)

  function copyPubKey(){
    console.log("KEY:",publicKey())
    navigator.clipboard.writeText(publicKey());
  }

  function togglePubKey(){
    console.log("toggle")
    setToggleKey(state=>!state)
  }

  const isExpand = createMemo(() =>{//watch variable change
    if(toggleKey()==true){
      return "-"
    }else{
      return "+"
    }
  });

  const ShowPubKey = createMemo(() =>{//watch variable change
    if(toggleKey()==true){
      return String(publicKey())
    }else{
      return "Hidden"
    }
  });

  return html`<div>
    <label>Alias: ${alias}</label><br/>
    <label onClick="${copyPubKey}">Public Key:</label>
    <input value="${ShowPubKey}" readonly />
    <label onClick="${togglePubKey}">[${isExpand}]</label>
    <label onClick="${copyPubKey}">[copy]</label> 
    <br/>
  </div>`;
}

const PageProfile = () =>{
  
  const [alias, setAlias] = createSignal("")
  const [born, setBorn] = createSignal("")
  const [education, setEducation] = createSignal("")
  const [skills, setSkills] = createSignal("")

  function getProfileParam(_name){
    return new Promise((resolve,reject)=>{
      let user = gun.user();
      if(!user.is){ return reject(null)} //check for user auth
      user.get('profile').get(_name).once((data)=>{
        //console.log(data);
        resolve(data)
      })
    })
  }
  
  function inputProfileParam(event){
    //console.log("typing...")
    //console.log(event.target.name)
    if(event.target.name){
      if (event.keyCode == 13) {//enter key
        //console.log("Enter...")
        let user = gun.user();
        user.get('profile').get(event.target.name).put(String(event.target.value),ack=>{
          if(ack.err){
            console.log(`Profile save ${event.target.name} error!`)
            return;
          }
					console.log(ack);
          console.log(`Profile save ${event.target.name}!`)
				});
        return false;
      }
    }
  }

  onMount(async ()=>{
    setAlias(await getProfileParam('alias'))
    setBorn(await getProfileParam('born'))
    setEducation(await getProfileParam('education'))
    setSkills(await getProfileParam('skills'))
  })

  return html`<div>
    <label>Alias:</label> <input name="alias" value=${alias} onKeyUp="${inputProfileParam}" /><br/>
    <label>Born:</label> <input name="born" value=${born} onKeyUp="${inputProfileParam}" /><br/>
    <label>Education:</label> <input name="education" value=${education} onKeyUp="${inputProfileParam}" /><br/>
    <label>Skills:</label> <input name="skills" value=${skills} onKeyUp="${inputProfileParam}" /><br/>
  </div>`;
}

const PageSearchProfile = () =>{
  //let user = gun.user();
  //console.log(user)
  const [publicKey, setPublicKey] = createSignal("")
  const [status, setStatus] = createSignal("Idle")

  const [name, setName] = createSignal("")
  const [alias, setAlias] = createSignal("")
  const [born, setBorn] = createSignal("")
  const [education , setEducation ] = createSignal("")
  const [skills, setSkills] = createSignal("")

  async function searchPublicKey(event){
    setPublicKey(event.target.value)
    setStatus("checking...")
    let pub = (publicKey() || "").trim()
    if(!pub){
      console.log("EMPTY!")
      setStatus("EMPTY!")
			return;
		}
    var find = gun.user(pub);
    //console.log(find);
    let who = await find.then() || {};//get alias information
    //console.log(who);
    if(!who.alias){//check for alias from gun user
      setStatus('No Alias!')
			return;
		}else{
      //console.log(who)
      setName(who.alias)
      setStatus('Found! ' + who.alias)
		}
    find.get('profile').map().once((data, key)=>{
      //console.log(data)
      //console.log(key)
      if(key=="alias"){
        setAlias(String(data))
      }
      if(key=="born"){
        setBorn(String(data))
      }
      if(key=="education"){
        setEducation(String(data))
      }
      if(key=="skills"){
        setSkills(String(data))
      }
    });

  }
  
  //${PageNavMenu()}
  return html`<div>
  <div>
    <label>Search Public Key:</label> <input value="${publicKey}" onInput="${searchPublicKey}"/> <label>Status: ${status}</label> <br/>
    <label>Name: </label> <input value="${name}" /><br/>
    <label>Alias: </label> <input value="${alias}" /><br/>
    <label>Born:</label> <input value="${born}" /><br/>
    <label>Education</label> <input value="${education}" />  <br/>
    <label>Skills</label> <input value="${skills}" />  <br/>
  </div>`;
}

const PageChangePassphrase = () =>{

  const [oldPassphrase, setOldPassphrase] = createSignal("12345678")
  const [newPassphrase, setNewPassphrase] = createSignal("12345678")
  const [status, setSatus] = createSignal("Idle")

  function inputOldPassphrase(e){setOldPassphrase(e.target.value)}
  function inputNewPassphrase(e){setNewPassphrase(e.target.value)}

  function btnChange(event){
    setSatus("Check...");
    let user = gun.user();
    user.auth(user.is.alias, oldPassphrase(), (ack) => {//user auth call
      //console.log(ack);
      const check = ack.err || "Saved!";//check if there error else saved message.
      //console.log(check);
      //setSatus(_status);
      setSatus(check);
      //modalmessage(status);
    },{change: newPassphrase()});//set config to change password
  }

  function btnCancel(event){
    dispose();
    dispose = render(PageAccount, document.getElementById('app'));
  }

  return html`<div>
  ${PageNavMenu()}
  ${PageAccountMenu()}
  <div>
    <label> Change Passphrase </label>
    <table>
      <tbody>
        <tr>
          <td>
            <label>Old Passphrase:</label>
          </td>
          <td>
            <input value="${oldPassphrase()}" onInput="${inputOldPassphrase}"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>New Passphrase:</label>
          </td>
          <td>
            <input value="${newPassphrase()}" onInput="${inputNewPassphrase}"/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
          <label>Status: ${status}</label>
            <span style="float:right;">
              <button onClick="${btnChange}">Apply</button>
              <button onClick="${btnCancel}">Cancel</button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
  </div>`;
}

const PagePassphraseHint = () =>{

  const [question1, setQuestion1] = createSignal("")
  const [question2, setQuestion2] = createSignal("")
  const [hint, setHint] = createSignal("")
  const [status, setStatus] = createSignal("Idle")

  function inputQuestion1(e){setQuestion1(e.target.value)}
  function inputQuestion2(e){setQuestion2(e.target.value)}
  function inputHint(e){setHint(e.target.value)}

  async function applyHint(){
    setStatus("Checking...")
    console.log("hint...")
    console.log(question1())
    console.log(question2())
    console.log(hint())
    let user = gun.user();
    let q1 = question1(); //get input id question 1
    let q2 = question2(); //get input id question 2
    let _hint = hint(); //get input id hint

    let sec = await Gun.SEA.secret(user.is.epub, user._.sea);//mix key to decrypt
    let enc_q1 = await Gun.SEA.encrypt(q1, sec);//encrypt q1
    user.get('forgot').get('q1').put(enc_q1);//set hash q1 to user data store
    let enc_q2 = await Gun.SEA.encrypt(q2, sec);//encrypt q1
    user.get('forgot').get('q2').put(enc_q2); //set hash q2 to user data store
    sec = await Gun.SEA.work(q1,q2);//encrypt key
    let enc = await Gun.SEA.encrypt(_hint, sec);//encrypt hint

    user.get('hint').put(enc,ack=>{//set hash hint
      //console.log(ack);
      if(ack.err){
        console.log("Error!");
        //modalmessage(ack.err);
        setStatus("Fail! Error!")
        return;
      }
      if(ack.ok){
        console.log('Hint Apply!');
        setStatus("Hint Apply!")
        //modalmessage('Hint Apply!');
      }
    });
  }

  async function getHint(){
    setStatus("Checking...")
    let user = gun.user();
    let q1,q2,_hint;
    let sec = await Gun.SEA.secret(user.is.epub, user._.sea);// mix key to decrypt
    q1 = await user.get('forgot').get('q1').then();
    q1 = await Gun.SEA.decrypt(q1, sec);//decrypt question1

    q2 = await user.get('forgot').get('q2').then();
    q2 = await Gun.SEA.decrypt(q2, sec);//decrypt question2
    setQuestion1(q1)
    setQuestion2(q2)

    sec = await Gun.SEA.work(q1,q2);//encrypt key
    _hint = await user.get('hint').then();//get encrypt hint 
    _hint = await Gun.SEA.decrypt(_hint, sec);//decrypt hint
    setHint(_hint)
    setStatus("Done!")
  }

  return html`<div>
  ${PageNavMenu()}
  ${PageAccountMenu()}
  <div>
    <label> Passphrase Set Hint </label>
    <table>
      <tbody>
        <tr>
          <td>
            <label>Question 1:</label>
          </td>
          <td>
            <input value="${question1}" onInput="${inputQuestion1}"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Question 2:</label>
          </td>
          <td>
            <input value="${question2}" onInput="${inputQuestion2}"/>
          </td>
        </tr>
        <tr>
          <td>
            <label>Hint:</label>
          </td>
          <td>
            <input value="${hint}" onInput="${inputHint}"/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <label> Status: ${status} </label>
            <span style="float:right;">
              <button onClick="${applyHint}"> Apply </button>
              <button onClick="${getHint}"> Get </button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>`;
}

function timeStamp(){
  let currentDate = new Date();
  //console.log(currentDate);
  let year = currentDate.getFullYear();
  let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
  let date = ("0" +currentDate.getDate()).slice(-2);
  let hour = ("0" +currentDate.getHours()).slice(-2);
  let minute = ("0" +currentDate.getMinutes()).slice(-2);
  let second = ("0" +currentDate.getSeconds()).slice(-2);
  let millisecond = currentDate.getMilliseconds();
  return year + "/" + (month) + "/" + date + ":" + hour+ ":" + minute+ ":" + second+ ":" + millisecond;        
}

// https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
// 
const PagePublicChat = () =>{

  const [message, setMessage] = createSignal("");

  let refPublicMessages;
  let encmsg;
  let gunchat;

  async function inputMessage(event){
    console.log("TYPE...")
    if(event.key == "Enter"){
      //console.log(event.target.value)
      setMessage(event.target.value)
      console.log("ENTER message?")
      let user = gun.user();
      if(!user.is){ return }//check if user exist
      let msg = (message() || '').trim();
      console.log("msg:",msg)
      if(!msg) return;//check if not id empty
      //let encmsg = await SEA.work("public","chat");//encrypttion key default?
      //console.log(encmsg);
      let enc = await SEA.encrypt(msg,encmsg);
      //console.log(enc);
      let who = await user.get('alias').then();
      //console.log(who);
      //console.log(typeof enc)
      enc = window.btoa(enc);
      let dateTime = timeStamp()
      console.log(dateTime)
      gun.get('chat').get(dateTime).put({
        alias:who,
        message:enc
      });
      console.log("send message...");
    }
  }

  function scrollPublicMessage(){
    //let element = document.getElementById("publicchatlist");
    let element = refPublicMessages;
    element.scrollTop = element.scrollHeight;
  }

  async function qcallback(data,key){
    console.log('incoming messages...')
    //console.log("key",key);
    //console.log("data",data);
    if(data == null)return;
    if(data.message != null){
      let message = window.atob(data.message);
      //console.log(message);
      let dec = await SEA.decrypt(message,encmsg);
      //console.log(dec)
      if(dec!=null){
        //$('#publicchatlist').append($('<div/>', { 
            //id: key,
            //text : data.alias + ": " + dec
        //}));
        let divMsg = document.createElement("div")
        divMsg.setAttribute('id',key)
        divMsg.append(data.alias + ": " + dec)
        refPublicMessages.appendChild(divMsg)
        scrollPublicMessage();
      }
    }
  }

  async function initChat(){
    console.log("Init Chat...")
    //$('#publicchatlist').empty();
    let encmsg = await SEA.work("public","chat"); //encrypttion key default?
    
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
    let date = ("0" +currentDate.getDate()).slice(-2);
    let timestring = year + "/" + month + "/" + date + ":";
    //console.log(timestring);
    if(gunchat !=null){
      gunchat.off()
    }
    gunchat = gun.get('chat');
    //gunchat.get({'.': {'*': '2019/08/'}}).map().once(qcallback);
    //gunchat.get({'.': {'*': timestring}}).map().once(qcallback);
    console.log("timestring: ", timestring)
    gunchat.get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
    console.log("END SETUP...")
  }

  onMount(async ()=>{
    console.log("onMount chat...")
    encmsg = await SEA.work("public","chat"); //encrypttion key default?
    
    console.log(document.getElementById('refPublicMessages'))
    refPublicMessages = document.getElementById('refPublicMessages')
    //console.log(refPublicMessages)
    //refPublicMessages.innerHTML = "";
    await initChat();
  })

  onCleanup(()=>{
    if(gunchat !=null){
      gunchat.off()
    }
  })
  
  return html`<div style="height:100vh;width:100%">
    ${PageNavMenu()}
    <div style="height:calc(100vh - 18px);width:100%">
      <label> Public Chat </label>
      <div id="refPublicMessages" style="background-color: darkgray;overflow-y: scroll; height:calc(100vh - 58px);">
        Not Init.
      </div>
      <div style="height:22px;width:100%">
        <input value="${message}" onKeyUp="${inputMessage}" placeholder="type here and press enter"><button> Enter </button>
      </div>
    </div>
  </div>`;
}
// https://github.com/Lightnet/gunjstrustsharekey/blob/master/client.js#L640
const aliasContacts = (props) =>{

  const [pubKey, setPublicKey] = createSignal("")
  const [status, setStatus] = createSignal("Idle")
  const [contacts, setContacts] = createSignal([])
  const [contactID, setContactID] = createSignal("")

  function inputPublicKey(e){
    setPublicKey(e.target.value)
    console.log("typing...")
    if(e.target.value != "None" && e.target.value.length !== 0){
      setStatus("...")
      CheckPublicKey(e.target.value)
    }
  }

  async function CheckPublicKey(_pub){
    if(!_pub){
      //console.log("EMPTY!")
      setStatus("EMPTY!")
			return;
		}
    let find = gun.user(_pub);
    console.log(find)
    let who = await find.then() || {};//get alias information
    if(!who.alias){//check for alias from gun user
      setStatus('No Alias!')
			return;
		}
    setStatus('Found! ' + who.alias)
    if(typeof props.onChange === 'function'){
      props.onChange(_pub)
    }
  }

  async function clickAddContact(e){
    let _publickey = (pubKey() || '').trim();
    if(!_publickey){console.log("Public Key EMPTY!");return;}
    let user = gun.user();
    let to = gun.user(_publickey);//get alias
    let who = await to.then() || {};//get alias data
    if(!who.alias){console.log("No Alias!");return;}
    //need encrypt contact?
    console.log(who)
    const uid = String.random(32);
    user.get("contacts").get(uid).put({alias:who.alias,pub:_publickey});
    setContacts(state=>[...state,{id:uid,name:who.alias,pub:_publickey}])
  }

  async function clickRemoveContact(e){
    let _publickey = (pubKey() || '').trim();
    if(!_publickey){console.log("Public Key EMPTY!");return;}
    let user = gun.user();
    let userData = contacts().find(item=>item.pub==_publickey)
    console.log(userData)
    user.get("contacts").get(userData.id).put(null);
    setContacts(state=>state.filter(item=>item.pub!==_publickey))

    //let to = gun.user(_publickey);//get alias
    //let who = await to.then() || {};//get alias data
    //if(!who.alias){console.log("No Alias!");return;}
    //user.get("contacts").get(_publickey).put(null);
  }

  function selectContact(event){
    console.log("SELECT Contact", event.target.value)
    let pubID ="";
    pubID=event.target.value;
    if(event.target.value == "none"){
      pubID="";
    }
    setContactID(pubID)
    setPublicKey(pubID)
    if(typeof props.onChange === 'function'){
      props.onChange(pubID)
    }
  }
  //> ${item.pub}
  const contactList = createMemo(() => contacts().map(item=>html`<option id="${item.id}" value="${item.pub}">${item.name} </option>`));

  onMount(()=>{
    let user = gun.user();
    user.get('contacts').once().map().once((data,key)=>{
      console.log(data)
      console.log(key)
      if(data !=null && key.length == 32 && data?.pub != null){
        setContacts(state=>[...state,{id:key,name:data.alias,pub:data.pub}])
      }
    })
  })

  return html`<span>
    <select value="${contactID}" onChange="${selectContact}">
      <option value="none"> NONE </option>
      ${contactList}
    </select>
    <input value="${pubKey}" onInput="${inputPublicKey}" />
    <button onClick="${clickAddContact}"> Add </button>
    <button onClick="${clickRemoveContact}"> Remove </button>
    <label>Status: ${status}</label>
  </span>`;
}

const PagePrivateMessage = () =>{

  const [message, setMessage] = createSignal("")
  const [publicKey, setPublicKey] = createSignal("")
  const [who, setWho] = createSignal("")

  let UIdec; //for message decode key
  let refPublicMessages;

  let userMessage;
  let toMessage;

  async function inputMessage(event){
    console.log("TYPE...")
    setMessage(event.target.value)
    if(event.key == "Enter"){
      sendPrivateMessage();
    }
  }

  async function sendPrivateMessage(){
    let msg = (message() || '').trim();
    let pubkey = (publicKey() || '').trim();
    if(!msg){console.log("Message EMPTY!");return;}
    if(!pubkey){console.log("Public Key EMPTY!");return;}
    let user = gun.user();
    let to = gun.user(pubkey);//get alias
    let who = await to.then() || {};//get alias data
    if(!who.alias){console.log("No Alias!");return;}
    let sec = await Gun.SEA.secret(who.epub, user._.sea); // Diffie-Hellman
    let enc = await Gun.SEA.encrypt(msg, sec); //encrypt message
    user.get('messages').get(pubkey).set(enc);
    console.log("finish...");
  }

  function scrollPublicMessages(){
    //let element = document.getElementById("publicchatlist");
    let element = refPublicMessages;
    element.scrollTop = element.scrollHeight;
  }

  async function viewPrivateMessages(){
    if(userMessage!=null){
      userMessage.off()
    }
    if(toMessage!=null){
      toMessage.off()
    }
    let user = gun.user();
    if(!user.is){ return }//check if user exist
    //messages = [];
    //CleanMessages();
    let pub = (publicKey() || '').trim();
    if(!pub) return;//check if not id empty
    let to = gun.user(pub);//get alias
    let who = await to.then() || {};//get alias data
    if(!who.alias){
      console.log("No Alias!");
      //$('#mwho').text("who?");
      setWho("No Alias!")
      return;
    }
    //$('#mwho').text(who.alias);
    setWho(who.alias)
    UIdec = await Gun.SEA.secret(who.epub, user._.sea); // Diffie-Hellman
    //user.get('messages').get(pub).map().once((data,id)=>{
      //UI(data,id,user.is.alias)
    //});
    //to.get('messages').get(user._.sea.pub).map().once((data,id)=>{
      //UI(data,id,who.alias)
    //});

    userMessage = user.get('messages').get(pub);
    userMessage.map().once((data,id)=>{
      UI(data,id,user.is.alias)
    });

    toMessage = to.get('messages').get(user._.sea.pub);
    toMessage.map().once((data,id)=>{
      UI(data,id,who.alias)
    });
  }

  async function UI(say, id, alias){
    say = await Gun.SEA.decrypt(say, UIdec);
    //messages.push({id:id,alias:alias,message:say});
    if($("#" + id).length){
        //console.log("found!?");
    }else{
      //$('#messagelist').append($('<div/>', { 
        //id: id,
        //text : alias + ": " + say
      //}));
      let divMsg = document.createElement("div")
      divMsg.setAttribute('id',id)
      divMsg.append(alias + ": " + say)
      refPublicMessages.appendChild(divMsg)
    }
    //let element = document.getElementById("messagelist");
    //element.scrollTop = element.scrollHeight;
    scrollPublicMessages();
  }

  onMount(async ()=>{
    console.log("onMount chat...")
    refPublicMessages = document.getElementById('refPublicMessages')
  })

  onCleanup(()=>{
    if(userMessage!=null){
      userMessage.off()
    }
    if(toMessage!=null){
      toMessage.off()
    }
  })

  function onSelectPub(value){
    console.log("value ID:",value)
    setPublicKey(value)
    refPublicMessages.replaceChildren();
    let divInit = document.createElement('div')
    divInit.append('Init Message!')
    refPublicMessages.appendChild(divInit)
    viewPrivateMessages();
  }

  return html`<div style="height:100vh;width:100%">
    ${PageNavMenu()}
    <div style="height:calc(100vh - 18px);width:100%">
      <label> Private Message </label> ${aliasContacts({onChange:onSelectPub})}
      <div id="refPublicMessages" style="background-color: darkgray;overflow-y: scroll; height:calc(100vh - 58px);">
        Not Init.
      </div>
      <div style="height:22px;width:100%">
        <input value="${message}" onKeyUp="${inputMessage}" placeholder="type here and press enter"><button> Enter </button>
      </div>
    </div>
  </div>`;
}

const PageGroupMessage = () =>{


  let gunGroupMessage;


  onMount(async ()=>{
    console.log("onMount chat...")
  })

  onCleanup(()=>{
    
  })

  return html`<div>
  ${PageNavMenu()}
  <div>
    <label> Private Message </label>
    <table>
      <tbody>
        <tr>
          <td>
            <label></label>
          </td>
          <td>
            <input />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>`;
}

const Modal = (props) =>{

  const [message, setMessage] = createSignal(props?.message || "None")

  function btnClose(){
    disposeModal();
  }

  return html`<div>
  <div>
    <label>Modal</label> <button onClick="${btnClose}"> x </button>
  </div>
  <div>
    ${message()}
  </div>
  </div>`;
}

const GunNode = (props) =>{

  const [nodeList, setNodeList] = createSignal([])
  //console.log(props)

  let node;
  //let nodeList=[]

  if(props.node){
    node=props.node
    //console.log("NODE:",props.node)
    node.once().map().once((data,key)=>{
      console.log(key)
      console.log(data)
      //nodeList.push(key)
      setNodeList(state=>[...state,{id:key, value:data}])
    })
  }

  const Glist = createMemo(() => nodeList().map(item=>
    html`<li id="${item.id}"> ${item.id}: ${item.value} </li>`
  ));
  //${GunNode({node:node.get(item)})}

  return html`<ul>
  ${Glist}
  </ul>`;
}

const PageGunGraph = () =>{
  console.log(gun)

  function getGraph(){
    //for (const key in gun._.graph) {
      //console.log(key)
      //if (Object.hasOwnProperty.call(gun._.graph, key)) {
        //const element = gun._.graph[key];
        //console.log(element)
      //}
    //}
    let dataList = [];
    Object.entries(gun._.graph).forEach(([key, value]) => {
      //console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
      dataList.push(html`<li id="${key}">${key} ${GunNode({node:gun.get(key)})} </li>`);
    });
    //console.log(dataList)
    return html`<ul>${dataList}</ul>`
  }

  return html`<div>
  ${PageNavMenu()}
  ${getGraph()}
  </div>`;
}

const ListArrayItems = (props) =>{
  const [cats, setCats] = createSignal([
    { id: 'J---aiyznGQ', name: 'Keyboard Cat' },
    { id: 'z_AbfPXTKms', name: 'Maru' },
    { id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
  ]);

  //let timer = setInterval(() =>{ 
    //setCats(item=>[...item,{id:crypto.randomUUID(), name:crypto.randomUUID()}])
    //console.log(cats())
  //}, 1000);

  const catlist = createMemo(() => cats().map(item=>html`<li id="${item.id}">${item.name}</li>`));

  onCleanup(() => {
    //clearInterval(timer)
  });

  return html`<div>
  <ul>
  ${catlist}
  </ul>
  </div>`;
}

// TEST AREA
const PageTestLab = (props) =>{

  const [message, setMessage] = createSignal(props?.message || "None")

  return html`<div>
  ${PageNavMenu()}
  ${ListArrayItems()}

  </div>`;
}

// BLANK COMPONENT
const PageBlank = (props) =>{
  //const [message, setMessage] = createSignal(props?.message || "None")

  return html`<div>
  </div>`;
}

//init app
dispose = render(PageLogin, document.getElementById('app'));
//disposeModal = render(()=>Modal({message:"test"}), document.getElementById('modal'));