/**
 * Created by Ben on 4/5/2016.
 */
(function (angular) {

  angular.module('broken.login', ['ionic', 'broken.services', 'ngMessages'])
    .controller('LoginController', controllerFnc)
    .config(function ($stateProvider) {

      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'js/pages/login/login-tmpl.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          cache: false
        })

    });

  function controllerFnc($scope, Auth, $state, $log) {

    var vm = this;

    // Check for the user's authentication state
    Auth.$onAuth(function (authData) {
      if (authData) {
        $state.go('gallery');
      }
    });

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
          vm.serverError = error;
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
        $state.go('gallery');
        $scope.loggedInUser = authData;
      }).catch(function (error) {
        $log.log('Error: ', error);
        vm.serverError = error;
      });
    };

  };

})(angular);
