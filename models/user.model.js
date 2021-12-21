const connection = require('../config/db-connect');

const User = function(user){
    this.name = user.name;
    this.mobile = user.mobile;
    this.email = user.email;
    this.password = user.password;
    this.cdate = user.cdate;
    this.mdate = user.mdate;
    this.is_active = user.is_active;
}

User.getUsers = function(result){
    connection.query("SELECT * FROM user WHERE is_active=1 order by id desc",(err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("users : ", res);
        result(null, res);
    });
}

User.getUserById = function(user_id, result){
    connection.query(`SELECT * FROM user WHERE is_active=1 and id = ${user_id} order by id desc`,(err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("users : ", res);
        result(null, res);
    });
}

User.getUserByName = function(user_id, result){
    connection.query(`SELECT * FROM user WHERE is_active=1 and name = ${user_id} order by id desc`,(err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("users : ", res);
        result(null, res);
    });
}

User.getUserByEmail = function(usrEmail, usrPhone, result){
    connection.query(`SELECT * FROM user WHERE is_active=1 and (email= '${usrEmail}' or mobile=${usrPhone})`,(err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("users : ", res);
        result(null, res);
    });
}

User.createUser = function(data, result){
    connection.query("insert into user set ?", data, (err, rows) => {
        if(err){
            result(err, null)
        } else {
            console.log("rows", rows)
            result(null, rows)
        }
    })
}

User.validateLogin = function(usrEmail, usrPassword, result){
    connection.query(`select * from user where is_active = 1 and (email = '${usrEmail}' or mobile = '${usrEmail}') and password = '${usrPassword}'`, (err, rows) => {
        if(err){
            console.log("Error", err)
            result(null, err)
        } else if(!rows.length){
            result(null, false)
        } else if(!(rows[0].password == usrPassword)){
            result(null, false)
        } else {
            result(null, rows)
        }
    })
}

module.exports = User;