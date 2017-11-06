'use strict';

/**
 *
 * Main module of the application.
 */
angular
    .module('dreamfactoryApidocsApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'dfUtility',
        'dfSystemConfig',
        'dfUserManagement',
        'dfServices',
        'dfSwaggerUI'
    ])

    // Set application version number
    .constant('APP_VERSION', '1.1.1')

    // Set API key for this application, also used by df-swagger-ui
    .constant('APP_API_KEY', '36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88')

    .constant('INSTANCE_URL', '')

    // Set global header for calls made to DreamFactory instance
    .config(['$httpProvider', 'APP_API_KEY', function($httpProvider, APP_API_KEY) {

        $httpProvider.defaults.headers.common['X-Dreamfactory-API-Key'] = APP_API_KEY;
    }])

    // Configure main app routing rules
    .config(['$routeProvider', '$httpProvider', '$locationProvider', function ($routeProvider, $httpProvider, $locationProvider) {

        $locationProvider.hashPrefix('');

        $routeProvider
            .when('/login', {
                controller: 'LoginCtrl',
                templateUrl: 'views/login.html',
                resolve: {

                    checkLoginRoute: ['$q', 'UserDataService', '$location', function ($q, UserDataService, $location) {

                        var deferred = $q.defer();
                        var currentUser = UserDataService.getCurrentUser();

                        // we're trying to go to login
                        // if we have a valid session then no need to go to login
                        if (currentUser && currentUser.session_token) {
                            $location.url('/services');
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }]
                }
            })
            .when('/logout', {
                controller: 'LogoutCtrl',
                templateUrl: 'views/logout.html'
            })
            .otherwise({
                controller: 'LoginCtrl',
                templateUrl: 'views/login.html',
                resolve: {

                    checkOtherRoute: ['$q', 'UserDataService', '$location', function ($q, UserDataService, $location) {

                        var deferred = $q.defer();
                        var currentUser = UserDataService.getCurrentUser();

                        // if we are loading the base URL of index.html then the path will be ""
                        // if we have a valid session then go to services list
                        // if there is no session then go to login
                        if (currentUser && currentUser.session_token) {
                            $location.url('/services');
                        } else {
                            $location.url('/login');
                        }
                        deferred.reject();
                        return deferred.promise;
                    }]
                }
            });

        $httpProvider.interceptors.push('httpValidSession');
    }]);