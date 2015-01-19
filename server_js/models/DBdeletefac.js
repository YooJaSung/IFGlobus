/**
 * Created by airnold on 2014. 9. 22..
 */
var pool = require('../dbPool.js');
var cachejs = require('../cache_module.js');
var tempdb;
pool.acquire(function(err,db){
    if(err){
        throw err;
    }
    else{
        tempdb = db;
    }
});
