/**
 * Created by airnold on 14. 11. 21..
 */
//autocompletefactory.js
angular.module('globus.service')
    .factory('$auto_complete',['$http','$q','$window',function($http,$q,$window){
        var factory = {};
        factory.getAutocomplete = function(outerdata, flag, region_code){
            var autocomplete_datas = {};
            var data = {};
            var urlsetting = null;
            if(flag === 1){
                data.routeNm = outerdata;
                data.region_code = region_code;
                urlsetting = 'http://121.184.187.5:3000/routeAutocomplete';
            }else if(flag === 2){
                data.stationNm = outerdata;
                data.region_code = region_code;
                urlsetting = 'http://121.184.187.5:3000/stationAutocomplete';
            }

            var defer = $q.defer();
            $http({
                url:urlsetting,    //http://121.184.187.5:3000/gettempdata
                method : 'POST',
                data : {'data' : data}
            }).success(function(data,status,headers, config){
                defer.resolve(data);
            }).error(function(data, status, headers, config){
                $window.alert(data);
            });
            return defer.promise;
        };
        return factory;
    }]);