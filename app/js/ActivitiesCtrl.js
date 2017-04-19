/*Users Controller*/
InventoryApp.controller('ActivitiesCtrl', function($scope, $location, $timeout, $mdDialog) {

    activities_db.find({}, function(err, activities) {
        $scope.$apply(function() {
            $scope.activities = activities;
            $scope.count = $scope.activities.length;
            console.log($scope.activities);
            console.log($scope.activities2);
        });
    });


    $scope.go_to = function(page) {
        $location.path(page);
    }

    $scope.$watch('activities', function(newval, oldval) {
        if (newval) {
            $scope.promise = $timeout(function() {}, 500);
            $mdDialog.hide();

        } else {
            $mdDialog.show({
                templateUrl: './app/views/loadingDialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false
            })
        }
    });



    $scope.go_to = function(page) {
        $location.path(page);
    }
    $scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: false,
        decapitate: true,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
    };


    $scope.limitOptions = [5, 10, 20, {
        label: 'All',
        value: function() {
            return $scope.activities ? $scope.count : 0;
        }
    }];

    $scope.query = {
        order: 'user',
        limit: 10,
        page: 1
    };

    $scope.filter = {
        options: {
            debounce: 500
        }
    };

    $scope.removeFilter = function() {
        $scope.filter.show = false;
        $scope.query.filter = '';
    };

    $scope.toggleLimitOptions = function() {
        $scope.limitOptions = $scope.limitOptions ? undefined : [10, 20, 30];
    };


    $scope.onPaginate = function(page, limit) {
        console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
        console.log('Page: ' + page + ' Limit: ' + limit);

        $scope.promise = $timeout(function() {

        }, 2000);
    };

    $scope.loadStuff = function() {
        $scope.promise = $timeout(function() {
            console.log($scope.activities);
        }, 2000);
    };

    $scope.onReorder = function(order) {

        console.log('Scope Order: ' + $scope.query.order);
        console.log('Order: ' + order);

        $scope.promise = $timeout(function() {

        }, 2000);
    };



});
