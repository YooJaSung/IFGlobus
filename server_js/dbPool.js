
var con = require('../config.js');
var mysql = require('mysql');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : con.database.host,
    user     : con.database.user,
    password : con.database.password,
    database : con.database.dbname
});

module.exports = pool;



