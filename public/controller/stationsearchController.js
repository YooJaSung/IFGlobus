/**
 * Created by airnold on 14. 11. 13..
 */
angular.module('globus.controller')
    .controller('stationsearchController',['$scope','$auto_complete','$location','currentArsid', 'cityCode', "currentStationid",
        "gpsXYFac", "currentStationnm", '$modal', '$http', '$localStorage',
        function($scope,$auto_complete,$location,currentArsid, cityCode, currentStationid, gpsXYFac,
                 currentStationnm, $modal, $http, $localStorage){ //cityCode는 지역코드 setget하는 factory
            $scope.check = false;
            $scope.route_autocomplete_datas = {};
            $scope.region_code=undefined; //지역코드
            $scope.region_title = "지역선택";
            $scope.region_code="11"; //지역코드

            var flag = 2, i;
            var temp=[];
            $scope.update = function(){
                if($scope.search.$ == ""){
                    $scope.check = false;
                }
                else{
                    if($scope.region_title !== "지역선택") { //지역 선택을 완료해야 검색 가능하도록
                        $scope.check = true;
                        if ($scope.search.$.length == 2) {
                            $auto_complete.getAutocomplete($scope.search.$, flag, $scope.region_code).then(function(data){
                                for(i=0; i<data.length; i++){ //서울권과 경기권 정류소를 비교하기위한 for문
                                    if(data[i].arsid !== "0") {
                                        temp.push(data[i]);
                                    }
                                }
                                $scope.route_autocomplete_datas = temp;

                            });
                        }
                    } else {
                        alert("지역을 선택해 주세요");
                    }
                }
            };

            $scope.gostationDetail = function(stationnm, region_code, arsid, stationid, latx, longy){
                console.log("regionCode in gostationdetail : " + region_code);
                var cityfac = cityCode;
                var stationfac = currentStationid;

                currentStationnm.set_current_stationnm(stationnm);
                currentArsid.set_current_arsid(arsid);
                cityfac.set_cityCode(region_code);
                stationfac.set_current_stationid(stationid);

                gpsXYFac.set_station_gps(longy, latx);

                $location.path('/stationsearch/stationdetail');
            };

            //지역코드 읽어오는 부분
            $http.get('region.json').success(function(data){
                $scope.items = data;
            });

            $scope.open = function (size) {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {
                        items : function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (item) {
                    console.log("region_title : " + item.regionNm);
                    console.log("region_code : " + item.regionCode);
                    $scope.region_title = item.regionNm;
                    $scope.region_code = item.regionCode
                });
            };

            $scope.addBookmark = function(){

            }
        }]);