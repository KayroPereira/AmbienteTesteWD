import * as security from './security.js';

let projectID = security.projectID;
let apiKey = security.apiKey;
 
const MAC_ADDRESS = security.MAC_ADDRESS;
const PATH_SHARE_FLAG = security.PATH_SHARE_FLAG;
const PATH_SHARE_NUMBER = security.PATH_SHARE_NUMBER;
const VALUE_MIN_FIREBASE = security.VALUE_MIN_FIREBASE;
const VALUE_MAX_FIREBASE = security.VALUE_MAX_FIREBASE;
 
const PATH_NUMBER = security.PATH_NUMBER;

var config = {
		 apiKey: apiKey,
		 authDomain: projectID + ".firebaseapp.com",
		 databaseURL: "https://" + projectID + ".firebaseio.com",
		 storageBucket: projectID + ".appspot.com"
};

let btn1 = document.getElementById("btn_1");

let send1 = document.getElementById("in_1");

let lbl1 = document.getElementById("lbl_1");
let lbl2 = document.getElementById("lbl_2");
let lbl3 = document.getElementById("lbl_3");
let lbl4 = document.getElementById("lbl_4");
let lbl5 = document.getElementById("lbl_5");

let lbl_number = [lbl3, lbl4, lbl5];

let dataFlg = 0;

firebase.initializeApp(config);

function updateLabel(lbl, value){
  lbl.innerText = value;
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

//Download do PATH_SHARE_FLAG ao carregar a página
firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).get().then(function(snapshot) {
  
  if (snapshot.exists()) {
    let valueBtn = snapshot.val();

    dataFlg = valueBtn;
    formatBtn(btn1, valueBtn);
    updateLabel(lbl1, "Value " + valueBtn);
  }
  else {
    console.log("No data available");
  }
}).catch(function(error) {
  console.error(error);
});

function random(inf, top){
  return inf + Math.floor(Math.random()*top);
}

//Download do PATH_SHARE_NUMBER ao carregar a página
firebase.database().ref(MAC_ADDRESS + PATH_SHARE_NUMBER).get().then(function(snapshot) {

  let i = 0;
  snapshot.forEach(function(childSnapshot) {
    updateLabel(lbl_number[i++], childSnapshot.key + ": " + childSnapshot.val());
  });
}).catch(function(error) {
  console.error(error);
});

let refreshLabel = firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG);

refreshLabel.on('value', (snapshot) => {
  const data = snapshot.val();
  
  formatBtn(btn1, data);

  updateLabel(lbl1, "Value " + data);
  updateLabel(lbl2, "Value " + data);
});

// let refreshLabel = firebase.database().ref(MAC_ADDRESS + PATH_SHARE_NUMBER);

// refreshLabel.on('value', (snapshot) => {
//   const data = snapshot.val();
  
//   formatBtn(btn1, data);

//   updateLabel(lbl1, "Value " + data);
//   updateLabel(lbl2, "Value " + data);
// });

function setData(btn) {

    if(btn === 'btn_1'){
      dataFlg == 0 ? dataFlg = 1 : dataFlg = 0;
      firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).set(dataFlg);
    }else if(btn === 'btn_2'){
      firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).set(send1.value);
    }else if(btn === 'btn_3'){

      for(let i = 0; i < PATH_NUMBER.length; i++){
        console.log(MAC_ADDRESS + PATH_SHARE_NUMBER + "/" + PATH_NUMBER[i]);
        firebase.database().ref(MAC_ADDRESS + PATH_SHARE_NUMBER + "/" + PATH_NUMBER[i]).set(random(VALUE_MIN_FIREBASE, VALUE_MAX_FIREBASE));
      }
      dataFlg = 1;
      firebase.database().ref(MAC_ADDRESS + PATH_SHARE_FLAG).set(dataFlg);
    }
}

function delData() {
    firebase.database().ref('/Test/Stream').remove();
}
