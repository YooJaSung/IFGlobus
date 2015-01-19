/**
 * Created by airnold on 14. 11. 25..
 */

angular.module('globus.controller')
    .controller('stationdetailController',['$scope','$auto_complete','$location','stationdetaildata','currentRouteid',
        '$station_detail', 'currentArsid', "gpsXYFac", "cityCode", "currentStationid", "currentStationnm", "$route",'$localStorage',
        function($scope,$auto_complete,$location,stationdetaildata,currentRouteid, $station_detail, currentArsid,
                 gpsXYFac, cityCode, currentStationid, currentStationnm, $route, $localStorage){

            $scope.stationDetail = stationdetaildata.stationinfo;
            $scope.region_code = cityCode.get_cityCode();
            $scope.showValue = false;
            $scope.getStationNm = currentStationnm.get_current_stationnm();
            $scope.center = {
                position : [stationdetaildata.stationXY[0].stationY, stationdetaildata.stationXY[0].stationX]
            };

            $scope.non_busstops = stationdetaildata.aroundXY;

            $scope.click = function(event, stationnm, arsid, stationid, longy, latx) { //event객체는 directive에는 표시되지 않지만 컨트롤로에서는 표시해 주어야함.

                currentStationnm.set_current_stationnm(stationnm);
                currentArsid.set_current_arsid(arsid);
                cityCode.set_cityCode(cityCode.get_cityCode());
                currentStationid.set_current_stationid(stationid);

                gpsXYFac.set_station_gps(longy, latx);
                $route.reload();

            };

            $scope.goRouteDetail = function(routeid){
                currentRouteid.set_current_routeid(routeid);
                cityCode.set_cityCode(cityCode.get_cityCode());
                $location.path('/routesearch/routedetail');
            };

            $scope.refresh = function(){ //stationno, region_code, stationid
                $station_detail.getstationdetaildata(currentArsid.get_current_arsid(), cityCode.get_cityCode(), currentStationid.get_current_stationid()).then(function(data){
                    $scope.stationDetail = data.stationinfo;
                });
            };

            $scope.star_o = true;
            $scope.star = false;

            var station_storage = $localStorage.$default().station;

            if(station_storage !== undefined) {
                for (var i = 0; i < station_storage.length; i++) {
                    if (station_storage[i].stationId === currentStationid.get_current_stationid()) { //localstorage에 이미 추가한 즐겨찾기가 있다면
                        $scope.star_o = false;
                        $scope.star = true;
                    }
                }
            }

            $scope.addBookmark = function(){ //localStorage에 저장.
                if(station_storage !== undefined) { //station 데이터가 존재하는 경우
                    var temp = {};
                    for (var i = 0; i < station_storage.length; i++) { //추가하려는 stationid가 존재하는지 검사
                        if(station_storage[i].stationId === currentStationid.get_current_stationid()) {
                            break;
                        }
                    }

                    if(i === station_storage.length) { //for문을 다 돌음 -> 중복 데이터 없음! 데이터 추가!
                        temp.stationNm = currentStationnm.get_current_stationnm();
                        temp.arsId = currentArsid.get_current_arsid();
                        temp.cityCode = cityCode.get_cityCode();
                        temp.stationId = currentStationid.get_current_stationid();

                        station_storage.push(temp);
                        $scope.star_o = false;
                        $scope.star = true;
                    } else {
                        $localStorage.station.splice(i, 1);

                        $scope.star_o = true;
                        $scope.star = false;
                    }

                } else { //undefined 이면 새로운 station 객체 생성
                    $localStorage.$default({ //station 데이터가 비어있는 경우
                        station : [
                            {
                                stationNm : currentStationnm.get_current_stationnm(),
                                arsId : currentArsid.get_current_arsid(),
                                cityCode : cityCode.get_cityCode(),
                                stationId : currentStationid.get_current_stationid()
                            }
                        ]
                    });
                    $scope.star_o = false;
                    $scope.star = true;
                }
            }

        }]);
