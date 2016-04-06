/**
 * Created by Ben on 4/5/2016.
 */
angular.module('starter')
  .controller('FireBaseController', function ($scope, Auth, $state) {

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
    this.login = function (user) {
      Auth.$authWithPassword({
        email: user.email,
        password: user.pass
      }).then(function (authData) {
        console.log('Logged in successfully as: ', authData.uid);
        $state.go('secure');
        $scope.loggedInUser = authData;
      }).catch(function (error) {
        console.log('Error: ', error);
      });
    };


  })
