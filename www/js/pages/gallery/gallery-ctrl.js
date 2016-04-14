(function (angular) {

  angular.module('broken.gallery', ['ionic', 'broken.services', 'firebase'])
    .config(configFnc)
    .controller('GalleryController', controllerFnc)
    .filter('reverse', function () {
      return function (items) {
        return items.slice().reverse();
      };
    });

  function configFnc($stateProvider) {
    $stateProvider
      .state('gallery', {
        url: '/gallery',
        templateUrl: 'js/pages/gallery/cards-tmpl.html',
        controller: 'GalleryController',
        controllerAs: 'vm',
        cache: false
      })
  };

  function controllerFnc($scope, $ionicPlatform, $ionicModal, Cards, Auth, $state, $ionicHistory, FB, $firebaseArray, $cordovaCamera, $log) {
    var vm = this;

    vm.newItem = {};
    vm.images = [];

    // ADD CARDS TO A SYNCHRONIZED ARRAY
    vm.cards = Cards;

    vm.openModal = function () {
      vm.modal.show();
    };

    vm.resetNewItemForm = function(){
      vm.newItemForm.$setPristine();
      vm.newItemForm.$setUntouched();
      vm.newItem = {};
    }

    vm.closeModal = function (canceled) {
      if (canceled) {
        vm.modal.hide();
        vm.resetNewItemForm();
      }

      // save image and description
      Cards.$add(vm.newItem)
        .then(function () {
          vm.newItem = {};
          vm.modal.hide();
          vm.resetNewItemForm();
        }, function (err) {
          vm.serverError = err;
        })

    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      vm.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    // modal end

    $ionicPlatform.ready(function () {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
        //sourceType: Camera.PictureSourceType.CAMERA,
        //allowEdit: true,
        //encodingType: Camera.EncodingType.JPEG,
        //targetWidth: 500,
        //targetHeight: 300,
        //popoverOptions: CameraPopoverOptions,
        //saveToPhotoAlbum: false,
        //correctOrientation: true
      };

      vm.takePicture = function () {
        $log.log("taking picture");
        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
            // add image to scope
            vm.newItem.image = imageData;

            // show input modal
            vm.openModal();

          }, function (err) {
            // error
            $log.log("can't take picture");
          });
      }

    });

    // init

    $log.log('Clearing history!');
    $ionicHistory.clearHistory();

    // Check for the user's authentication state
    // removed for now
    //var syncArray;
    //Auth.$onAuth(function (authData) {
    //  if (authData) {
    //    var userRef = FB.child('users/' + authData.uid);
    //    syncArray = $firebaseArray(userRef.child('images'));
    //    vm.images = syncArray;
    //  } else {
    //    $state.go('login');
    //  }
    //});

    // Modal input
    $ionicModal.fromTemplateUrl('js/pages/gallery/image-input-tmpl.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      vm.modal = modal;
    });

  }

})(angular)
