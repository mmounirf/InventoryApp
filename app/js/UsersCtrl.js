/*Users Controller*/
InventoryApp.controller('UsersCtrl', function($scope, $location, $timeout, $mdDialog, $rootScope) {
  getUsers();
  function getUsers(){
    users_db.find({}, function(err, users) {
        $scope.$apply(function() {
            $scope.users = users;
            $scope.count = $scope.users.length;
            console.log($scope.users);
        });
    });

    $scope.$watch('users', function(newval, oldval) {
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
  }

  $scope.delete = function() {
      for (var i = 0; i < $scope.selected.length; i++) {
          var id = $scope.selected[i]._id;
          users_db.remove({
              _id: id
          }, {
              multi: true
          }, function(err, numRemoved) {

          });
          getUsers();
      }
  };


  $scope.editUser = function(id){
      $mdDialog.show({
        controller: editUserDialogCtrl,
        templateUrl: './app/views/dialogs/editUserDialog.tmpl.html',
        parent: angular.element(document.body),
        locals: {
          id: id
        },
        clickOutsideToClose:false
      });

    function editUserDialogCtrl($scope, $mdDialog, id) {
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.onUserTypeChange = function(type){
        switch(type){
          case 'commissioned_officers':
            $scope.ranks = [
              'lieutenant', 'first_lieutenant', 'captain', 'major', 'lieutenant_colonel',
              'colonel', 'brigadier_general', 'major_general', 'lieutenant_general',
              'colonel_general', 'field_marshal'
            ]
          break;
          case 'enlisted_personnel':
            $scope.ranks = [
              'private', 'corporal', 'sergeant', 'first_sergeant', 'assistant', 'first_assistant'
            ]
          break;
      }
    }
      users_db.findOne({ _id: id }, function (err, doc) {
        $scope.user = doc;
        $scope.onUserTypeChange($scope.user.type)
        $scope.edit = function(user){
          console.log(user)
          users_db.update({ _id: id }, { $set: { force: user.force, name: user.name, password: user.password, rank: user.rank, permissions: user.permissions, type: user.type, username: user.username, role: user.role } }, { multi: true }, function (err, numReplaced) {
            users_db.persistence.compactDatafile();
            console.log(user)
            if(user.username == $rootScope.loggedInUser.username){
              sessionStorage.setItem("loggedInUser", JSON.stringify(user))
              $rootScope.loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
            }
          });
          getUsers();
        }

      });
      }
    }

    $scope.deleteUser = function(id){
      users_db.remove({ _id: id }, {}, function (err, numRemoved) {
        users_db.persistence.compactDatafile();
        getUsers();
      });
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


    $scope.limitOptions = [5, 10, 20, {
        label: 'All',
        value: function() {
            return $scope.users ? $scope.count : 0;
        }
    }];

    $scope.query = {
        order: 'name',
        limit: 10,
        page: 1
    };

    $scope.filter = {
        options: {
            debounce: 500
        }
    };
$scope.selected = [];
    $scope.removeFilter = function() {
        $scope.filter.show = false;
        $scope.query.filter = '';
    };
    $scope.selectedItems = function(item) {
        console.log($scope.selected);
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


    $scope.addUser = function(ev){
      $mdDialog.show({
        controller: addUserDialogCtrl,
        templateUrl: './app/views/dialogs/addUserDialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false
      });

      function addUserDialogCtrl($scope, $mdDialog) {

        $scope.onUserTypeChange = function(type){
          $scope.user.rank = "";
          switch(type){
            case 'commissioned_officers':
            $scope.ranks = [
              'lieutenant', 'first_lieutenant', 'captain', 'major', 'lieutenant_colonel',
              'colonel', 'brigadier_general', 'major_general', 'lieutenant_general',
              'colonel_general', 'field_marshal'
            ]
          break;
          case 'enlisted_personnel':
            $scope.ranks = [
              'private', 'corporal', 'sergeant', 'first_sergeant', 'assistant', 'first_assistant'
            ]
            break;
        }
      }



        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.save = function(user) {
          $scope.saveProgress = true;
          console.log(user)
          users_db.insert(user, function (err, newDoc) {
            getUsers();
          });

        };
      }
}
});
