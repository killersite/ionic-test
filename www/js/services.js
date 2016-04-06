angular.module('starter.services', ['ngCordova'])

  // TODO: Replace this with your own Firebase URL: https://firebase.com/signup
  .constant('FBURL', 'https://blinding-inferno-2149.firebaseio.com/')

  .factory('Auth', function ($firebaseAuth, FBURL, $window) {
    var ref = new $window.Firebase(FBURL);
    return $firebaseAuth(ref);
  })

  .factory('Messages', function ($firebaseArray, FBURL, $window) {
    var ref = new $window.Firebase(FBURL + '/messages');
    return $firebaseArray(ref);
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

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
