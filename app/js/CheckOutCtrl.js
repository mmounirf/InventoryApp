/*Check-Out Product Controller*/
InventoryApp.controller('CheckOutCtrl', function($scope, $rootScope, $location, $timeout, $q, $mdDialog) {
  $scope.product_found = false;
  $scope.checkInProduct;

  $scope.get_product_by_barcode = function() {
      products_db.find({ $or: [
        {barcode: $scope.product_barcode},{qrcode: $scope.product_barcode}
      ]
      }, function(err, product) {
          if (product.length > 0) {
              $scope.$apply(function() {
                  $scope.product_found = true;
                  $scope.id = product[0]._id;
                  $scope.title = product[0].title;
                  $scope.description = product[0].description;
                  $scope.quantity = product[0].quantity;
                  $scope.createdAt = product[0].createdAt;
                  $scope.updatedAt = product[0].updatedAt;
                  $scope.instock = product[0].instock;
                  $scope.outstock = product[0].outstock;
                  $scope.room = product[0].location;
                  $scope.qrcode = product[0].qrcode;
                  $scope.barcode = product[0].barcode;
              });
              $scope.checkInProduct = product[0];
              console.log($scope.checkInProduct);
          } else {
              $scope.$apply(function() {
                  $scope.product_found = false;
              });
          }
      });
  }

    $scope.checkout = function() {
        $scope.outstock += $scope.checkout_quantity;
        $scope.instock -= $scope.checkout_quantity;


        products_db.update({ _id: $scope.id },
          {
            $set: {
              quantity: $scope.quantity,
              instock: $scope.instock,
              outstock: $scope.outstock
                  }
          }, { multi: true },

          function (err, numReplaced) {
          products_db.persistence.compactDatafile();
          var activity = {
            user: $rootScope.loggedInUser.name,
            product:{
              name: $scope.title,
              checkout_quantity: $scope.checkout_quantity,
              id: $scope.id
            }
          };
          activities_db.insert(activity, function (err, newDocs) {
            activities_db.persistence.compactDatafile();
          });
        });
        $location.path('/products');
        $scope.promise = $timeout(function() {
        }, 500);
    }


    $scope.request_checkout = function(){
      var request = {
        product:{
          name: $scope.title,
          checkout_quantity: $scope.checkout_quantity,
          id: $scope.id
        },
        user: {name: $scope.loggedInUser.name, username:$scope.loggedInUser.username, id: $scope.loggedInUser._id},
        checkout_quantity: $scope.checkout_quantity,
        status: 'Pending'
      }
      requests_db.insert(request, function (err, newDocs) {
        requests_db.persistence.compactDatafile();
      });
      $location.path('dashboard');
    }
});
