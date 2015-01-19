/**
 * Created by airnold on 14. 11. 23..
 */
/**
 * Created by airnold on 14. 11. 21..
 */
//routefactory.js
//routefactory --> $q를 통해 현재 노선 정보를 가져옴.
angular.module('globus.service')
    .factory('$route_detail',['$http','$q','$window',function($http,$q,$window){
        var route_detail_data = {};
        route_detail_data.getroutedetaildata = function(routeid, region_code){
            var data = {};
            data.routeid = routeid;
            data.region_code = region_code;
            var defer = $q.defer();
            $http({
                url:'/routeDetail',    //http://121.184.187.5:3000/gettempdata
                method : 'POST',
                data : {'data' : data}
            }).success(function(data,status,headers, config){
                defer.resolve(data);
            }).error(function(data, status, headers, config){
                $window.alert(data);
            });
            return defer.promise;
        };
        return route_detail_data;
    }])
    .factory('currentRouteid',[function(){
        var current_routeid = undefined;
        return {
            set_current_routeid : function(routeid){
                current_routeid = routeid;
            },
            get_current_routeid : function(){
                return current_routeid;
            }
        }
    }])
    .factory('cityCode',[function(){
        var city_code = undefined;
        return {
            set_cityCode: function(region_code){
                city_code = region_code;
            },
            get_cityCode : function(){
                return city_code;
            }
        }
    }]);