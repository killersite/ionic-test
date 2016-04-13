angular.module('broken.services', ['ngCordova', 'firebase'])

  .constant('FBURL', 'https://blinding-inferno-2149.firebaseio.com/')

  .factory('FB', function ($firebaseArray, FBURL, $window) {
    return new $window.Firebase(FBURL);
  })

  .factory('Cards', function ($firebaseArray, FBURL, $window) {
    var ref = new $window.Firebase(FBURL + '/cards');
    return $firebaseArray(ref);
  })

  .factory('Auth', function ($firebaseAuth, FBURL, $window) {
    var ref = new $window.Firebase(FBURL);
    return $firebaseAuth(ref);
  })

  .factory('SocialSharing', function ($cordovaSocialSharing) {
    return {
      // share anywhere
      share: function () {
        $cordovaSocialSharing.share('This is my message', 'Subject string', null, 'http://www.mylink.com');
      },

// Share via email. Can be used for feedback
      sendFeedback: function () {
        $cordovaSocialSharing
          .shareViaEmail('Some message', 'Some Subject', 'to_address@gmail.com');
      },

// Share via SMS. Access multiple numbers in a string like: '0612345678,0687654321'
      sendSMS: function (message, number) {
        $cordovaSocialSharing.shareViaSMS(message, number);
      },

      sendFacebook: function (msg, img, url, msg2, successFnc, errorFnc) {
        $cordovaSocialSharing.shareViaFacebookWithPasteMessageHint(
          'Message via Facebook', img, url,
          'Paste it dude!',
          function () {
            console.log('share ok')
          },
          function (errormsg) {
            alert(errormsg)
          }
        );
      }
    }
  })

