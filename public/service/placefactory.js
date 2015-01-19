/**
 * Created by airnold on 14. 11. 14..
 */
//placefactory.js
angular.module('globus.service')
    .factory('$place_search', ['$window', '$q', '$http', function ($window, $q, $http) {
        var placeobj = {};


        placeobj.place_search = function (data) {
            var defer = $q.defer();

            $http({
                url: '/place_search',
                method: 'POST',
                data: { 'data': data }
            }).success(function (data, status, headers, config) {
                placeobj.placesearchResult = data;
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        };
        return placeobj;
    }])
    .factory('place_data',[function(){
        var place_func = {};
        var place_data = {};


        place_func.setdata = function(placeobj){

            place_data = placeobj;
        };
        place_func.getdata = function(){
            return place_data;
        };
        place_func.getarsid = function(place_fname){
            var temp = place_fname.match(/\-?\d/g);
            var tempresult = temp.join("");
            var sameresult = {
                samedata : tempresult,
                arsidorstid : 'arsid'
            };
            return sameresult;
        };
        place_func.fid_arsid = function(fid,fname){
            if(typeof(fid) === "number" ){
                // fid O arsid X
                //data.samedata = place.pathList[0].fid[0];

                var sameresult = {
                    samedata : fid,
                    arsidorstid : 'stid'
                };
                return sameresult;
            }
            else if(typeof(fid) === "object" ){
                return this.getarsid(fname);

            }
        };
        return place_func;
    }])
    .factory('$place_detail', ['$window', '$q', '$http', function ($window, $q, $http) {
        var placedetail = {};


        placedetail.place_detail = function (data) {
            var defer = $q.defer();
            $http({
                url: '/place_detail',
                method: 'POST',
                data: { 'data': data }
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        };
        return placedetail;
    }])
    .factory('pathListFac',[function(){
        var pathList = undefined;
        return {
            set_pathlist : function(startname, endname){
                pathList = {
                    startname : startname,
                    endname : endname
                }
            },
            get_pathlist : function(){
                return pathList;
            }
        }
    }]);




