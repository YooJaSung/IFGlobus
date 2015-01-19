/**
 * Created by airnold on 14. 10. 20..
 */
var express = require('express');
var placerouter = express.Router();

var request = require('request');
var trim = require('trim');
var nimblemodule = require('nimble');
var cachejs = require('../server_js/cache_module.js');

//db fac get
var sdb = require('../server_js/models/DBselectfac.js');

//service fac get
var urlre = require('../server_js/service/urlrequest.js');





placerouter.post('/place_search', function(req,res){

    //data = start_Keyword, start_X, start_Y, end_Keyword, end_X, end_Y

    /*
     when request come lookup session. session name is sname+ename value
     session have route infomation. so more fast response better then url request and will reduce traffic number
     */
    var getdata = req.param('data');

    var sx = getdata.startX;
    var sy = getdata.startY;
    var ex = getdata.endX;
    var ey = getdata.endY;
    var sname = getdata.start_name;
    var ename = getdata.end_name;
    var tempcachename = sname+ename;

    cachejs.get(tempcachename,function(err,data){
        if(err){
            urlre.getplacesearch(sy,sx,ey,ex,tempcachename).then(function(data){
                res.send(data);
            }).catch(function(data){
                res.send(data);
            });
        }
        else{

            res.send(data);
        }
    })
});

placerouter.post('/place_detail', function(req,res){

    var getdata = req.param('data');

    var samedata = getdata.samedata;
    var routeid = getdata.routeid;
    var routenm = getdata.routenm;
    var sx = getdata.fx;
    var sy = getdata.fy;


    var temp = routenm.match(/\-?\d/g);
    var tempresult = temp.join("");


    var businfo = {};
    var alldata = {};

    nimblemodule.series([
       function(businfocallback){
           //db select samedata & routeid -> businfo
           sdb.getbusinfo(samedata,routeid,tempresult).then(function(data){

               businfo = data;
               businfocallback();

           }).catch(function(data){
               businfo = data;
               businfocallback();
           })
       },
       function(parellelcallback){
           //parallel
           nimblemodule.parallel([
               function(realtimecallback){
                   urlre.getrealtimedata(businfo[0].station,businfo[0].busrouteid,businfo[0].seq).then(function(data){
                       alldata.timedata = data;


                       realtimecallback();
                   }).catch(function(data){
                       alldata.timedata = data;
                       realtimecallback();
                   })
               },
               function(routecallback){
                   sdb.selectdirectionxy(businfo[0].busrouteid,sx,sy).then(function(data){
                       alldata.routexy = data;

                       routecallback();
                   }).catch(function(data){
                       alldata.routexy = data;
                       routecallback();
                   })
               }
           ],parellelcallback);
       },
       function(rescallback){
           res.send(alldata);
           rescallback();

       }
    ]);
});

module.exports = placerouter;