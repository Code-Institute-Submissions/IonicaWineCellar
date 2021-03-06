(function(){

    angular.module('RouteControllers',['angular-storage','ngRoute'])

        .constant('regex',{

            telRegex : /^[0-9]*$/,
            postCode : /^[a-zA-z0-9]*$/,
            emailRegex :/^[_a-z0-9._%+-]+@[a-z0-9.-]*\.[a-z]/

        })


        .controller('WinesController', function($scope,$http,BasketService,GetDataService,DomManipulation) {


            /* The below get the Wines Json file and assign the data within the returned object to $scope.wines */


            GetDataService.getHTTPData('wines.json').then(function(data){

                $scope.wines = data.data;

            });

            $scope.changeWineTabColor = function(element){

                DomManipulation.changeWineTabColorDom(element);


            };

            $scope.activateDeactivateWineOverlay = function(element,action){


                DomManipulation.ActivDeactivWineOverlay(element,action);


            }


        })

        .controller('customerQueriesController',function($http,$scope,regex) {

            /*below we initialize the variables that contain the customers record object and the ID primitive*/

            $scope.customer = {};
            $scope.id = null;

            console.log(regex.telRegex);

            /* Regula Expression utilized for form validation */
            $scope.telRegex = regex.telRegex;
            $scope.postCode = regex.postCode;
            $scope.emailRegex = regex.emailRegex;


        })

        /* the below controller is in charge of the inclusion of data within the basket and the calculations for the totals and number of items*/

        .controller('basketController', function ($scope, $http, store,getAddressAPI,BasketService,DomManipulation,GetDataService,$location) {

            angular.element('.menu-item').on('click',function(){

                angular.element('html, body').scrollTop(0);
            });


            $scope.addTobasket = function(item, element){
                var quantity = parseInt(element.currentTarget.nextElementSibling.children[0].value);
                var basket = store.get('basketCookie');

                BasketService.addItemTobasket(item,element,quantity,basket);

            };

            $scope.getAddressFunction = function() {

                var postcode = $scope.postcode;

                getAddressAPI.getAddressFromPostcode(postcode).then(function (results){

                    DomManipulation.postCodeCheck(results,$scope.postCodes,$scope.postcode)});
            };


            $scope.confirmAddressFunction = function(action){
                DomManipulation.confirmAddress(action)

            };


            $scope.basket = store.get('basketCookie');

            /* The below variables is assigned to a function within a service that calculates the total price of the items in the basket */

            $scope.basketTotal = BasketService.basketItemsTotals($scope.basket);


            $scope.updateBasket = function(item){

                var basket = store.get('basketCookie');
                var finalQuantity = parseInt(angular.element(item.currentTarget).next().children().val());
                var id = angular.element(item.currentTarget).parents('.basket-wine-display-row').attr('id');

                BasketService.updateBasket(basket,finalQuantity,id);
                $scope.basket = store.get('basketCookie');
                $scope.basketTotal = BasketService.basketItemsTotals($scope.basket);
            };


            $scope.removeProduct = function(element){

                id = angular.element(element.currentTarget).parents('.basket-wine-display-row').attr('id');
                basket = store.get('basketCookie');

                BasketService.removeItem(id,basket);
                $scope.basket = store.get('basketCookie');
                $scope.basketTotal = BasketService.basketItemsTotals($scope.basket);
                if ($scope.basket.length === 0){
                    DomManipulation.makeBasketIconAppearDisappear('disappear',$scope.basket);
                }
            };

            $scope.checkStock = function(event){

                var basket = store.get('basketCookie');

                GetDataService.getHTTPData('../wines.json').then(function (data) {

                    var values = DomManipulation.GetValuesForStockCheck();

                    BasketService.stockAvailabilityCheck(event, basket,data.data,values);


                })

            };

            $scope.orderSubmission = function(){

                $location.path('/orderconfirmation');

            }

        })


})();