/**
 * Created by Ben on 4/5/2016.
 */
(function (angular) {

  angular.module('starter.controllers')
    .controller('FireBaseController', controllerFnc);

  function controllerFnc($scope, Auth, $state, $log) {

    var vm = this;

    // Check for the user's authentication state
    Auth.$onAuth(function (authData) {
      if (authData) {
        $scope.loggedInUser = authData;
      } else {
        $scope.loggedInUser = null;
      }
    });

    // Create a new user, called when a user submits the signup form
    this.createUser = function (user) {
      Auth.$createUser({
        email: user.email,
        password: user.pass
      })
        .then(function (authData) {
          console.log('Logged in successfully as: ', authData.uid);
          // User created successfully, log them in
          vm.login(user);
        })
        .catch(function (error) {
          console.log('Error: ', error);
        });
    };

    // Login an existing user, called when a user submits the login form
    this.login = function (user) {
      $log.log('login called');
      Auth.$authWithPassword({
        email: user.email,
        password: user.pass
      }).then(function (authData) {
        console.log('Logged in successfully as: ', authData.uid);
        $state.go('secure');
        $scope.loggedInUser = authData;
      }).catch(function (error) {
        $log.log('Error: ', error);
      });
    };

  };

})(angular);
