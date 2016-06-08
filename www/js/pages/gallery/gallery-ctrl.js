(function (angular) {


  angular.module('broken.gallery', ['ionic', 'broken.services', 'firebase'])
    .config(configFnc)
    .controller('GalleryController', controllerFnc)
    .filter('reverse', function () {
      return function (items) {
        return items.slice().reverse();
      };
    })

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

  function controllerFnc($timeout, Toast, $scope, $ionicPlatform, $ionicModal, firebaseDataService, Auth, $state, $ionicHistory, $cordovaCamera, $log) {
    var vm = this;
Toast.show('loading gallery', 'short', 'bottom');
    vm.newItem = {};
    vm.images = [];

    // ADD CARDS TO A SYNCHRONIZED ARRAY
    vm.cards = firebaseDataService.cards;

    // Add likes to array
    vm.likes = firebaseDataService.likes;

    vm.openModal = function () {
      vm.modal.show();
    };

    vm.resetNewItemForm = function () {
      vm.newItemForm.$setPristine();
      vm.newItemForm.$setUntouched();
      vm.newItem = {};
    };

    vm.numberOfLikes = function(card) {
      var uuid = Auth.uuid();
      var cardId = card.$id;
      var likes = firebaseDataService.likes_for_card(card);
      $firebaseObject(likes).$loaded().then(function(){
        $log.log("likes: " + likes);

      });
      return 7;
    }

    vm.toggleLike = function(card) {
      var uuid = Auth.uuid();
      var cardId = card.$id;
      var cardLikeRef = firebaseDataService.likes_for_card(card);
      cardLikeRef.transaction(function(like) {
        if (like && like[uuid]) {
          like[uuid] = null;
        } else {
          if (!like) {
            like = {};
          }
          like[uuid] = true;
        }
        return like;
      });
    };

    vm.isLiked = function(card) {
      var uuid = Auth.uuid();
      var cardId = card.$id;
      var cardLikeRef = firebaseDataService.likes_for_card(card);
      var likes = cardLikeRef.once('value');
      return true;
    }

    function timeout(time) {
      $timeout(function () {
        ProgressIndicator.hide();
      }, time);
    }

    vm.closeModal = function (canceled) {
      if (canceled) {
        vm.modal.hide();
        vm.resetNewItemForm();
        return;
      }

      // save image and description
      firebaseDataService.cards.$add(vm.newItem)
        .then(function () {
          vm.modal.hide();
          vm.resetNewItemForm();
        }, function (err) {
          vm.serverError = err;
        })

      Toast.show('saved', 'short', 'bottom');

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

      // show loading
      //$cordovaProgress.showSimple(true);

      var options = {
        quality: 100,
        destinationType: 0,
        sourceType: 1,
        encodingType: 0,
        allowEdit: true,
        // targetWidth: 300,
        // targetHeight: 150,
        saveToPhotoAlbum: false,
        correctOrientation: true

        //destinationType: Camera.DestinationType.DATA_URL,
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
            $log.log(err);
          });
      }

    });

    // init code

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
