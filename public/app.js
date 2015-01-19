/**
 * Created by airnold on 14. 11. 13..
 */
angular.module('globus', [
    "globus.controller",
    "globus.directive",
    "globus.service",
    "ngRoute"
])
    .config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/bookmark', {
                templateUrl:'views/bookmark/bookmark.html',
                controller : 'bookmarkController'
            })
            .when('/placesearch', {
                templateUrl:'views/place/placesearch.html',
                controller : 'placesearchController'
            })
            .when('/placesearch/placedetail', {
                templateUrl : 'views/place/placedetail.html',
                controller : 'placedetailController',
                resolve : {
                    placedetaildata : function(place_data,$place_detail){
                        var data = {};
                        var place = place_data.getdata();

                        data.samedata = place_data.fid_arsid(place.pathList[0].fid[0],place.pathList[0].fname[0]);
                        data.routeid = place.pathList[0].routeId[0];
                        data.routenm = place.pathList[0].routeNm[0];
                        data.fx = place.pathList[0].fx[0];
                        data.fy = place.pathList[0].fy[0];

                        return $place_detail.place_detail(data).then(function(data){
                            return data;
                        });
                    }
                }
            })
            .when('/routesearch',{
                templateUrl : 'views/route/routesearch.html',
                controller : 'routesearchController'
            })
            .when('/routesearch/routedetail',{
                templateUrl : 'views/route/routedetail.html',
                controller : 'routedetailController',
                resolve : {
                    routedetaildata : function(cityCode, currentRouteid, $route_detail){
                        return $route_detail.getroutedetaildata(currentRouteid.get_current_routeid(), cityCode.get_cityCode())
                            .then(function(data){
                            return data;
                        })
                    }
                }
            })
            .when('/stationsearch',{
                templateUrl : 'views/station/stationsearch.html',
                controller : 'stationsearchController'
            })
            .when('/stationsearch/stationdetail',{
                templateUrl : 'views/station/stationdetail.html',
                controller : 'stationdetailController',
                resolve : {
                    stationdetaildata : function(currentStationid, cityCode, currentArsid, $station_detail){
                        return $station_detail.getstationdetaildata(currentArsid.get_current_arsid(), cityCode.get_cityCode(), currentStationid.get_current_stationid())
                            .then(function(data){
                            return data;
                        })
                    }
                }
            })
            .otherwise({redirectTo : '/'});

    }]);

angular.module('globus.controller',
    [
        "google.places",
        "ngMap",
        "ui.bootstrap",
        "ngStorage"
    ]);

angular.module('globus.directive', []);

angular.module('globus.service', []);

