(function () { 
    'use strict';
    
    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$route', 'config', 'routes', sidebar]);

    function sidebar($route, config, routes) {
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.collapse1 = false;
        vm.collapse2 = true;
        vm.collapse3 = true;
        vm.toggleCollapse = toggleCollapse;

        activate();

        function activate() {
            getNavRoutes();
        }

        function toggleCollapse(currentValue, collapseValue){
            // toggles the value of the collapse variable
            if (collapseValue == 1){
                return vm.collapse1 = !currentValue;
            } else if (collapseValue == 2){
                return vm.collapse2 = !currentValue;
            } else if (collapseValue == 3){
                return vm.collapse3 = !currentValue;
            }
        }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                //return r.config.settings && r.config.settings.nav;
                return r.config.settings && r.config.settings.menu;
            }).sort(function(r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }
        
        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    };
})();
