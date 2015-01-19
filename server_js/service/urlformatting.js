/**
 * Created by airnold on 14. 12. 23..
 */

var formatting = {};

var sdb = require('../models/DBselectfac.js');
var nimblemodule = require('nimble');
var q = require('q');



formatting.gyeonggi_bus_formatting = function(data, stationid, region_code){
    var returndata = [];
    var routenm =[];
    var routeidstr = "";
    var deferred = q.defer();


    nimblemodule.series([
        function(routenamecallback){
            routeidstr = "(";

            for(var i in data){
                if(i < data.length-1){
                    routeidstr += data[i].routeId[0]+",";
                }
                else{
                    routeidstr += data[i].routeId[0] +")";
                }
            }
            routenamecallback();

        },
        function(getroutenamecallback){
            sdb.gyeonggi_bus_routenm(routeidstr,region_code, stationid).then(function(data){
                routenm = data;

                getroutenamecallback();
            }).catch(function(data){
                routenm = data;
                getroutenamecallback();
            });
        },
        function(formattingcallback){
            for(var i in routenm){
                for(var j in data){
                    if(routenm[i].routeid === data[j].routeId[0]){
                        var tempjson={};
                        tempjson.routenm = routenm[i].routenm;
                        tempjson.routeid = data[j].routeId[0];
                        tempjson.predicttime = data[j].predictTime1[0];
                        tempjson.lastbus = data[j].drvEnd[0];
                        if(data[j].drvEnd[0] == 'N'){
                            tempjson.lastbus = 0;
                        }
                        else{
                            tempjson.lastbus = 1;
                        }
                        tempjson.routeType = 0;

                        tempjson.sectionord = data[j].locationNo1[0];
                        returndata.push(tempjson);
                    }
                }
            }
            deferred.resolve(returndata);
            formattingcallback();
        }
    ]);
    return deferred.promise;
};

formatting.seoul_bus_formatting = function(data){

    var returndata = [];

    for (var i in data) {
        var tempjson={};
        tempjson.routenm = data[i].rtNm[0];
        tempjson.predicttime = data[i].traTime1[0];
        tempjson.lastbus = data[i].isLast1[0];
        tempjson.routeid = data[i].busRouteId[0];

        tempjson.sectionord = data[i].sectOrd1[0];
        tempjson.routeType = data[i].routeType[0];
        returndata.push(tempjson);
    }

    return returndata;
};



formatting.gyeonggi_busroute_formatting = function(data){
    var returndata = [];
    for(var i in data){
        var tempjson = {};
        tempjson.sectOrd = data[i].stationSeq[0];
        tempjson.plainNo = data[i].plateNo[0];
        returndata.push(tempjson);
    }
    return returndata;
};

formatting.seoul_busroute_formatting = function(data){
    var returndata = [];
    for(var i in data){
        var tempjson = {};
        tempjson.sectOrd = data[i].sectOrd[0];
        tempjson.plainNo = data[i].plainNo[0];
        returndata.push(tempjson);
    }
    return returndata;
};

module.exports = formatting;