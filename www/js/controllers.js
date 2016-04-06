angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $cordovaCamera, $log, $ionicPlatform, Auth) {

    // EMAIL & PASSWORD AUTHENTICATION

    // Check for the user's authentication state
    Auth.$onAuth(function (authData) {
      if (authData) {
        $scope.loggedInUser = authData;
      } else {
        $scope.loggedInUser = null;
      }
    });

    // Create a new user, called when a user submits the signup form
    $scope.createUser = function (user) {
      Auth.$createUser({
        email: user.email,
        password: user.pass
      }).then(function () {
        // User created successfully, log them in
        return Auth.$authWithPassword({
          email: user.email,
          password: user.pass
        });
      }).then(function (authData) {
        console.log('Logged in successfully as: ', authData.uid);
        $scope.loggedInUser = authData;
      }).catch(function (error) {
        console.log('Error: ', error);
      });
    };

    // Login an existing user, called when a user submits the login form
    $scope.login = function (user) {
      Auth.$authWithPassword({
        email: user.email,
        password: user.pass
      }).then(function (authData) {
        console.log('Logged in successfully as: ', authData.uid);
        $scope.loggedInUser = authData;
      }).catch(function (error) {
        console.log('Error: ', error);
      });
    };

    // Log a user out
    $scope.logout = function () {
      Auth.$unauth();
    };

    $ionicPlatform.ready(function () {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $scope.takePicture = function () {
        $log.log("taking picture");
        $cordovaCamera.getPicture(options).then(function (imageData) {
          var image = document.getElementById('myImage');
          image.src = "data:image/jpeg;base64," + imageData;
        }, function (err) {
          // error
          $log.log("can't take picture");
        });
      }

    });

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope, SocialSharing) {
    $scope.settings = {
      enableFriends: true
    };
    $scope.socialSharing = SocialSharing;
  });

