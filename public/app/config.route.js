(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard'
                    /*settings: {
                        nav: 1,
                        menu: 0,
                        content: '<i class="fa fa-dashboard"></i> NAGiNATOR'
                    }*/
                }
            },
            {
              url: '/admin/NAGCentral',
              config: {
                  title: 'NAGCentral',
                  templateUrl: 'app/admin/NAGCentral.html',
                  settings: {
                      menu: 1,
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i>NAG Central'
                  }
              }
            },
            {
              url: '/admin/Study',
              config:{
                title: 'Study',
                templateUrl: 'app/admin/Study.html',
                settings: {
                    menu: 1,
                    nav: 2,
                    content: '<i class="fa fa-dashboard"></i>Study'
                }
              }
            },
            {
              url: '/admin/Principal',
              config:{
                  title: 'Principal',
                  templateUrl: 'app/admin/Principal.html',
                  settings: {
                      menu: 1,
                      nav: 3,
                      content: '<i class="fa fa-dashboard"></i>Principal Investigator'
                  }
              }
            },
            {
              url: '/admin/Trial',
              config:{
                  title: 'Trial',
                  templateUrl: 'app/admin/Trial.html',
                  settings:{
                      menu: 1,
                      nav: 4,
                      content: '<i class="fa fa-dashboard"></i>Trial'
                  }
              }
            },
            /*{
                url: '/admin/TestSubjects',
                config: {
                    title: 'TestSubjects',
                    templateUrl: 'app/admin/TestSubjects.html',
                    settings: {
                        menu: 2,
                        nav: 5,
                        content: '<i class="fa fa-tasks"></i> Test Subjects'
                    }
                }
            },*/
            /*{
                url: '/admin/Administration',
                config: {
                    title: 'Administration',
                    templateUrl: 'app/admin/Administration.html',
                    settings: {
                        nav: 7,
                        menu: 3,
                        content: '<i class="fa fa-crosshairs"></i> Administration'
                    }
                }
            },*/
            {
                url: '/admin/Administration',
                config: {
                    title: 'Administration',
                    templateUrl: 'app/admin/Administration.html',
                    settings: {
                        menu: 3,
                        nav: 6,
                        content: '<i class="fa fa-crosshairs"></i>Administration'
                    }
                }
            },
            {
                url: '/admin/UserManager',
                config: {
                    title: 'UserManager',
                    templateUrl: 'app/admin/UserManager.html',
                    settings: {
                        menu: 3,
                        nav: 7,
                        content: '<i class="fa fa-crosshairs"></i>User Manager'
                    }
                }
            },
            {
                url: '/admin/FileManager',
                config: {
                    title: 'FileManager',
                    templateUrl: 'app/admin/FileManager.html',
                    settings: {
                        menu: 3,
                        nav: 8,
                        content: '<i class="fa fa-crosshairs"></i>File Manager'
                    }
                }
            },
            {
                url: '/admin/Tasks/:taskId',
                config: {
                    title: 'Tasks',
                    templateUrl: 'app/admin/Tasks.html'
                }
            },
            {
                url: '/admin/Trial/TrialId/:trialId/LastName/:lastname/FirstName/:firstname/StudyId/:StudyID',
                config: {
                    title: 'Trial',
                    templateUrl: 'app/admin/Trial.html'
                }
            },
            {
                url: '/admin/Study/:studyId',
                config: {
                    title: 'Study',
                    templateUrl: 'app/admin/Study.html'
                }
            },
            {
                url: '/admin/TestSubjects/Study/:studyId/TrialSiteId/:trialSiteID',
                config: {
                    title: 'TestSubjects',
                    templateUrl: 'app/admin/TestSubjects.html'
                }
            },
            {
                url:'/admin/Principal/LastName/:lastname/FirstName/:firstname',
                config: {
                    title: 'Principal',
                    templateUrl: 'app/admin/Principal.html'
                }
            },
            {
                url:'/admin/Principal/LastName/:lastname/FirstName/:firstname/TrialSiteId/:trialSiteID',
                config: {
                    title: 'Principal',
                    templateUrl: 'app/admin/Principal.html'
                }
            },
            {
                url: '/login/unauth',
                config: {
                    title: 'unauth',
                    templateUrl: 'app/login/unauth.html',
                    settings: {
                        content: '<i class="fa fa-crosshairs"></i> Unauthorized Access'
                    }
                }
            }
        ];
    }
})();
