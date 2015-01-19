/**
 * Created by airnold on 14. 11. 13..
 */
angular.module('globus.controller')
    .controller('placesearchController',["$scope","$place_search",'$window','$location','place_data', 'pathListFac',
        function($scope,$place_search,$window,$location,place_data, pathListFac){

            $scope.startinfo = null;
            $scope.endinfo = null;
            $scope.startname = null;
            $scope.endname = null;
            $scope.data = {};
            $scope.arrow_check_time = true;
            $scope.arrow_check_dis = true;
            var temp, temp_arr, timePathlist_length, disPathlist_length;

            $scope.placesearchResult = {};
            $scope.short_time_flag = false;
            $scope.short_distance_flag = false;

            $scope.sname = function(sn){
                $scope.startname = sn;
            };
            $scope.ename = function(en){
                $scope.endname = en;
            };

            $scope.search = function(){
                $scope.data.startX = $scope.startinfo.geometry.location.k;
                $scope.data.startY = $scope.startinfo.geometry.location.D;

                $scope.data.endX = $scope.endinfo.geometry.location.k;
                $scope.data.endY = $scope.endinfo.geometry.location.D;

                $scope.data.start_name = $scope.startname;
                $scope.data.end_name = $scope.endname;

                //place검색의 navbar에 pathlist를 표시하기 위해 set함.
                pathListFac.set_pathlist($scope.startinfo.name, $scope.endinfo.name);

                $place_search.place_search($scope.data).then(function(data){

                    $scope.placesearchResult.short_time = data.short_time;
                    console.log(data);

                    if(data === 'nodata'){  //no here
                        $scope.nodata_show = true;
                        $scope.nodata = "경로가 존재하지 않습니다.";
                    }else{
                        if(data.short_distance === 'nodata' || data.short_distance === 'same'){
                            $scope.short_time_flag = true;
                            $scope.short_distalce_flag = false;

                            $scope.short_time_allDis = data.short_time.distance[0]/1000;
                            $scope.short_time_allHour = Math.floor(data.short_time.time[0]/60);
                            $scope.short_time_allMin = data.short_time.time[0]%60;

                            //fname과 tname에서 괄호 안의 arsid 제거
                        /*    temp = data.short_time.pathList[0].fname[0]; //안양여중고(311223)
                            temp_arr = temp.split('(');
                            $scope.time_station_1 = temp_arr[0]; //안양여중고

                            temp = data.short_time.pathList[0].tname[0]; //안양여중고(311223)
                            temp_arr = temp.split('(');
*/
                            /*if(!data.short_time.pathList[1]){ //pathlist[1]이 존재하지 않으면 -> 경유지가 존재하지 않으면
                                *//*$scope.arrow_check_time = false;
                                $scope.time_station_3 = temp_arr[0];*//*
                            } else {
                                *//*$scope.time_station_2 = temp_arr[0]; //안양여중고

                                temp = data.short_time.pathList[1].tname[0]; //안양여중고(311223)
                                temp_arr = temp.split('(');
                                $scope.time_station_3 = temp_arr[0]; //안양여중고*//*
                            }*/


                        }else{
                            $scope.placesearchResult.short_distance = data.short_distance;
                            $scope.short_time_flag = true;
                            $scope.short_distance_flag = true;

                            $scope.short_time_allDis = data.short_time.distance[0]/1000;
                            $scope.short_time_allHour = Math.floor(data.short_time.time[0]/60);
                            $scope.short_time_allMin = data.short_time.time[0]%60;

                            $scope.short_dis_allDis = data.short_distance.distance[0]/1000;
                            $scope.short_dis_allHour = Math.floor(data.short_distance.time[0]/60);
                            $scope.short_dis_allMin = data.short_distance.time[0]%60;

                            //fname과 tname에서 괄호 안의 arsid 제거
                            /*temp = data.short_time.pathList[0].fname[0]; //안양여중고(311223)
                            temp_arr = temp.split('(');
                            $scope.time_station_1 = temp_arr[0]; //안양여중고

                            temp = data.short_time.pathList[0].tname[0]; //안양여중고(311223)
                            temp_arr = temp.split('(');*/

                            /*if(!data.short_time.pathList[1]){ //pathlist[1]이 존재하지 않으면 -> 경유지가 존재하지 않으면
                                *//*$scope.arrow_check_time = false;
                                $scope.time_station_3 = temp_arr[0];*//*
                            } else {
                                *//*$scope.time_station_2 = temp_arr[0]; //안양여중고

                                temp = data.short_time.pathList[1].tname[0]; //안양여중고(311223)
                                temp_arr = temp.split('(');
                                $scope.time_station_3 = temp_arr[0]; //안양여중고*//*
                            }
*/

                            //fname과 tname에서 괄호 안의 arsid 제거
                            /*temp = data.short_distance.pathList[0].fname[0]; //안양여중고(311223)
                            temp_arr = temp.split('(');
                            $scope.distance_station_1 = temp_arr[0]; //안양여중고

                            temp = data.short_distance.pathList[0].tname[0]; //안양여중고(311223)
                            temp_arr = temp.split('(');*/
                            /*if(!data.short_distance.pathList[1]){ //pathlist[1]이 존재하지 않으면 -> 경유지가 존재하지 않으면
                                *//*$scope.arrow_check_dis = false;
                                $scope.distance_station_3 = temp_arr[0];*//*
                            } else {
                                *//*$scope.distance_station_2 = temp_arr[0]; //안양여중고

                                temp = data.short_distance.pathList[1].tname[0]; //안양여중고(311223)
                                temp_arr = temp.split('(');
                                $scope.distance_station_3 = temp_arr[0]; //안양여중고*//*
                            }*/

                        }
                    }
                }, function(error){
                    $window.alert(error);
                });

            };
            /*
             place detail page click event
             */
            $scope.placeDetail = function(time_distance_flag){

                if(time_distance_flag === 'time'){

                    place_data.setdata($scope.placesearchResult.short_time);
                }
                else if(time_distance_flag === 'distance'){

                    place_data.setdata($scope.placesearchResult.short_distance);
                }

                $location.path('/placesearch/placedetail');

            };

        }]);