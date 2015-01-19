/**
 * Created by airnold on 14. 11. 25..
 */
//stationfactory.js
angular.module('globus.service')
    .factory('$station_detail',['$http','$q','$window',function($http,$q,$window){
        var station_detail_data = {};
        station_detail_data.getstationdetaildata = function(stationno, region_code, stationid){
            var data = {};
            data.arsid = stationno;
            data.region_code = region_code;
            data.stationid = stationid;

            var defer = $q.defer();
            $http({
                url:'/stationDetail',
                method : 'POST',
                data : {'data' : data}
            }).success(function(data,status,headers, config){
                defer.resolve(data);
            }).error(function(data, status, headers, config){
                $window.alert(data);
            });
            return defer.promise;
        };
        return station_detail_data;
    }])
    .factory('currentStationnm',[function(){
        var current_stationnm = undefined;
        return {
            set_current_stationnm : function(stationnm){
                current_stationnm = stationnm;
            },
            get_current_stationnm : function(){
                return current_stationnm;
            }
        }
    }])
    .factory('currentArsid',[function(){
        var current_arsid= undefined;
        return {
            set_current_arsid : function(arsid){
                current_arsid = arsid;
            },
            get_current_arsid : function(){
                return current_arsid;
            }
        }
    }])
    .factory('currentStationid',[function(){
        var current_stationid = undefined;
        return {
            set_current_stationid : function(stationid){
                current_stationid = stationid;
            },
            get_current_stationid : function(){
                return current_stationid;
            }
        }
    }])
    .factory('gpsXYFac',[function(){
        var station_gps = undefined;
        return {
            set_station_gps : function(gpsx, gpsy){
                station_gps = {
                    stationX : gpsx,
                    stationY : gpsy
                }
            },
            get_station_gps : function(){
                return station_gps;
            }
        }
    }]);
