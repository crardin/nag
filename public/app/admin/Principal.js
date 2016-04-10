(function () {
    'use strict';

    var controllerId = 'Principal';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$routeParams', Principal]);

    function Principal(common, datacontext, $routeParams) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Principal Investigator';
        vm.nodes = [];
        vm.trialnodes = [];
        vm.principals = [];
        vm.selectedTask = 0;
        vm.checkedtrials = [];
        vm.taskassignmentnodes = [];
        vm.investigatornodes = [];
        vm.firstname = $routeParams.firstname;
        vm.lastname = $routeParams.lastname;
        vm.trialsiteid = $routeParams.trialSiteID;
        vm.lasttasknumber = 1;
        vm.currenttask = null;
        vm.runQuery = runQuery;
        vm.search = search;
        vm.getPrincipalInvestigator = getPrincipalInvestigator;
        vm.getTaskAssignments = getTaskAssignments;
        vm.getTrials = getTrials;
        vm.createTask = createTask;
        vm.manageTask = manageTask;
        vm.removeTask = removeTask;
        vm.removeTrial = removeTrial;
        vm.toggleTrialInList = toggleTrialInList;
        vm.getLastTaskNumber = getLastTaskNumber;
        vm.updateSelectedTask = updateSelectedTask;
        vm.selectedTrialRows = [];
        vm.username = "Karen";
        vm.sponsorTemplate = '<div class="ngCellText"><input class="checkbox" type="checkbox" ng-click=vm.toggleTrialInList(row.getProperty("Study_ID")) />{{row.getProperty(col.field)}}</div>';
        vm.taskTemplate = '<div class="ngCellText"><input class="radio" type="radio" ng-model="vm.currenttask" value="{{row.getProperty(col.field)}}" ng-click=vm.updateSelectedTask(row.getProperty("Task_Number")) />{{row.getProperty(col.field)}}</div>';
        vm.studyTemplate = '<div class="ngCellText"><a href="#/admin/Study/{{row.getProperty(col.field)}}">{{row.getProperty(col.field)}}</a></div>';
        vm.siteTemplate = '<div class="ngCellText"><a href=#/admin/Trial/TrialId/{{row.getProperty("TrialSite_ID")}}/LastName/{{vm.lastname}}/FirstName/{{vm.firstname}}/StudyId/{{row.getProperty("Study_ID")}}>{{row.getProperty(col.field)}}</a></div>';
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Principal Investigator'); });
            if(vm.trialsiteid){
                vm.getPrincipalInvestigator();
                vm.getTrials();
                vm.getTaskAssignments();
            } else {
                vm.getPrincipals();
            }
            vm.trialOptions = {
                data: 'vm.trialnodes',
                showFilter: true,
                enableColumnResize: true,
                enableRowSelection: true,
                showSelectionCheckbox: true,
                selectedItems: vm.selectedTrialRows,
                columnDefs: [
                    {
                        field: 'Sponsor', displayName: 'Sponsor'
                    },
                    {
                        field: 'Study_ID', displayName: 'Study', cellTemplate: vm.studyTemplate
                    },
                    {
                        field: 'TrialSite_ID', displayName: 'Site', cellTemplate: vm.siteTemplate
                    },
                    {
                        field: 'TrialStage', displayName: 'Stage'
                    },
                    {
                        field: 'Contacted', displayName: 'Date Contacted'
                    },
                    {
                        field: 'NumberOfSubjects', displayName: 'Number of Subjects'
                    }
                ]
            }
            vm.taskOptions = {
                data: 'vm.taskassignmentnodes',
                multiSelect: true,
                showFilter: true,
                enableColumnResize: true,
                enableRowSelection: true,
                showSelectionCheckbox: true,
                columnDefs: [
                    {
                        field: 'Task_Number', displayName: 'Task'
                    },
                    {
                        field: 'Study_ID', displayName: 'Study', cellTemplate: vm.studyTemplate
                    },
                    {
                        field: 'TrialSite_ID', displayName: 'Site', cellTemplate: vm.siteTemplate
                    }
                ]
            }

        }

        function runQuery() {
            return vm.nodes = "something";
            /*return datacontext.runAdhocQuery(vm.query).then(function (result) {
             return vm.nodes = result.data;
             });*/
        }

        function search() {
            // function to search for a given parameter
            log(vm.searchParameter);

            return datacontext.runAdhocQuery(vm.query).then(function (result){
                return vm.nodes = result.data;
            });
        }

        function getTaskAssignments(){
            // function to find the task assignments
            //vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS)<-[TR:TASK_RELATES_TO]-(TK) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN DISTINCT TR.Task_Number AS Task_Number, TS.TrialSite_ID AS TrialSite_ID ORDER BY TR.Task_Number';
            vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) MATCH (PI)-[:RUNS_TRIAL]->(TS)<-[TR:TASK_RELATES_TO]-(TK) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN DISTINCT TR.Task_Number AS Task_Number, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID ORDER BY TR.Task_Number'
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){

                return vm.taskassignmentnodes = result.data.responseData;
            });
        }

        function getPrincipals(){
            // function to get all the principal investigators
            vm.query = '';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.principals = result.data.responseData;
            });
        }

        function getPrincipalInvestigator(){
            // function to get the principal investigator information
            vm.query = 'MATCH (PI:PrincipalInvestigator)-[:RUNS_TRIAL]->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '"AND TS.TrialSite_ID="' + vm.trialsiteid + '" RETURN PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, PI.PI_StreetAddress AS StreetAddress, PI.PI_City AS City, PI.PI_State AS State, PI.PI_Zip AS Zip, PI.PI_Country AS Country, PI.PI_Email AS Email, PI.PI_TelephoneNumber AS TelephoneNumber, PI.PI_FaxNumber AS FaxNumber';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.investigatornodes = result.data.responseData;
            });
        }

        function getTrials(){
            vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) MATCH (SP)-[CT:CONTRACTS]->(F)-[:HAS_INVESTIGATOR]->(PI) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN DISTINCT SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, TS.TrialSite_Stage AS TrialStage, F.Facility_Name AS Facility_Name, CT.Facility_Do_Not_Contact AS Do_Not_Contact, PI.PI_State AS PI_State, TS.TrialSite_NumberOfSubjects AS NumberOfSubjects, TS.TrialSite_Contacted AS Contacted';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                console.log(result.data.responseData);
                return vm.trialnodes = result.data.responseData;
            });
        }

        function createTask(){
            // function to create a new task
            vm.getLastTaskNumber().then(function() {
                console.log(vm.lasttasknumber);
                if (vm.lasttasknumber > 1) {
                    vm.lasttasknumber += 1;
                }

                // iterate through the selected trials and run query for each one
                console.log(vm.trialOptions.selectedItems);
                for (var i = 0; i <= vm.trialOptions.selectedItems.length; i++) {
                    var site_id = vm.trialOptions.selectedItems[i].TrialSite_ID;

                    //vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + site_id + '" CREATE (PI)-[:HAS_TASK]->(TK:Task {Task_Number:"' + vm.lasttasknumber + '"})-[:TASK_RELATES_TO] ->(TS) RETURN PI, TS, TK';
                    vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + site_id + '" CREATE (PI)-[:HAS_TASK]->(TK)-[:TASK_RELATES_TO {Task_Number:"' + vm.lasttasknumber + '"}] ->(TS) RETURN PI, TS, TK';
                    console.log(vm.query);
                    return datacontext.runAdhocQuery(vm.query).then(function (result) {
                        console.log(result.data.responseData);
                    });
                }
            }).then(function(){
                vm.getTaskAssignments();
                vm.getTrials();
            });
        }

        function removeTrial(){
            // function to handle removing just a trial
            vm.query = 'MATCH (PI)-[HT:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO] ->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TK.Task_Numbe="' + vm.selectedTask + '" DELETE HT, TR, TK';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                console.log(result.data.responseData);
                vm.getTrials();
            });
        }

        function removeTask(){
            // function to handle removing a trial from a task
            vm.query = 'MATCH (PI)-[HT:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO] ->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '"AND PI.PI_LastName="' + vm.lastname + '" AND TK.Task_Numbe="' + vm.selectedTask + '" AND TS.TrialSite_ID="' + vm.currenttask + '" DELETE TR';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                console.log(result.data.responseData);
                vm.getTrials();
            });
        }

        function manageTask(){
            // function to handle task management
        }

        function toggleTrialInList(Study_ID){
            // function to add the checked trial to the array of checked trials
            if (vm.checkedtrials.indexOf(Study_ID) == -1) {
                vm.checkedtrials.push(Study_ID);
            } else {
                vm.checkedtrials.splice(vm.checkedtrials.indexOf(Study_ID), 1);
            }
        }

        function updateSelectedTask(updatedTaskNumber){
            vm.selectedTask = updatedTaskNumber;
        }

        function getLastTaskNumber(){
            // function to get the largest task number in the database
            vm.query = 'MATCH (n) WHERE has(n.Task_Number) RETURN DISTINCT "node" as element, n.Task_Number AS Task_Number UNION ALL MATCH ()-[r]-() WHERE has(r.Task_Number) RETURN DISTINCT "relationship" AS element, r.Task_Number AS Task_Number';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                var tasknumbers = result.data.responseData;
                var max_value = 1;
                for(var i=0;i < tasknumbers.length; i++){
                    if (max_value <= parseInt(tasknumbers[i].Task_Number)){
                        max_value = parseInt(tasknumbers[i].Task_Number);
                    }
                }
                vm.lasttasknumber = max_value;
            });
        }
    }
})();
