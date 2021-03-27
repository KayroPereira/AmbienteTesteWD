import * as security from './security.js';

let projectID = security.projectID;
let apiKey = security.apiKey;
 
const MAC_ADDRESS = security.MAC_ADDRESS;
const PATH_SHARE_FLAG = security.PATH_SHARE_FLAG;
const PATH_SHARE_NUMBER = security.PATH_SHARE_NUMBER;
const VALUE_MIN_FIREBASE = security.VALUE_MIN_FIREBASE;
const VALUE_MAX_FIREBASE = security.VALUE_MAX_FIREBASE;
const PATH_SHARE_TEXT = security.PATH_SHARE_TEXT;
 
const PATH_NUMBER = security.PATH_NUMBER;
const PATH_TEXT = security.PATH_TEXT;

var config = {
		 apiKey: apiKey,
		 authDomain: projectID + ".firebaseapp.com",
		 databaseURL: "https://" + projectID + ".firebaseio.com",
		 storageBucket: projectID + ".appspot.com"
};

let btn1 = document.getElementById("btn_1");
let btn2 = document.getElementById("btn_2");
let btn3 = document.getElementById("btn_3");
let btn4 = document.getElementById("btn_4");
let btn5 = document.getElementById("btn_5");

let in1 = document.getElementById("in_1");
let in2 = document.getElementById("in_2");
let in3 = document.getElementById("in_3");

let lbl1 = document.getElementById("lbl_1");
let lbl2 = document.getElementById("lbl_2");
let lbl3 = document.getElementById("lbl_3");
let lbl4 = document.getElementById("lbl_4");
let lbl5 = document.getElementById("lbl_5");
let lbl6 = document.getElementById("lbl_6");
let lbl7 = document.getElementById("lbl_7");

let lbl_number = [lbl3, lbl4, lbl5];

let dataFlg = 0;

firebase.initializeApp(config);

function updateLabel(lbl, value){
  lbl.innerText = value;
}

function random(inf, top){
	return inf + Math.floor(Math.random()*top);
}

function formatBtn(btn, value){
  btn.innerText = value == 0 ? "Value: Off" : "Value: On";

  if(value == 0){
    btn.classList.remove("btn-success");
    btn.classList.add("btn-danger");
  }else{
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-success");
  }
}

// Requisita atualização ao carregar a página
getFirebase(MAC_ADDRESS + PATH_SHARE_FLAG, 1);
getFirebase(MAC_ADDRESS + PATH_SHARE_NUMBER, 2);
getFirebase(MAC_ADDRESS + PATH_SHARE_TEXT, 3);

// Atualiza componentes HTML
function updateComponents(valores, modo){

	switch(modo){
		case 1:
			formatBtn(btn1, valores);
		
			updateLabel(lbl1, "Value " + valores);
			updateLabel(lbl2, "Value " + valores);
			break;
			
		case 2:
			for(let i = 0; i < valores.length; i++)
				updateLabel(lbl_number[i], PATH_NUMBER[i] + ": " + valores[i]);
			break;
			
		case 3:
			updateLabel(lbl6,  valores[0]);
			updateLabel(lbl7,  valores[1]);
			break;
	}
}

// Download do FIREBASE ao carregar a página
function getFirebase(PATH, modo){
	
	firebase.database().ref(PATH).get().then(function(snapshot) {
	
		let lengthPath = snapshot.numChildren();
		let valores;
		
		if (snapshot.exists()) {
			if(lengthPath == 0){
				valores = [snapshot.val()];
			}else{
				valores = Object.values(snapshot.val());
			}
		}else{
			console.log("No data available");
			return -1;
		}
		updateComponents(valores, modo);
		
	}).catch(function(error) {
	  console.error(error);
	  return -1;
	});	
}

let refreshLabel = firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG);
refreshLabel.on('value', () => {
	getFirebase(MAC_ADDRESS + PATH_SHARE_FLAG, 1);
});

let refreshLabel_2 = firebase.database().ref(MAC_ADDRESS + PATH_SHARE_NUMBER);
refreshLabel_2.on('value', () => {
	getFirebase(MAC_ADDRESS + PATH_SHARE_NUMBER, 2);
});

let refreshLabel_3 = firebase.database().ref(MAC_ADDRESS + PATH_SHARE_TEXT);
refreshLabel_3.on('value', () => {
	getFirebase(MAC_ADDRESS + PATH_SHARE_TEXT, 3);
});

btn1.onclick = function() {
	setData('btn_1');
};
btn2.onclick = function() {
	setData('btn_2');
	in1.select();
};
btn3.onclick = function() {
	setData('btn_3');
};
btn4.onclick = function() {
	setData('btn_4');
	in2.value = "";
};
btn5.onclick = function() {
	setData('btn_5');
	in3.value = "";
};

// Carrega dados no FIREBASE
 function setData(btn) {
	 
    if(btn === 'btn_1'){
    	dataFlg == 0 ? dataFlg = 1 : dataFlg = 0;
    	firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).set(dataFlg);
    }else if(btn === 'btn_2'){
    	dataFlg = 1;
    	firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).set(in1.value);
    }else if(btn === 'btn_3'){

      for(let i = 0; i < PATH_NUMBER.length; i++){
    	  firebase.database().ref(MAC_ADDRESS + PATH_SHARE_NUMBER + "/" + PATH_NUMBER[i]).set(random(VALUE_MIN_FIREBASE, VALUE_MAX_FIREBASE));
      }
      dataFlg = 1;
      firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).set(dataFlg);
    }else if(btn === 'btn_4' || btn === 'btn_5'){
    	
    	let i = btn === 'btn_4' ? 0 : 1;
    	let value = btn === 'btn_4' ? in2.value : in3.value; 
    	
    	dataFlg = 1;
    	firebase.database().ref(MAC_ADDRESS + PATH_SHARE_TEXT + "/" + PATH_TEXT[i]) .set(value);
    	firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).set(dataFlg);
    }
}

function delData() {
    firebase.database().ref('/Test/Stream').remove();
}
