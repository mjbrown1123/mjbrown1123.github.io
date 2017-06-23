var mesInd = 0;
var databaseRef = firebase.database().ref('messages/');
var userName = "default_user";

function send() {

	var val = document.getElementById('message').value;

	
	if(!(val === "")) {
		

		console.log("Send: " + val);

		writeUserData(userName,val);
	}

	document.getElementById('message').value = "";


};

function changeUser() {

	var nam = document.getElementById('username').value;

	if(!(nam === "")) {
		

		console.log("Change username to: " + nam);

		userName = nam;
	}


	document.getElementById('username').value = "";

};


function writeUserData(username, mess) {

	var keyMess = {
		name: username,
		message: mess

	};

	databaseRef.push().set(keyMess);


};

databaseRef.on('child_added', function(snapshot) {

	var chat =snapshot.val();
	console.log(chat);

	newBlock(chat['name'],chat['message']);

});

function newBlock(user, message) {


	var div = document.createElement('div');

	div.id = "mes" + mesInd;
	div.textContent = user + ": " + message;
	div.style.margin = '30px';
	div.style.backgroundColor = 'cyan';
	div.style.borderColor='black';
	div.style.borderStyle='solid	';
	div.style.borderWidth='2px';
	document.body.appendChild(div);

	console.log(div.id);
	mesInd++;


};