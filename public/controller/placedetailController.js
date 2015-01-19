/**
 * Created by airnold on 14. 11. 17..
 */
angular.module('globus.controller')
    .controller('placedetailController', ['$scope', '$routeParams', 'place_data', 'placedetaildata', '$place_detail',
            'pathListFac',
        function ($scope, $routeParams, place_data, placedetaildata, $place_detail, pathListFac) {

            //navbar상단에 검색한 경로 ex) 세절역 ~ 상수역 표시
            $scope.top_pathList = pathListFac.get_pathlist().startname + " ~ " + pathListFac.get_pathlist().endname;

            $scope.all_dis = place_data.getdata().distance[0]/1000;
            $scope.all_hour = Math.floor(place_data.getdata().time[0]/60);
            $scope.all_minute = place_data.getdata().time[0]%60;

            $scope.detail_data = placedetaildata;
            $scope.place_data = place_data.getdata();

            if("routexy" in $scope.detail_data && "timedata" in $scope.detail_data){ //지도좌표와 예상도착시간이 모두 존재할떄
                $scope.dataCheck = true;

                $scope.center = {
                    position : [$scope.detail_data.routexy[0].longy, $scope.detail_data.routexy[0].latx]
                };

                $scope.arrowPositions = {
                    arrowPo_start: [$scope.detail_data.routexy[0].longy, $scope.detail_data.routexy[0].latx],
                    arrowPo_end: [$scope.detail_data.routexy[3].longy, $scope.detail_data.routexy[3].latx]
                };
                /*
                 timerstatecode -> show bus remain time when statecode == index
                 */
                $scope.timerstatecode = 0;

                $scope.getdetaildata = function (fid, fname, routeid, routenm, fx, fy, index) {

                    var data = {};
                    data.samedata = place_data.fid_arsid(fid, fname);
                    data.routeid = routeid;
                    data.routenm = routenm;
                    data.fx = fx;
                    data.fy = fy;

                    $place_detail.place_detail(data).then(function (data) {
                        $scope.center = {
                            position : [data.routexy[2].longy, data.routexy[2].latx]
                        };
                        $scope.arrowPositions = {

                            arrowPo_start: [data.routexy[0].longy, data.routexy[0].latx],
                            arrowPo_end: [data.routexy[3].longy, data.routexy[3].latx]
                        }

                        $scope.detail_data = data;
                        $scope.detail_data.timedata.kals1 = data.timedata.kals1;
                        $scope.timerstatecode = index;
                    });
                };

            } else {
                $scope.dataCheck = false;
                $scope.infoMsgDiv = true;
                $scope.infoMsg = "지도데이터와 경로데이터가 존재하지 않습니다"
            }
        }]);