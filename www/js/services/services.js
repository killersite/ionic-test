angular.module('broken.services', ['ngCordova', 'firebase', 'ngStorage'])

  .constant('FBURL', 'https://its-broke.firebaseio.com/')

  .factory('firebaseDataService', function ($firebaseArray, FBURL, $window) {
    var root = new $window.Firebase(FBURL);

    var cards_ref = new $window.Firebase(FBURL + '/cards');

    var service = {
      root: root,
      cards: $firebaseArray(cards_ref),
      likes_for_card: function(card) {
        var likes_ref = new $window.Firebase(FBURL + '/likes/' + card.$id);
        return likes_ref;
      },
      comments: root.child('comments')
    };

    return service;
  })

  .factory('Auth', function ($localStorage, $cordovaDevice, $firebaseAuth, $window, FBURL) {
// in the future this service will go to network to authenticate users.  it will return a promise.
// for now it returns a user object with uuid and username
// here should also go the login and logout and create user functions....

    // firebase auth
    var ref = new $window.Firebase(FBURL);

    var user = {
      uuid: function() {
        var uuid = $localStorage.uuid || null
        if (uuid == null) {
          // why not use this every time? what is the value of using local-storage?
          uuid = $cordovaDevice.getUUID();
          $localStorage.uuid = uuid
        }
        return uuid;
      },
      username: "Broken User",
      firebaseAuth: $firebaseAuth(ref)
    };

    return user;
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

