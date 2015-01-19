/**
 * Created by kimsungwoo on 15. 1. 14..
 */

angular.module('globus.controller')
    .controller('bookmarkController',['$scope','$localStorage', 'currentRouteid', 'cityCode', '$location', 'currentArsid',
        'currentStationid', 'currentStationnm',
        function($scope, $localStorage, currentRouteid, cityCode, $location, currentArsid, currentStationid, currentStationnm) {
            var storage = $localStorage.$default();
            $scope.routeMain_div = false;
            $scope.stationMain_div = false;
            $scope.alert_div = false;

            if(storage.route === undefined && storage.station === undefined){
                $scope.alert_div = true;
                $scope.routeMain_div = false;
                $scope.stationMain_div = false;
                $scope.bookmarkMessage = "즐겨찾기가 존재하지 않습니다. 자주 사용하는 노선과 정류소를 추가해 주세요";
            } else if(storage.station === undefined && storage.route !== undefined){ //route만 존재하는 경우
                $scope.alert_div = false;
                $scope.routeMain_div = true;
                $scope.staionMain_div = false;
            } else if(storage.route === undefined && storage.station !== undefined) {
                $scope.alert_div = false;
                $scope.routeMain_div = false;
                $scope.stationMain_div = true;

            } else {
                $scope.alert_div = false;
                $scope.routeMain_div = true;
                $scope.stationMain_div = true;
            }

            //노선
            $scope.routeData = storage.route;
            $scope.bookmarkRoute_click = function(routeNm, routeId, getCitycode) {
                currentRouteid.set_current_routeid(routeId);
                cityCode.set_cityCode(getCitycode);
                $location.path('/routesearch/routedetail');
            }

            //정류소
            $scope.stationData = storage.station;
            $scope.bookmarkStation_click = function(stationNm, arsId, getCitycode, stationId) {
                currentStationnm.set_current_stationnm(stationNm);
                currentArsid.set_current_arsid(arsId);
                cityCode.set_cityCode(getCitycode);
                currentStationid.set_current_stationid(stationId);

                $location.path('/stationsearch/stationdetail');
            }

            $scope.routeData_remove = function(routeId){
                for (var i = 0; i < storage.route.length; i++) { //추가하려는 routeid가 존재하는지 검사
                    if(storage.route[i].routeId === routeId) {
                        $localStorage.route.splice(i, 1);
                        break;
                    }
                }
                if(!storage.route.length) { //배열이 비어있는것 확인
                    delete $localStorage.route;
                    $scope.routeMain_div = false;
                    if(storage.station === undefined) {
                        $scope.alert_div = true;
                        $scope.bookmarkMessage = "즐겨찾기가 존재하지 않습니다. 자주 사용하는 노선과 정류소를 추가해 주세요";
                    }
                }
            }

            $scope.stationData_remove = function(stationId){
                for (var i = 0; i < storage.station.length; i++) { //추가하려는 routeid가 존재하는지 검사
                    if(storage.station[i].stationId === stationId) {
                        $localStorage.station.splice(i, 1);
                        break;
                    }
                }
                if(!storage.station.length) { //배열이 비어있는것 확인
                    delete $localStorage.station;
                    $scope.stationMain_div = false;
                    if(storage.route === undefined) {
                        $scope.alert_div = true;
                        $scope.bookmarkMessage = "즐겨찾기가 존재하지 않습니다. 자주 사용하는 노선과 정류소를 추가해 주세요";
                    }
                }
            }
        }]);
