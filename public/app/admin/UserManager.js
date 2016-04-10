(function () {
    'use strict';

    var controllerId = 'UserManager';
    angular.module('app').controller(controllerId, ['common', 'datacontext', UserManager]);

    function UserManager(common, datacontext){

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'User Manager';
        vm.nodes = [];
        vm.listUsers = listUsers;
        vm.listGroups = listGroups;
        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.createGroup = createGroup;
        vm.updateGroup = updateGroup;
        vm.unassignedStudies = unassignedStudies;
        vm.trialSites = trialSites;

        activate();

        function activate(){
            var promises = [];
            common.activateController(promises, controllerId).then(function() { log('Activated User Manager'); });

        }

        function listUsers(){
            // function that returns the list of users for the system
        }

        function listGroups(){
            // function that returns the list of groups for the system
        }

        function createUser(){
            // function that creates a new user
        }

        function updateUser(){
            // function that updates an existing user
        }

        function createGroup(){
            // function that creates a new group
        }

        function updateGroup(){
            // function that updates an existing group
        }

        function unassignedStudies(){
            // function that returns the list of unassigned studies
        }

        function trialSites(){
            // function that returns the list of trial sites
        }


    }
})();