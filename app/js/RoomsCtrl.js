/*Rooms Controller*/
InventoryApp.controller('RoomsCtrl', function($scope, $location, $timeout, $mdDialog) {

getRooms();
function getRooms(){
  rooms_db.find({}, function(err, docs) {
        $scope.$apply(function() {
            $scope.rooms = docs;
            $scope.count = docs.length;
        });
    });

    $scope.$watch('rooms', function(newval, oldval) {
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
};

$scope.delete = function() {
    for (var i = 0; i < $scope.selected.length; i++) {
        var id = $scope.selected[i]._id;
        rooms_db.remove({
            _id: id
        }, {
            multi: true
        }, function(err, numRemoved) {

        });
        rooms_db.find({}, function(err, docs) {
            $scope.rooms = docs;
            $scope.count = docs.length;
            $scope.selected = [];
        });
    }
};

$scope.deleteRoom = function(id){
  rooms_db.remove({ _id: id }, {}, function (err, numRemoved) {
    rooms_db.persistence.compactDatafile();
    getRooms();
  });
}

$scope.editRoom = function(id){
    $mdDialog.show({
      controller: editRoomDialogCtrl,
      templateUrl: './app/views/dialogs/editRoomDialog.tmpl.html',
      parent: angular.element(document.body),
      locals: {
        id: id
      },
      clickOutsideToClose:false
    });

  function editRoomDialogCtrl($scope, $mdDialog, id) {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    rooms_db.findOne({ _id: id }, function (err, doc) {
      $scope.room = doc;
      if($scope.room.roomExtension){
        $scope.hasExtension = true;
      }else{
        $scope.hasExtension = false;
      }

      console.log($scope.room)
      $scope.roomNumber = function(number){
        $scope.floorChanged = true;
          switch(number){
            case '100':
              $scope.minNumber = 100;
              $scope.maxNumber = 110;
              $scope.floor = 'First_Floor';
            break;

            case '200':
              $scope.minNumber = 200;
              $scope.maxNumber = 213;
              $scope.floor = 'Second_Floor';
            break;

            case '300':
              $scope.minNumber = 300;
              $scope.maxNumber = 313;
              $scope.floor = 'Third_Floor';
            break;

            case '400':
              $scope.minNumber = 400;
              $scope.maxNumber = 414;
              $scope.floor = 'Fourth_Floor';
            break;
            default:
          }
      }

      $scope.edit = function(room){
        if($scope.hasExtension){
          room.roomExtension = "";
        }

        rooms_db.update({ _id: room._id }, { $set: { floor: room.floor, roomExtension: room.roomExtension, roomName: room.roomName, roomNumber: room.roomNumber } }, { multi: true }, function (err, numReplaced) {
          rooms_db.persistence.compactDatafile();
          console.log(room)
        });
        getRooms();
      }
    });

  }
}


$scope.options = {
    rowSelection: false,
    multiSelect: true,
    autoSelect: false,
    decapitate: true,
    largeEditDialog: false,
    boundaryLinks: true,
    limitSelect: true,
    pageSelect: true
};

$scope.selected = [];
$scope.limitOptions = [5, 10, 20, {
    label: 'All',
    value: function() {
        return $scope.rooms ? $scope.rooms.length : 0;
    }
}];

$scope.query = {
    order: 'roomNumber',
    limit: 5,
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

$scope.selectedItems = function(item) {
    console.log($scope.selected);
};



$scope.loadStuff = function() {
rooms_db.find({}, function(err, docs) {
      $scope.$apply(function() {
          $scope.rooms = docs;
          $scope.count = docs.length;
      });
  });
    $scope.promise = $timeout(function() {

    }, 1000);
};




$scope.addRoom = function(ev){
  $mdDialog.show({
    controller: addRoomDialogCtrl,
    templateUrl: './app/views/dialogs/addRoomDialog.tmpl.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:false
  });

function addRoomDialogCtrl($scope, $mdDialog) {

  $scope.roomNumber = function(number){
    $scope.floorChanged = true;
    console.log(number);
    switch(number){
      case '100':
        $scope.minNumber = 100;
        $scope.maxNumber = 110;
        $scope.floor = 'First_Floor';
      break;

      case '200':
        $scope.minNumber = 200;
        $scope.maxNumber = 213;
        $scope.floor = 'Second_Floor';
      break;

      case '300':
        $scope.minNumber = 300;
        $scope.maxNumber = 313;
        $scope.floor = 'Third_Floor';
      break;

      case '400':
        $scope.minNumber = 400;
        $scope.maxNumber = 414;
        $scope.floor = 'Fourth_Floor';
      break;
      default:
    }
  }

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.save = function(room) {

    $scope.saveProgress = true;
    rooms_db.insert(room, function (err, newDoc) {
      getRooms();
    });



  };
}



}

});
