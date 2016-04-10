(function () {
    'use strict';

    var controllerId = 'Investigator';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$routeParams', Investigator]);

    function Investigator(common, datacontext, $routeParams) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Investigator';
        vm.nodes = [];
        vm.runQuery = runQuery;
        vm.getInvestigator = getInvestigator;
        vm.username = "Karen";

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Tasks View'); });

        }

        function runQuery() {
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                return vm.nodes = result.data;
            });
        }

        function getInvestigator(){
            // function to get investigator information
        }

    }
})();

