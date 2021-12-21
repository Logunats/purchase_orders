const path = require('path');
const config = require('./config');
const responseMessages = require('../middleware/response-message');
const mysql = require('mysql');

const connection = mysql.createPool(config.development);

connection.getConnection( (err, connection) => {
  if(err) {
    console.log(responseMessages[1002]);
  }
  else if(connection) {
    console.log(responseMessages[1001]);
  }
}) 

module.exports = connection;
