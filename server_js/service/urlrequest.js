/**
 * Created by airnold on 2014. 9. 22..
 */
// modules
var request = require('request');
var trim = require('trim');
var q = require('q');
var parser = require('xml2json');

//server_js
var con = require('../../config.js');
var cachejs = require('../cache_module.js');
var format = require('./urlformatting.js');


var urlrequestvalue = {};

/*
 get place search data. first request -> cache setting. after second not income here
 */
urlrequestvalue.getplacesearch = function (sy, sx, ey, ex, tempcachename) {
    var deferred = q.defer();
    var short_time = {};
    var short_distance = {};
    var tempcachename = tempcachename;

    var option = {
        url: con.urlrequest.getPlacesearch +
        "&startX=" + sy + "&startY=" + sx + "&endX=" + ey + "&endY=" + ex
    };

    request(option, function (error, response, body) {

        if (error) {
            console.log(error);
            throw error;
        }
        else {

            var xmldata = body;
            var options = {
                object: true,
                sanitize: false,
                arrayNotation: true
            };

            var result = parser.toJson(xmldata, options);

            var result_msgbody = result.ServiceResult[0].msgBody[0];

            /*console.log(result.ServiceResult[0].msgBody.length);*/

            var result_itemlist = result_msgbody.itemList;

            if(result_itemlist === undefined){

                deferred.resolve('nodata');

            }
            else {
                var count = Object.keys(result_itemlist).length;


                var mini = 0;
                var min = 0;
                var sn = 0;

                if (count == 1) {
                    short_time = result_itemlist[0];
                    console.log(short_time.pathList[0]);
                    cachejs.set(tempcachename, {
                        'short_time': short_time,
                        'short_distance': 'nodata'
                    }, function (err, data) {
                    });
                    deferred.resolve({'short_time': short_time, 'short_distance': 'nodata'});
                }
                else {
                    short_time = result_itemlist[0];

                    min = result_itemlist[0].distance[0];
                    mini = 0;

                    for (var i in result_itemlist) {
                        min *= 1;
                        sn = result_itemlist[i].distance[0];
                        sn *= 1;
                        if (min > sn) {
                            min = sn;
                            mini = i;
                        }
                    }
                    if (mini == 0) {
                        //short_time == short_distance
                        cachejs.set(tempcachename, {
                            'short_time': short_time,
                            'short_distance': 'same'
                        }, function (err, data) {
                        });
                        deferred.resolve({'short_time': short_time, 'short_distance': 'same'});
                    }
                    else {
                        short_distance = result_itemlist[mini];
                        cachejs.set(tempcachename, {
                            'short_time': short_time,
                            'short_distance': short_distance
                        }, function (err, data) {
                        });
                        deferred.resolve({'short_time': short_time, 'short_distance': short_distance});

                    }
                }
            }
        }
    });
    return deferred.promise;
};

/*
 get realtime data
 */
urlrequestvalue.getrealtimedata = function (stid, routeid, ord) {

    var deferred = q.defer();
    var getrealtime = {
        url: con.urlrequest.getRealtimedata +
        "&busRouteid=" + routeid + "&stid=" + stid + "&ord=" + ord
    };



    request(getrealtime, function (error, response, body) {
        if (error) {
            throw error;
        }
        else {
            var xmldata = body;
            var options = {
                object: true,
                sanitize: false
            };
            var result = parser.toJson(xmldata, options);

            var tempre = result.ServiceResult.msgBody;
            var itemlisttemp = tempre.itemList;
            deferred.resolve(itemlisttemp);
        }
    });
    return deferred.promise;
};


//////////////////////////////// get station infomation /////////////////////////////////////////////////////////////////
urlrequestvalue.getstationinfo = function (arsid, stationid, region_code) {
    var deferred = q.defer();

    if (region_code === '31') {



        var getstationinfo = {

            url: con.urlrequest.getstationinfo_Gyeonggi +
            "&stationId=" + stationid
        };
    } else {

        var getstationinfo = {
            url: con.urlrequest.getstationinfo_Seoul +
            "&arsId=" + arsid
        };
    }

    request(getstationinfo, function (error, response, body) {
        if (error) {
            throw error;
        }
        else {
            var xmldata = body;
            var options = {
                object: true,
                sanitize: false,
                arrayNotation: true
            };
            var result = parser.toJson(xmldata, options);


            if (region_code === '31') {

                if (result.response[0].msgBody === undefined) {

                    var result_itemList = 'nodata';
                }
                else {
                    var tempre = result.response[0].msgBody[0];
                    var result_itemList = format.gyeonggi_bus_formatting(tempre.busArrivalList, stationid, region_code);
                }

            } else {
                var tempre = result.ServiceResult[0].msgBody[0];
                var result_itemList = format.seoul_bus_formatting(tempre.itemList);
            }

            deferred.resolve(result_itemList);
        }
    });
    return deferred.promise;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
 bus position data get request

 버스위치정보조회 서비스

 getBusPosByRtidList
 노선ID로 차량들의 위치정보를 조회한다

 */
urlrequestvalue.getbusposition = function (routeid, region_code) {
    var deferred = q.defer();
    console.log(routeid);
    if (region_code === '31') {
        //경기도
        var getbusposition = {
            url: con.urlrequest.getgyeonggiBusposition +
            "&routeId=" + routeid
        };

    } else {
        //서울
        var getbusposition = {
            url: con.urlrequest.getseoulBusposition +
            "&busRouteId=" + routeid
        };
    }


    request(getbusposition, function (error, response, body) {
        if (error) {
            throw error;
        }
        else {
            var xmldata = body;
            var options = {
                object: true,
                sanitize: false,
                arrayNotation: true

            };
            var result = parser.toJson(xmldata, options);

            if (region_code === '31') {

                if (result.response[0].msgBody === undefined) {

                    var result_itemList = 'nodata';
                }
                else {
                    var tempre = result.response[0].msgBody[0];


                    var result_itemList = format.gyeonggi_busroute_formatting(tempre.busLocationList);
                }
            } else {
                var tempre = result.ServiceResult[0].msgBody[0];

                var result_itemList = format.seoul_busroute_formatting(tempre.itemList);
            }
            deferred.resolve(result_itemList);
        }
    });
    return deferred.promise;

};

module.exports = urlrequestvalue;