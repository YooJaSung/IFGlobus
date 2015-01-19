/**
 * Created by airnold on 2014. 9. 22..
 */
var pool = require('../dbPool.js');
var con = require('../../config.js');

var q = require('q');
var selectdb = {};
/*
 get autocomplete route data.
 */
selectdb.getRoutedata = function(routenm,region_code){
    var deferred = q.defer();
    pool.getConnection(function(err,db){
        if(err){
            throw err;
        }
        else{
            var sql = con.query.getRoutedata;

            db.query(sql,[region_code, routenm+"%"],function(err,rows){
                //pool.release(db);
                db.release();

                if(err){

                    throw err;
                }
                else{

                    deferred.resolve(rows);

                }
            });
        }
    });
    return deferred.promise;
};

/*
 get autocomplete station data.
 */
selectdb.getStationdata = function(stationnm, region_code){
    var deferred = q.defer();
    var sql = con.query.getStationdata;


    pool.getConnection(function(err,db){
        if(err){
            throw err;
        }
        else{
            db.query(sql,[region_code, stationnm+"%"],function(err,rows){
                db.release();
                if(err){

                    throw err;
                }
                else{

                    deferred.resolve(rows);
                }
            });
        }
    });


    return deferred.promise;
};

/*
 get gpsx & gpsy data for draw arrow direction.
 */
selectdb.selectdirectionxy = function(routeid,sx,sy){

    var deferred = q.defer();
    pool.getConnection(function(err,db){
        if(err){

            throw err;
        }
        else{

            var xyquery = con.query.selectDirectionXY;


            db.query(xyquery,[routeid,sx,sy,routeid,sx,sx, sy, sy],function (err, rows) {
                db.release();
                if (err) {


                    throw err;
                }
                else {
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/*
 get bus infomation stid arsid routeid from database (samedata, routeid, tempresult)
 */
selectdb.getbusinfo = function(samedata, routeid, tempresult){
    var deferred = q.defer();

    if(samedata.arsidorstid === 'arsid'){
        var strquery = con.query.getBusinfousingArsid;
    }else{
        var strquery = con.query.getBusinfousingStid;
    }


    pool.getConnection(function(err,db){
        if(err){

            throw err;
        }
        else{

            db.query(strquery,[samedata.samedata,routeid,"%"+tempresult+"%"],function(err,rows){
                db.release();
                if(err){

                    throw err;
                }
                else{

                    deferred.resolve(rows);
                }
            });
        }
    });

    return deferred.promise;
};



selectdb.getstationbyroute = function(routeid, region_code){
    var deferred = q.defer();
    var stationbyroute = con.query.getStationbyroute;


    pool.getConnection(function(err,db){
        if(err){

            throw err;
        }
        else{

            db.query(stationbyroute,[region_code, routeid, region_code, routeid],function(err,rows,columns){
                db.release();
                if(err){

                    throw err;
                }
                else{

                    deferred.resolve(rows);
                }
            });
        }
    });

    return deferred.promise;
};

selectdb.getrouteinfo = function(routeid, region_code){
    var deferred = q.defer();
    var routeinfo = con.query.getRouteinfo;


    pool.getConnection(function(err,db){
        if(err){

            throw err;
        }
        else{

            db.query(routeinfo,[region_code, routeid],function(err,rows){
                db.release();
                if(err){

                    throw err;
                }
                else{

                    deferred.resolve(rows);
                }
            });
        }
    });

    return deferred.promise;
};

selectdb.gyeonggi_bus_routenm = function(str,region_code, stationid){
    var deferred = q.defer();
    pool.getConnection(function(err,db){
        if(err){
            throw err;
        }
        else{
            var sql = con.query.gyeonggi_Bus_routenm + str;

            db.query(sql,[region_code,stationid],function(err,rows){

                db.release();

                if(err){

                    throw err;
                }
                else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

selectdb.getstaionXY = function(stationid, region_code){
    var deferred = q.defer();
    pool.getConnection(function(err,db){
        if(err){
            throw err;
        }
        else{
            var sql = con.query.stationXY;

            db.query(sql,[region_code,stationid],function(err,rows){

                db.release();

                if(err){

                    throw err;
                }
                else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

selectdb.getaroundXY = function(region_code,stationXY){
    var deferred = q.defer();
    pool.getConnection(function(err,db){
        if(err){
            throw err;
        }
        else{
            var sql = con.query.aroundXY;
            db.query(sql,[region_code,stationXY[0].stationX,stationXY[0].stationY, stationXY[0].stationX],function(err,rows){

                db.release();

                if(err){
                    throw err;
                }
                else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

module.exports = selectdb;
