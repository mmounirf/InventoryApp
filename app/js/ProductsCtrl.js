/*Products Controller*/
InventoryApp.controller('ProductsCtrl', function($scope, $location, $timeout, $mdDialog) {

  getProducts();


  function getProducts(){
    products_db.persistence.compactDatafile();
    products_db.find({}, function(err, products) {
          $scope.$apply(function() {
              $scope.products = products;
              $scope.count = products.length;
          });
      });

      $scope.$watch('products', function(newval, oldval) {
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




  $scope.barcodeOptions={
    displayValue: false
  }
  $scope.enlargeQR = function(product){
    $scope.pID = product._id;
    $scope.clickedProduct = product;
    $scope.qrcodeImage = document.getElementsByClassName('qrcode-link')[0].href;
    $scope.qrcodeLabel = product.title+"-"+product.location.roomNumber+""+product.location.roomExtension;
    $mdDialog.show({
       clickOutsideToClose: true,
       scope: $scope,
       title: "QR Code Image",
       ariaLabel: "QR Code Image",
       preserveScope: true,
       template: '<md-dialog style="overflow: visible;"><md-button class="md-fab close-dialog-btn" ng-click="closeQRDialog()" aria-label="QR Code Dialog"><i class="material-icons">close</i></md-button>' +
                 '  <md-dialog-content class="enlargeQRDialog" style="width:300px; height:300px; padding: 30px;">' +
                 '<qrcode version="4" error-correction-level="L" size="1000" data="product.qrcode" download></qrcode>' +
                 '  </md-dialog-content>' +
                 '<div class=qr-dialog-action-btns><md-button class="md-fab print-dialog-btn" ng-click="printQRCode(pID)" aria-label="Print QR Code"><i class="material-icons">print</i></md-button><md-button class="md-fab save-dialog-btn" ng-click="saveQRCode()" aria-label="Save QR Code"><i class="material-icons">save</i></md-button><p class="qrCodeValue" ng-show="clickedProduct.location.roomExtension">'+product.title+' - '+product.location.roomNumber + product.location.roomExtension+'</p><p class="qrCodeValue" ng-show="!clickedProduct.location.roomExtension">'+product.title+' - '+product.location.roomNumber+'</p></div></md-dialog>'
    });

    $scope.closeQRDialog = function(){
      $mdDialog.hide();
    }

    $scope.saveQRCode = function(){
      var app = require('electron').remote;
      var dialog = app.dialog;
      var fs = require('fs');
      var base64Data = $scope.qrcodeImage.replace(/^data:image\/png;base64,/, "");
      dialog.showSaveDialog({
          defaultPath: '/'+$scope.qrcodeLabel+'.png'
      }, function (fileName) {
     if (fileName === undefined){
          return;
     }

     fs.writeFile(fileName, base64Data, 'base64', function (err) {
         if(err){
             alert(err.message)
         }
     });
   })
}

    $scope.printQRCode = function(id){
      products_db.findOne({ _id: id }, function (err, doc) {
        var qrcode = product.qrcode;
        var title = product.title;
      });
    }

  }



$scope.addProduct = function(ev){
  $mdDialog.show({
    controller: addProductDialogCtrl,
    templateUrl: './app/views/dialogs/addProductDialog.tmpl.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:false
  });


function addProductDialogCtrl($scope, $mdDialog) {
  $scope.selectAllContent= function($event) {
      $event.target.select();
  };

$scope.barcodeOptions={
  displayValue: true
}

  rooms_db.find({}, function(err, docs) {
      $scope.$apply(function() {
          $scope.rooms = docs;
          $scope.count = docs.length;
      });
  })

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.save = function(product) {
    $scope.saveProgress = true;
    if(!product.location.roomExtension){
      product.location.roomExtension = "";
    }
    $scope.qrcode = product.title + "-" + product.location.roomNumber + "" + product.location.roomExtension;
    if(!product.barcode){
      var barcode = null;
    }else{
      var barcode = product.barcode;
    }

    var product = {
        title: product.title,
        description: product.description,
        quantity: product.quantity,
        instock: product.quantity,
        outstock: 0,
        barcode: product.barcode,
        qrcode: $scope.qrcode,
        location: product.location
    };
    console.log(product)
    products_db.insert(product, function (err, newDoc) {
      getProducts();
    });

  };
}
}




$scope.assembleProduct = function(products){
  $mdDialog.show({
    controller: assembleProductDialogCtrl,
    templateUrl: './app/views/dialogs/assembleProductDialog.tmpl.html',
    parent: angular.element(document.body),
    locals: {
      products: $scope.products
    },
    // targetEvent: ev,
    clickOutsideToClose:false
  });
function getAllProducts(){
  return $scope.products
}

function assembleProductDialogCtrl($scope, $mdDialog, products) {
  $scope.cancel = function() {
    $mdDialog.cancel();
  };


  var pFakeArray = [];
  $scope.tempProducts = _.union(products,pFakeArray);
  $scope.assembledProduct = {
    components: []
  };


  $scope.productAsComponent = function(product){
    $scope.assembledProduct.components.push(product);
    $scope.tempProducts.splice($scope.tempProducts.indexOf(product),1);
  }

  $scope.removeComponent = function(component){
    $scope.tempProducts.push(component);
    $scope.assembledProduct.components.splice($scope.assembledProduct.components.indexOf(component),1);
  }

  rooms_db.find({}, function(err, docs) {
      $scope.$apply(function() {
          $scope.rooms = docs;
          $scope.count = docs.length;
      });
  })

  $scope.save = function(assembledProduct) {
    var usedComponents = [];
    var newInstock;
    var newOutstock;
    for(var i=0; i<assembledProduct.components.length; i++){
      /*Update products database with quantities checkouts*/
      newInstock = assembledProduct.components[i].instock - assembledProduct.components[i].usedQuantity;
      newOustock = assembledProduct.components[i].outstock + assembledProduct.components[i].usedQuantity;
      products_db.update({ _id: assembledProduct.components[i]._id }, { $set: { instock: newInstock, outstock: newOustock } }, { multi: true }, function (err, numReplaced) {
        products_db.persistence.compactDatafile();
      });

      /*Build our new product's components array*/
      var newComponent = {
        '_id': assembledProduct.components[i]._id,
        'title': assembledProduct.components[i].title,
        'usedQuantity': assembledProduct.components[i].usedQuantity
      }
      usedComponents.push(newComponent);
    }

    /*Build the rest of our product's info*/
    if(!assembledProduct.location.roomExtension){
      assembledProduct.location.roomExtension = "";
    }
    var qrcode = assembledProduct.title + "-" + assembledProduct.location.roomNumber + assembledProduct.location.roomExtension;
    var aProduct = {
      'title': assembledProduct.title,
      'description': assembledProduct.description,
      'components': usedComponents,
      'quantity': 1,
      'instock': 1,
      'outstock': 0,
      'location': {
        'roomNumber': assembledProduct.location.roomNumber,
        'roomExtension': assembledProduct.location.roomExtension
      },
      'barcode': assembledProduct.barcode,
      'qrcode': qrcode,
    }

    /*Show loading progress*/
    $scope.saveProgress = true;
    $scope.disableBtn = true;

    /*Insert the new product into database*/
    $scope.promise = $timeout(function() {
      products_db.insert(aProduct, function (err, newDoc) {
        getProducts();
      });
    }, 500);
  }
  }
}


$scope.delete = function(selected) {


  for (var i = 0; i < selected.length; i++) {
    var product_id = selected[i]._id;
    function deleteProduct(product_id){
      products_db.remove({_id: product_id}, {multi: true}, function(err, numRemoved) {

      });
      getProducts();
      $scope.selected = [];
    }

    if(selected[i].components){
      for(var j = 0; j < selected[i].components.length; j++){
        var component_id = selected[i].components[j]._id;
        var component_usedQuantity = selected[i].components[j].usedQuantity;
        updateComponentsQuan(component_id, component_usedQuantity)
        function updateComponentsQuan(id, quantity){
          products_db.findOne({ _id: id }, function (err, doc) {
            doc.instock = doc.instock + quantity;
            doc.outstock = doc.outstock - quantity;

            products_db.update({ _id: id }, { $set: { instock: doc.instock, outstock: doc.outstock } }, { multi: true }, function (err, numReplaced) {
              products_db.persistence.compactDatafile();
              getProducts();
            });
          })
        }
      }
    }
deleteProduct(product_id);
  }


};


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

    $scope.selected = [];
    $scope.limitOptions = [5, 10, 20, {
        label: 'All',
        value: function() {
            return $scope.products ? $scope.products.length : 0;
        }
    }];

    $scope.query = {
        order: 'title',
        limit: 5,
        page: 1
    };

    $scope.filter = {
        options: {
            debounce: 500
        }
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
      getProducts();

      $scope.promise = $timeout(function() {
        }, 1000);
    };


    /*Print QR Code*/
    $scope.print = function(products){
      if(products.length<1){
        products = $scope.products;
      }
      console.log(products)
    }

});
