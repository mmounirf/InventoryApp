/*Dashboard Controller*/
InventoryApp.controller('DashboardCtrl', function($scope, $rootScope, $location, $timeout, $mdDialog) {


  $mdDialog.show({
      templateUrl: './app/views/loadingDialog.tmpl.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false
  })

    $scope.products_count = 0;
    products_db.count({}, function(err, count) {
        $scope.$apply(function() {
            $scope.products_count = count;
        });
    })

    requests_db.find({}, function(err, docs) {
            $scope.requests = docs;
    });


    $scope.names = [];
    $scope.inStock = $scope.products_count;
    $scope.outStock = $scope.products_count;
    activities_db.find({}, function(err, docs) {
      $scope.activities = docs;
      for (i in docs){
        $scope.names.push(docs[i].user);
      }

})



    products_db.find({}, function(err, docs) {
            $scope.products = docs;
            $scope.count = docs.length;
            for(doc in docs){
              if(docs[doc].outstock != 0){
                $scope.$apply(function() {
                $scope.outStock = $scope.outStock + 1;
                });
              }

              if(docs[doc].instock == docs[doc].quantity){
                $scope.$apply(function() {
                  $scope.inStock = $scope.inStock + 1;
                });
              }
            }
    });

    $scope.promise = $timeout(function() {
        $mdDialog.hide();

        var inArray = [];
        var outArray = [];
        var products_title = [];

        for(pid in $scope.products){
          inArray.push($scope.products[pid].instock);
          outArray.push($scope.products[pid].outstock);
          products_title.push($scope.products[pid].title);
        }

         $scope.labels = products_title;;
         $scope.series = ['In Stock', 'Out Stock'];
         $scope.data = [inArray, outArray];
         $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];



    }, 500);

    $scope.approveRequest = function(request){
      requests_db.update({ _id: request._id }, { $set: { status: 'Approved'} }, function (err, numReplaced) {

        requests_db.persistence.compactDatafile();
        requests_db.find({}, function(err, docs) {
          $scope.$apply(function() {
                $scope.requests = docs;
          });
        });


    });



    }

    $scope.rejectRequest = function(request){
      requests_db.update({ _id: request._id }, { $set: { status: 'Rejected'} }, function (err, numReplaced) {

          requests_db.persistence.compactDatafile();
          requests_db.find({}, function(err, docs) {
            $scope.$apply(function() {
                  $scope.requests = docs;
            });
          });
      });
    }

/*Commissioner Action*/
    $scope.checkout = function(request) {
      products_db.findOne({ _id: request.product.id }, function (err, product) {
        var request_outstock = request.product.checkout_quantity + product.outstock;
        var request_instock = product.instock - request.product.checkout_quantity;
        products_db.update({ _id: request.product.id },
          {
            $set: {
              instock: request_instock,
              outstock: request_outstock
                  }
          }, { multi: true },

          function (err, numReplaced) {
          products_db.persistence.compactDatafile();
          var activity = {
            user: request.user.name,
            product:{
              name: request.product.name,
              checkout_quantity: request.product.checkout_quantity,
              id: request.product.id
            }
          };
          activities_db.insert(activity, function (err, newDocs) {
            $scope.$apply();

          });

          $scope.$apply();
        });
        requests_db.remove({ _id: request._id }, {}, function (err, numRemoved) {
          $scope.$apply();
        });
        $location.path('/dashboard');
        $scope.promise = $timeout(function() {
        }, 500);
      });

    }


});
