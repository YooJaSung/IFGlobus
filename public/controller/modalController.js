/**
 * Created by kimsungwoo on 15. 1. 8..
 */

angular.module('globus.controller').
    controller('ModalInstanceCtrl',['$scope', '$modalInstance', 'items',
        function ($scope, $modalInstance, items) {
            $scope.items = items;

            $scope.ok = function (item) {
                console.log("selected item : ");
                console.log(item);
                $modalInstance.close(item);
            };
    }]);