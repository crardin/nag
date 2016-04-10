(function () {
    'use strict';

    var controllerId = 'Study';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$routeParams', Study]);

    function Study(common, datacontext, $routeParams) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Study';
        vm.nodes = [];
        vm.studyNodes = [];
        vm.trialnodes = [];
        vm.studyId = $routeParams.studyId;
        vm.runQuery = runQuery;
        vm.search = search;
        vm.getTasks = getTasks;
        vm.getStudy = getStudy;
        vm.showTrials = showTrials;
        vm.studyTemplate = '<div class="ngCellText" ng-click="vm.showTrials(row.getProperty(col.field))"><b>{{row.getProperty(col.field)}}</b></div>'
        vm.nameTemplate = '<div class="ngCellText"><a href=#/admin/Principal/LastName/{{row.getProperty(col.field)}}/FirstName/{{row.getProperty("FirstName")}}/TrialSiteId/{{row.getProperty("TrialSite_ID")}}>{{row.getProperty("FirstName")}} {{row.getProperty(col.field)}}</a></div>'
        vm.trialTemplate = '<div class="ngCellText"><a href=#/admin/Trial/TrialId/{{row.getProperty(col.field)}}/LastName/{{row.getProperty("LastName")}}/FirstName/{{row.getProperty("FirstName")}}/StudyId/{{row.getProperty("Study_ID")}}>{{row.getProperty(col.field)}}</a></div>';
        vm.username = "Karen";

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Study Page'); });
            if (vm.studyId) {
                getStudy(vm.username);
                showTrials(vm.studyId);
            } else {
                getStudies(vm.username);
            }
            vm.studyOptions = {
                data: 'vm.studynodes',
                multiSelect: false,
                showFilter: true,
                enableColumnResize: true,
                enableCellSelection: true,
                columnDefs: [
                    {
                        field: 'Sponsor', displayName: 'Sponsor'
                    },
                    {
                        field: 'Study_ID', displayName: 'Study ID', cellTemplate: vm.studyTemplate
                    },
                    {
                        field: 'Study_Name', displayName: 'Study Name'
                    },
                    {
                        field: 'Status', displayName: 'Status'
                    }
                ]
            }
            vm.trialOptions = {
                data: 'vm.trialnodes',
                multiSelect: false,
                showFilter: true,
                enableColumnResize: true,
                enableCellSelection: true,
                columnDefs: [
                    {
                        field: 'Sponsor', displayName: 'Sponsor'
                    },
                    {
                        field: 'Study_ID', displayName: 'Study', cellTemplate: vm.studyTemplate
                    },
                    {
                        field: 'TrialSite_ID', displayName: 'Trial', cellTemplate: vm.trialTemplate
                    },
                    {
                        field: 'Facility_Name', displayName: 'Facility'
                    },
                    {
                        field: 'LastName', displayName: 'Principle Investigator', cellTemplate: vm.nameTemplate
                    },
                    {
                        field: 'Stage', displayName: 'Stage'
                    },
                    {
                        field: 'Contacted', displayName: 'Contacted'
                    },
                    {
                        field: 'NumberOfSubjects', displayName: 'No. Subjects'
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

        function getStudy(username){
            // function to get a single studies information
            vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) WHERE S.Study_ID="' + vm.studyId + '"RETURN DISTINCT SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, S.Study_Name AS Study_Name, TS.TrialSite_ProcessingQuarter AS Processing_Quarter, S.Study_Status AS Status';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.studynodes = result.data.responseData;
            });
        }

        function getStudies(username){
            // function to return all the studies for a given user
            vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) RETURN DISTINCT SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, S.Study_Name AS Study_Name, TS.TrialSite_ProcessingQuarter AS Processing_Quarter, S.Study_Status AS Status';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.studynodes = result.data.responseData;
            });
        }

        function showTrials(studyId){
            // function to show the trials for the clicked study id
            console.log("showTrials");
            vm.query = 'MATCH (SP)-[:SPONSORS]->(S)-[:HAS_SITE]->(TS)<-[:RUNS_TRIAL]-(PI)<-[:HAS_INVESTIGATOR]-(F) WHERE S.Study_ID="' + studyId + '" Return SP.Sponsor AS Sponsor,S.Study_ID AS Study_ID,TS.TrialSite_ID AS TrialSite_ID, F.Facility_Name AS Facility_Name, PI.PI_LastName AS LastName, PI.PI_FirstName AS FirstName, TS.TrialSite_Stage AS Stage, TS.TrialSite_Contacted AS Contacted, TS.TrialSite_NumberOfSubjects AS NumberOfSubjects';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.trialnodes = result.data.responseData;
            });
        }

        function getTasks(username) {
            // function to return all the tasks for a given user
            vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[HT:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) WHERE HT.Task_IsReminderSet="Yes" RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, PI.PI_FirstName, PI.PI_LastName,  TR.Task_Number, TR.Task_Attempt, TK.Task_Subject AS Task_Subject, TK.Task_ContactType AS Task_ContactType, TK.Task_ReminderDate AS Task_ReminderDate, HT.Task_IsDeleted, HT.Task_IsClosed ORDER BY TS.TrialSite_ID ';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.tasknodes = result.data.responseData;
            });
        }

        function getTrialSites(username){
            // function to search for the trial sites for a given task
            vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) MATCH (SP)-[CT:CONTRACTS]->(F)-[:HAS_INVESTIGATOR]->(PI) WHERE TS.TrialSite_Stage="Needs Analysis" AND CT.Facility_Do_Not_Contact="FALSE" RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, F.Facility_Name AS Facility_Name, PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, PI.PI_State AS State, TS.TrialSite_NumberOfSubjects AS NumberOfSubjects, TS.TrialSite_Contacted AS LastContacted';
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                console.log(result.data.responseData);
                return vm.trialnodes = result.data.responseData;
            });

        }

    }
})();
