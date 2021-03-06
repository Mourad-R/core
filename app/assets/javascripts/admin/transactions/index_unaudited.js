angular.module('app')
.config(function ($routeProvider) {
  $routeProvider
  .when('/admin/transactions/unaudited', {
    templateUrl: 'admin/transactions/index_unaudited.html',
    controller: "UnauditedTransactions"
  });
})
.controller("UnauditedTransactions", function ($scope, $window, $api) {

  $scope.date = { title: "Date", col: "created_at", order: "asc"};

  $scope.updatePage = function(page, order_hash) {
    var params = { page: page, per_page: 10, order: order_hash, unaudited: true};

    $scope.working = true;
    $api.get_unaudited_transactions(params).then(function(response) {
      if (response.meta.success) {
        $scope.working = false;
        $scope.unaudited_transactions = response.data;
        var pagination = response.meta.pagination;
        $scope.totalItems = pagination.items;
        $scope.itemsPerPage = pagination.per_page;
        $scope.currentPage = pagination.page  || 1;
        $scope.pageCount = Math.ceil(pagination.items/pagination.per_page);
        $scope.maxSize = 10;
      } else {
        $scope.working = false;
        $scope.error = response.data.error;
        //do something with the error  
      }
    });
  };

  $scope.applySort = function(page, column) {
    var order_hash = {};
    if (column.order === "asc") {
      column.order = "desc";
    } else {
      column.order = "asc";
    }
    order_hash[column.col] = column.order;
    $scope.order_hash = order_hash;
    $scope.updatePage(page, JSON.stringify(order_hash));
  };

  $scope.amount = function(transaction) {
    var splits = transaction.splits;
    var max = 0;
    for (var i = 0; i < splits.length; i++) {
      var amount = Math.abs(parseFloat(splits[i].amount));
      if (amount > max) {
        max = amount;
      }
    }

    return max;
  };

  $scope.updatePage(1);

});
