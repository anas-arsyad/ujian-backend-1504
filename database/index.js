const mysql = require("mysql")

// setup mysql
const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3307,
    user     : 'root',
    password : 'salatiga123',
    database : 'backend_2021'
  });

 

  module.exports= connection