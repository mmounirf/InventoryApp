/*Login Controller*/
InventoryApp.controller('LoginCtrl', function($rootScope, $scope, $location, $route, $mdToast) {

    $scope.login = function() {
      users_db.find({ $and: [{ username: $scope.username }, { password: $scope.password }] }, function (err, docs) {
        if(docs.length<1){
          $mdToast.show(
            $mdToast.simple()
              .textContent('Incorrect Login Credential')
              .highlightAction(false)
              .position('bottom right')
              .action('Close')
              .hideDelay(false)
              .toastClass('loginToastFalse')
          );

        }else{
          var name = docs[0].name;
          $mdToast.show(
            $mdToast.simple()
              .textContent('Welcome, '+name)
              .highlightAction(false)
              .position('bottom right')
              .toastClass('loginToastTrue')
              .hideDelay(1000)
          );
          sessionStorage.setItem("loggedInUser", JSON.stringify(docs[0]))
          $rootScope.loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"))
          $location.path('dashboard');

        }
      });
    }



});
