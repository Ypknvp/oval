var app = angular.module('userFormApp', []);

// Custom Filter: Capitalize the first letter
app.filter('capitalizeFirstWord', function() {
  return function(input) {
    if (input && typeof input === 'string') {
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
    return input;
  };
});

// Factory to handle data submission
app.factory('formService', function($http) {
  return {
    submitData: function(user) {
      return $http.post('http://localhost:3000/submit', user);
    },
    getUsers: function() {
      return $http.get('http://localhost:3000/users');
    },
    updateUser: function(id, user) {
      return $http.put('http://localhost:3000/user/' + id, user);
    },
    deleteUser: function(id) {
      return $http.delete('http://localhost:3000/user/' + id);
    }
  };
});

// Controller: Handles form and CRUD operations
app.controller('formController', function($scope, formService) {
  $scope.user = {}; // Holds form data
  $scope.message = ''; // Message to display after submission
  $scope.users = []; // List of users

  // Submit form and save data
  $scope.submitForm = function() {
    if ($scope.userForm.$valid) {
      formService.submitData($scope.user)
        .then(function(response) {
          $scope.message = response.data.message;
          $scope.user = {}; // Reset form after submission
          loadUsers(); // Reload user list
        })
        .catch(function() {
          $scope.message = 'Error saving data';
        });
    }
  };

  // Load users from the server
  function loadUsers() {
    formService.getUsers()
      .then(function(response) {
        $scope.users = response.data;
      })
      .catch(function() {
        $scope.message = 'Error fetching users';
      });
  }

  // Edit user data
  $scope.editUser = function(user) {
    $scope.user = angular.copy(user); // Copy user data to form
  };

  // Delete user
  $scope.deleteUser = function(id) {
    formService.deleteUser(id)
      .then(function(response) {
        $scope.message = response.data.message;
        loadUsers(); // Reload user list
      })
      .catch(function() {
        $scope.message = 'Error deleting user';
      });
  };

  // Initial load of users
  loadUsers();
});
