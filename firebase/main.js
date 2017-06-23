var mesInd = 0;
var databaseRef = firebase.database().ref('messages/');

function send() {

	var userName = "web";
	var val = document.getElementById('message').value;

	//newBlock(userName,val);

	
	document.getElementById('message').value = ""

	console.log("Send: " + val);

	writeUserData(userName,val);



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
	div.textContent = message;
	div.style.margin = '30px';
	div.style.backgroundColor = 'cyan';
	div.style.borderColor='black';
	div.style.borderStyle='solid	';
	div.style.borderWidth='2px';
	document.body.appendChild(div);

	console.log(div.id);
	mesInd++;


};