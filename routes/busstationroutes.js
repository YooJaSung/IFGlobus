/**
 * Created by airnold on 14. 10. 20..
 */


var express = require('express');
var busstation = express.Router();
var nimblemodule = require('nimble');

var sdb = require('../server_js/models/DBselectfac.js');
var urlre = require('../server_js/service/urlrequest.js');
var format = require('../server_js/service/urlformatting.js');

busstation.all('/stationAutocomplete', function(req,res){
    var getdata = req.param('data');
    var stationnm = getdata.stationNm;
    var region_code = getdata.region_code;

    sdb.getStationdata(stationnm, region_code).then(function(data){

        res.send(data);
    })
});

busstation.all('/stationDetail', function(req,res){
    var getdata = req.param('data');
    var arsid = getdata.arsid;
    var stationid = getdata.stationid;
    var region_code = getdata.region_code;
    var stationdata = {};



    nimblemodule.series([
        function(callback){
            nimblemodule.parallel([
                function(callback) {
                    sdb.getstaionXY(stationid,region_code).then(function(data){
                        stationdata.stationXY = data;

                        callback();
                    })
                },
                function(callback){
                    urlre.getstationinfo(arsid,stationid,region_code).then(function(data){
                        stationdata.stationinfo = data;
                        callback();

                    });
                }
            ],callback);
        },
        function(callback){
            sdb.getaroundXY(region_code, stationdata.stationXY).then(function(data){
                stationdata.aroundXY = data;
                callback();
            })
        },
        function(callback){

            res.send(stationdata);
            callback();
        }
    ]);

});

module.exports = busstation;