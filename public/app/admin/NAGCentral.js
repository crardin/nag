(function () {
    'use strict';

    var controllerId = 'NAGCentral';
    angular.module('app').controller(controllerId, ['common', 'datacontext', NAGCentral]);

    function NAGCentral(common, datacontext) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'NAGCentral';
        vm.nodes = [];
        vm.trialnodes = [];
        vm.tasknodes = [];

        vm.runQuery = runQuery;
        vm.search = search;
        vm.getTasks = getTasks;
        vm.getTrialSites = getTrialSites;
        vm.getLastContactDates = getLastContactDates;
        vm.studyTemplate = '<div class="ngCellText"><a href=#/admin/Study/{{row.getProperty(col.field)}}>{{row.getProperty(col.field)}}</a></div>';
        vm.nameTemplate = '<div class="ngCellText"><a href=#/admin/Principal/LastName/{{row.getProperty(col.field)}}/FirstName/{{row.getProperty("FirstName")}}/TrialSiteId/{{row.getProperty("TrialSite_ID")}}>{{row.getProperty("FirstName")}} {{row.getProperty(col.field)}}</a></div>';
        vm.trialTemplate = '<div class="ngCellText"><a href=#/admin/Trial/TrialId/{{row.getProperty(col.field)}}/LastName/{{row.getProperty("LastName")}}/FirstName/{{row.getProperty("FirstName")}}/StudyId/{{row.getProperty("Study_ID")}}>{{row.getProperty(col.field)}}</a></div>';
        vm.phoneTemplate = '<div class="ngCellText">{{ (row.getProperty(col.field)) | tel }}</div>';
        vm.dateTemplate = '<div class="ngCellText">{{ (row.getProperty(col.field)) | date : "shortDate" }}</div>';
        vm.username = "Karen";

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated NAGCentral'); });
            vm.getTasks(vm.username);
            vm.getTrialSites(vm.username);
            vm.taskOptions = {
                data: 'vm.tasknodes',
                multiSelect: false,
                showFilter: true,
                enableColumnResize: true,
                columnDefs: [
                    {
                        field:'Sponsor',displayName:'Sponsor'
                    },
                    {
                        field:'Study_ID', displayName:'Study ID', cellTemplate: vm.studyTemplate
                    },
                    {
                        field:'TrialSite_ID', width: 75, displayName: 'Site ID', cellTemplate: vm.trialTemplate
                    },
                    {
                        field:'Facility_Name', width: 220, displayName: 'Facility Name'
                    },
                    {
                        field:'Facility_Phone_Number', displayName: 'Phone Number', cellTemplate: vm.phoneTemplate
                    },
                    {
                        field:'Task_ReminderDate', displayName: 'Reminder Date', cellTemplate: vm.dateTemplate
                    },
                    {
                        field:'Task_AM_PM', displayName: 'AM/PM'
                    }

                ]
            }
            vm.trialOptions = {
                data: 'vm.trialnodes',
                enableCellSelection: true,
                multiSelect: false,
                enableColumnResize: true,
                showFilter: true,
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
                        field:'Facility_Name', width: 220, displayName: 'Facility'
                    },
                    {
                        field: 'LastName', width: 150, displayName: 'PI', cellTemplate: vm.nameTemplate
                    },
                    {
                        field: 'State', displayName: 'State'
                    },
                    {
                        field: 'Contact_TelephoneNumber', displayName: 'Contact Phone Number', cellTemplate: vm.phoneTemplate
                    },
                    {
                        field: 'Task_CreatedDate', displayName: 'Last Contacted', cellTemplate: vm.dateTemplate
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

        function getTasks(username) {
            // function to return all the tasks for a given user
            //vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[HT:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) WHERE HT.Task_IsReminderSet="Yes" AND TS.TrialSite_Stage = "Needs Analysis" RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, TR.Task_Number, TR.Task_Attempt, TK.Task_Subject AS Task_Subject, TK.Task_ContactType AS Task_ContactType, TK.Task_AM_PM AS Task_AM_PM, TK.Task_ReminderDate AS Task_ReminderDate, HT.Task_IsDeleted, HT.Task_IsClosed ORDER BY TS.TrialSite_ID';
            vm.query = 'MATCH (CS:CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[HT:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO]-(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) WHERE HT.Task_IsReminderSet="Yes" AND TS.TrialSite_Stage = "Needs Analysis" WITH SP, S, TS, PI, TK, HT OPTIONAL MATCH (PI)<-[:HAS_INVESTIGATOR]-(F) RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, F.Facility_Name AS Facility_Name, F.Facility_Phone_Number AS Facility_Phone_Number, TK.Task_AM_PM AS Task_AM_PM, TK.Task_ReminderDate AS Task_ReminderDate, HT.Task_IsDeleted, HT.Task_IsClosed ORDER BY TS.TrialSite_ID';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.tasknodes = result.data.responseData;
            });
        }

        function getTrialSites_old(username){
            // function to search for the trial sites for a given task
            //vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S)<-[:SPONSORS]-(SP) MATCH (SP)-[CT:CONTRACTS]->(F)-[:HAS_INVESTIGATOR]->(PI) WHERE TS.TrialSite_Stage="Needs Analysis" AND CT.Do_Not_Contact="No" RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, F.Facility_Name AS Facility_Name, PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, PI.PI_State AS State, TS.TrialSite_NumberOfSubjects AS NumberOfSubjects, TS.TrialSite_Contacted AS LastContacted, CT.Contact_TelephoneNumbe AS Contact_TelephoneNumber';
            vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S) WHERE TS.TrialSite_Stage="Needs Analysis" WITH PI, TS, S OPTIONAL MATCH (PI)<-[:HAS_INVESTIGATOR]-(F)<-[CT:CONTRACTS {Do_Not_Contact:"No"}]-(SP) WITH PI, TS, F, S, SP, CT OPTIONAL MATCH (TS)-[:CONTACT_TYPE ]->(C) OPTIONAL MATCH (TK)-[:TASK_RELATES_TO]-(TS) RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, F.Facility_Name AS Facility_Name, CT.Do_Not_Contact, PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, PI.PI_State AS State, TS.TrialSite_NumberOfSubjects AS NumberOfSubjects, C.Contact_TelephoneNumber AS Contact_TelephoneNumber, TK.Task_CreatedDate AS Task_CreatedDate';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                return vm.trialnodes = result.data.responseData;
            });
        }

        function getLastContactDates(username){
            for (var i=0;i<vm.trialnodes.length; i++){
                console.log(vm.trialnodes[i]);
                vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S) WHERE S.Study_ID = "' + vm.trialnodes[i].Study_ID + '" AND TS.TrialSite_ID = "' + vm.trialnodes[i].TrialSite_ID + '" OPTIONAL MATCH (TS)-[:TASK_RELATES_TO {Task_Attempt:"' + vm.trialnodes[i].Task_Attempt + '"}]-(TK) RETURN DISTINCT TK.Task_Attempt, TK.Task_CreatedDate AS Task_CreatedDate';
                console.log(vm.query);
                vm.trialnodes[i].Task_CreatedDate = datacontext.runAdhocQuery(vm.query).then(function(result){
                    console.log(result.data.responseData);
                    return result.data.responseData.Task_CreatedDate;
                });
            }
        }

        function getTrialSites(username){
            // function to search for the trial sites for a given task
            vm.query = 'MATCH (CS: CSR {CSR_Owner:"' + username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS)<-[:HAS_SITE]-(S) WHERE TS.TrialSite_Stage="Needs Analysis" WITH PI, TS, S OPTIONAL MATCH (PI)<-[:HAS_INVESTIGATOR]-(F)<-[CT:CONTRACTS {Do_Not_Contact:"No"}]-(SP) WITH PI, TS, F, S, SP, CT OPTIONAL MATCH (TS)-[:CONTACT_TYPE {Type: "Primary"}]->(C) OPTIONAL MATCH (TK)-[:TASK_RELATES_TO]-(TS) WITH toInt(TK.Task_Attempt) AS Int_Task_Attempt ,PI, TS, F, S, SP, CT,C RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, max (Int_Task_Attempt) AS Task_Attempt, F.Facility_Name AS Facility_Name, CT.Do_Not_Contact, PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, PI.PI_State AS State, TS.TrialSite_NumberOfSubjects AS NumberOfSubjects, C.Contact_TelephoneNumber AS Contact_TelephoneNumber';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){
               // put the results into a structure here
               console.log(result.data.responseData);
               vm.trialnodes = result.data.responseData;
               //vm.getLastContactDates(username);
            });
        }
    }
})();
