angular.module('broken', ['ionic', 'broken.services', 'broken.gallery', 'broken.login'])

  .run(function ($ionicPlatform, $ionicLoading) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $ionicLoading.hide();
    });

    $ionicLoading.show({
      template: 'Loading...'
    });

  })

  .config(function ($stateProvider, $urlRouterProvider, $provide) {
    $urlRouterProvider.otherwise('/gallery');

    $provide.decorator("$exceptionHandler", function ($delegate, $injector) {
      return function (exception, cause) {
        /* here you can do what u want  */

        var data = {
          message: "Exception: " + exception.message,
          stack: exception.stack || "none"
        };

        alert(JSON.stringify(data));

        // Call The original Angular Exception Handler
        $delegate(exception, cause);
      }
    });

  })

  .factory('Toast', function ($ionicLoading, $cordovaToast) {
    return {
      show: function (message, duration, position) {
        message = message || "No message given...";
        duration = duration || 'short';
        position = position || 'top';

        if (!!window.cordova) { // Use the Cordova Toast plugin
          $cordovaToast.show(message, duration, position);
        }
        else {
          duration = 2000;
          $ionicLoading.show({template: message, duration: duration});
        }
      }
    };
  })

