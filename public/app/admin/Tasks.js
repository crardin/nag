(function () {
    'use strict';

    var controllerId = 'Tasks';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$routeParams', Tasks]);

    function Tasks(common, datacontext, $routeParams) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Tasks';
        vm.nodes = [];
        vm.runQuery = runQuery;
        vm.getTask = getTask;
        vm.username = "Karen";
        vm.taskId = $routeParams.taskId;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Tasks View'); });
            vm.getTask();
        }

        function runQuery() {
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                return vm.nodes = result.data;
            });
        }

        function getTask() {
            // function to populate the Task information

        }

    }
})();
