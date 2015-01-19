/**
 * Created by airnold on 14. 11. 13..
 */
angular.module('globus.controller')
    .controller('routesearchController',['$scope','$auto_complete','currentRouteid','$location', 'cityCode', '$modal', '$http',
        function($scope,$auto_complete,currentRouteid,$location, cityCode, $modal, $http){
            $scope.check = false;
            $scope.route_autocomplete_datas = {};
            $scope.region_title = "지역선택";
            $scope.region_code="11"; //지역코드
            var flag = 1;

            $scope.update = function(){
                if($scope.search.$ == ""){
                    $scope.check = false;
                }
                else{
                    if($scope.region_title !== "지역선택"){ //지역 선택을 완료해야 검색 가능하도록
                        $scope.check = true;
                        if ($scope.search.$.length == 1) {
                            $auto_complete.getAutocomplete($scope.search.$, flag, $scope.region_code).then(function(data){
                                $scope.route_autocomplete_datas = data;
                            });
                        }
                    } else {
                        alert("지역을 선택해 주세요");
                    }
                }
            };

            $scope.goRouteDetail = function(routeid, region_code){
                var routeidfac = currentRouteid;
                var cityfac = cityCode;
                routeidfac.set_current_routeid(routeid);
                cityfac.set_cityCode(region_code);
                $location.path('/routesearch/routedetail');
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

        }]);