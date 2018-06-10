var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./DB.js');
var fileHandler = require("./FileHandler.js")
var externalApi = require('./externalApi.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


function validateEmail(email) {
    var EMAIL_REGEX = /^[\w-\+]+(\.[\w]+)*@[\w-]+(\.[\w]+)*(\.[a-z]{2,})$/;
    return EMAIL_REGEX.test(String(email).toLowerCase());
}

io.on('connection', function(socket){
  console.log('a user connected');
  externalApi.socket = socket;
  
  externalApi.Run(socket);
  fileHandler.Run(socket);
  
  socket.on('SignUp', (user) => {
    try {
       if (!user) {
        socket.emit('SignUpComplete', 2, 'התרחשה תקלה');
        console.log('#SignUp - user is null or undefined!');
        return;
      }
      user = JSON.parse(user);
      if (!user.UserName || 
          !user.UserMail || 
          !user.UserPassword || 
          user.UserPassword.length < 6 || 
          validateEmail(user.UserMail) == false || 
          user.UserName.length < 3 || 
          user.UserName.indexOf(' ') < 0) {
        console.log('#SignUp - invalid user details!');
        console.log(user);
        socket.emit('SignUpComplete', 2, 'התרחשה תקלה');
        return;
      } else {
        db.SignUp(user, socket); 
      }
    } catch (e) {
      console.log(e);
      socket.emit('SignUpComplete', 2, 'התרחשה תקלה');
    }
  });
  
  socket.on('SignUpBusiness', (Business) => {
    try {
       if (!Business) {
        socket.emit('SignUpBusinessComplete', 2, 'התרחשה תקלה');
        console.log('#SignUpBusiness - Business is null or undefined!');
        return;
      }
      Business = JSON.parse(Business);
      if (!Business.BusinessName || 
          !Business.BusinessDescription || 
          !Business.BusinessPhone || 
          !Business.BusinessCity || 
          !Business.BusinessStreet || 
          !Business.BusinessWorkers || 
          Business.BusinessWorkers.length == 0 || 
          Business.BusinessWorkers.length > 50 //|| 
          //!Business.BusinessType || 
          //validation for workers
          ) {
        console.log('#SignUp - invalid Business details!');
        console.log(Business);
        socket.emit('SignUpBusinessComplete', 2, 'התרחשה תקלה');
        return;
      } else {
        db.SignUpBusiness(Business, socket); 
      }
    } catch (e) {
      console.log(e);
      socket.emit('SignUpBusinessComplete', 2, 'התרחשה תקלה');
    }
  });
  
  socket.on('WriteError', (Message, StackTrace) => {
    try {
       console.log(' ## ERROR ## ' + Message, StackTrace);
    } catch (e) {
      console.log(e);
      socket.emit('SignUpComplete', 2, 'התרחשה תקלה');
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});