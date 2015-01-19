/**
 * Created by airnold on 14. 11. 23..
 */

/**
 * Created by airnold on 14. 11. 13..
 */
angular.module('globus.controller')
    .controller('routedetailController',['$scope','routedetaildata','$location','currentArsid', "cityCode", "currentRouteid",
        "$route_detail", "currentStationid", '$localStorage', "currentStationnm",
        function($scope,routedetaildata,$location,currentArsid, cityCode, currentRouteid, $route_detail, currentStationid,
                 $localStorage, currentStationnm){
            $scope.routeinfo = routedetaildata.routeinfo;
/*
            $scope.routeType = routedetaildata.routeinfo[0].routetype;
*/
            $scope.currentindex='0';
            $scope.positionCheck = true;

            var stationroute = routedetaildata.stationroute;
            var busposition_control = routedetaildata.busposition;

            /*//1:공항, 3:간선, 4:지선, 5:순환, 6:광역, 7:인천, 8:경기, 9:폐지, 0:공용
            if(cityCode.get_cityCode() == "11" ) { //서울버스의 routeType
                if($scope.routeType == "1") { //공항
                    $scope.routeTypeNm = "공항 버스";
                } else if($scope.routeType == "3") {
                    $scope.routeTypeNm = "간선 버스";
                } else if($scope.routeType == "4") {
                    $scope.routeTypeNm = "지선 버스";
                } else if($scope.routeType == "5") {
                    $scope.routeTypeNm = "순환 버스";
                } else if($scope.routeType == "6") {
                    $scope.routeTypeNm = "광역 버스";
                } else if($scope.routeType == "7") {
                    $scope.routeTypeNm = "인천 버스";
                } else if($scope.routeType == "8") {
                    $scope.routeTypeNm = "경기 버스";
                } else if($scope.routeType == "9") {
                    $scope.routeTypeNm = "폐지 버스";
                } else {
                    $scope.routeTypeNm = "공용 버스";
                }
            } else {

            }*/

            var temp=[];

            for(var i=0; i<stationroute[0].trnstnseq; i++){ //회차지 까지의 상행 정류장 추출
                temp.push(stationroute[i]);
            }
            $scope.glycheck = i-1;
            $scope.upstation = temp;

            temp = [];
            for(var j=stationroute.length-1; j>stationroute[0].trnstnseq-1; j--) { //종점부터 회차지 까지 하행정류장 추출
                temp.push(stationroute[j]);
            }
            $scope.downstation = temp;


            $scope.positionCheck_up = function(index){ //상행 정류장중 도착 예정 버스 표시
                if(busposition_control === undefined){
                    //에러 처리
                } else {
                    for(var i = 0; i<busposition_control.length; i++){
                        if(busposition_control[i].sectOrd === index){
                            $scope.plainNo = busposition_control[i].plainNo;
                            return true;
                        }
                    }
                }

            };
            $scope.positionCheck_down = function(index){ //하행 정류장중 도착 예정 버스 표시
                if(busposition_control === undefined){
                    //에러 처리
                } else {
                    for (var j = 0; j < busposition_control.length; j++) {
                        if (busposition_control[j].sectOrd === index) {
                            $scope.plainNo = busposition_control[j].plainNo;
                            return true;
                        }
                    }
                }
            };

            $scope.refresh_routeData = function(){
                return $route_detail.getroutedetaildata(currentRouteid.get_current_routeid(), cityCode.get_cityCode())
                    .then(function(data){
                        busposition_control = data.busposition;
                    })
            };

            $scope.gostationDetail = function(stationnm, arsid, stationid){
                var stationfac = currentStationid;

                currentStationnm.set_current_stationnm(stationnm);
                currentArsid.set_current_arsid(arsid);
                stationfac.set_current_stationid(stationid);

                $location.path('/stationsearch/stationdetail');
            };


            $scope.star_o = true;
            $scope.star = false;

            var route_storage = $localStorage.$default().route;

            if(route_storage !== undefined) {
                for (var i = 0; i < route_storage.length; i++) {
                    if (route_storage[i].routeId === currentRouteid.get_current_routeid()) { //localstorage에 이미 추가한 즐겨찾기가 있다면
                        $scope.star_o = false;
                        $scope.star = true;
                    }
                }
            }

            $scope.addBookmark = function(){ //localStorage에 저장.
                if(route_storage !== undefined) { //route 데이터가 존재하는 경우
                    var temp = {};
                    for (var i = 0; i < route_storage.length; i++) { //추가하려는 routeid가 존재하는지 검사
                        if(route_storage[i].routeId === currentRouteid.get_current_routeid()) {
                            break;
                        }
                    }

                    if(i === route_storage.length) { //for문을 다 돌음 -> 중복 데이터 없음! 데이터 추가!
                        temp.routeNm = routedetaildata.routeinfo[0].routenm;
                        temp.routeId = currentRouteid.get_current_routeid()
                        temp.cityCode = cityCode.get_cityCode();

                        route_storage.push(temp);
                        $scope.star_o = false;
                        $scope.star = true;
                    } else {
                        /*delete $localStorage.route[i];*/
                        $localStorage.route.splice(i, 1);

                        $scope.star_o = true;
                        $scope.star = false;
                    }

                } else { //undefined 이면 새로운 station 객체 생성
                    $localStorage.$default({ //route 데이터가 비어있는 경우
                        route : [
                            {
                                routeNm : routedetaildata.routeinfo[0].routenm,
                                routeId : currentRouteid.get_current_routeid(),
                                cityCode : cityCode.get_cityCode()
                            }
                        ]
                    });
                    $scope.star_o = false;
                    $scope.star = true;
                }
            }
        }]);