var MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const numOfHashRounds = 10;
var url = "mongodb://localhost:27017";



this.SignUp = function(user, socket) {
    MongoClient.connect(url, function(err, db) {
           if (err) throw err;
        try {
           let mydb = db.db("Queue");
           user.UserPassword = bcrypt.hashSync(user.UserPassword, numOfHashRounds);
           
           mydb.collection("User").findOne({UserMail: user.UserMail}, function(err, result) {
            if (err) throw err;
            if (!result || result.length == 0) {
                mydb.collection("User").insertOne(user);
                socket.emit('SignUpComplete', 0, 'נירשמת בהצלחה!');
            } else {
                socket.emit('SignUpComplete', 1, 'דוא"ל כבר קיים. האם אתה משתמש רשום?');
            }
            db.close();
          });
  
            
        } catch (e) {
            console.log(e);
            socket.emit('SignUpComplete', 2, 'התרחשה תקלה');
        }
    });
};

this.SignUpBusiness = function (Business, socket){
    MongoClient.connect(url, function(err, db) {
           if (err) throw err;
        try {
           let mydb = db.db("Queue");

            mydb.collection("Business").insertOne(Business);
            socket.emit('SignUpBusinessComplete', 0, 'נירשמת בהצלחה!');
            db.close();
               
        } catch (e) {
            console.log(e);
            socket.emit('SignUpBusinessComplete', 2, 'התרחשה תקלה');
        }
    });
};
