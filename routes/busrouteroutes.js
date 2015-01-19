/**
 * Created by airnold on 14. 10. 20..
 */

var express = require('express');
var busrouter = express.Router();
var nimblemodule = require('nimble');

var sdb = require('../server_js/models/DBselectfac.js');
var urlre = require('../server_js/service/urlrequest.js');

busrouter.post('/routeAutocomplete', function (req, res) {
    var getdata = req.param('data');
    var routenm = getdata.routeNm;
    var region_code = getdata.region_code;

    sdb.getRoutedata(routenm, region_code).then(function (data) {
        res.send(data);
    })
});

busrouter.post('/routeDetail', function (req, res) {
    var getdata = req.param('data');
    var routeid = getdata.routeid;
    var region_code = getdata.region_code;

    var routedata = {};
    nimblemodule.series([
        function (callback) {
            nimblemodule.parallel([
                function (callback) {
                    sdb.getstationbyroute(routeid, region_code).then(function (data) {

                        routedata.stationroute = data;
                        callback();
                    }).catch(function (data) {
                        routedata.routeinfo = 'nodata';
                        callback();
                    })
                },
                function (callback) {
                    sdb.getrouteinfo(routeid, region_code).then(function (data) {

                        routedata.routeinfo = data;
                        callback();
                    }).catch(function (data) {
                        routedata.routeinfo = 'nodata';
                        callback();
                    })
                },
                function (callback) {

                    urlre.getbusposition(routeid,region_code).then(function (data) {
                        routedata.busposition = data;

                        callback();
                    }).catch(function (data) {
                        routedata.busposition = 'nodata';
                        callback();
                    })
                }
            ], callback);
        },
        function (callback) {
            res.send(routedata);
            callback();
        }
    ]);
});

module.exports = busrouter;
