(function (angular) {

  angular.module('broken.gallery', ['ionic', 'broken.services', 'firebase'])
    .config(configFnc)
    .controller('GalleryController', controllerFnc);

  function configFnc($stateProvider) {
    $stateProvider
      .state('gallery', {
        url: '/gallery',
        templateUrl: 'js/pages/gallery/gallery-tmpl.html',
        controller: 'GalleryController',
        controllerAs: 'vm',
        cache: false
      })
  };

  function controllerFnc($ionicPlatform, Auth, $state, $ionicHistory, FB, $firebaseArray, $cordovaCamera, $log) {
    var vm = this;

    $log.log('Clearing history!');
    $ionicHistory.clearHistory();

    vm.images = [];
    var syncArray;

    // Check for the user's authentication state
    Auth.$onAuth(function (authData) {
      if (authData) {
        var userRef = FB.child('users/' + authData.uid);
        syncArray = $firebaseArray(userRef.child('images'));
        vm.images = syncArray;
      } else {
        $state.go('login');
      }
    });

    $ionicPlatform.ready(function () {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      vm.takePicture = function () {
        $log.log("taking picture");
        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
            syncArray.$add({image: imageData})
              .then(function () {
                alert('image saved');
              })
          }, function (err) {
            // error
            $log.log("can't take picture");
          });
      }

    });
  }

})(angular)
