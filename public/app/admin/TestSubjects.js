(function () {
    'use strict';

    // Organize the controller name and dependencies here for easy recognition
    var controllerId = 'TestSubjects';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$routeParams', TestSubjects]);

    // This is our controller...  think of it as a controller with a view model in it
    function TestSubjects(common, datacontext, $routeParams) {

        // Organizing all of the variables and functions here allows us to get a quick look at
        // what the controller is doing
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        var vm = this;
        vm.title = 'Test Subjects';
        vm.testSubjects = [];
        vm.siteId = $routeParams.trialSiteID;
        vm.studyId = $routeParams.studyId;

        // Our event handlers
        vm.getTestSubjects = getTestSubjects;
        vm.search = search;

        // Call this function when our controller is loaded
        activate();

        // ============  The work & logic   
        // ============  From here down we are implementing the functions that we defined above.  Clean organization.

        // The activate method takes care of any work that is needed to get the view up and running.
        // Things like calling a service to get data options for dropdowns, populate arrays, etc.
        // This convention will be used with all controllers.
        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Create View'); });
            vm.getTestSubjects();
            vm.testSubjectOptions = {
                data: 'vm.testSubjects',
                showFilter: true,
                enableColumnResize: true,
                enableRowSelection: true,
                columnDefs: [
                    {
                        field: 'Subject_ID', displayName: 'Subject ID'
                    },
                    {
                        field: 'Subject_RecruitedDate', displayName: 'Date Received'
                    },
                    {
                        field: 'Subject_FirstName', displayName: 'First Name'
                    },
                    {
                        field: 'Subject_LastName', displayName: 'Last Name'
                    },
                    {
                        field: 'Subject_SSN', displayName: 'SSN'
                    },
                    {
                        field: 'Subject_DateOfBirth', displayName: 'DOB'
                    },
                    {
                        field: 'Subject_Gender', displayName: 'Gender'
                    }

                ]
            }
        }

        function search(){

        }

        function getTestSubjects(){
            vm.query = 'MATCH (PI)-[:RUNS_TRIAL]-(TS)<-[:HAS_SITE]-(S) WHERE S.Study_ID = "' + vm.studyId + '" AND TS.TrialSite_ID="' + vm.siteId + '" WITH TS OPTIONAL MATCH (TS)-[:HAS_SUBJECT]-(T) RETURN T.Subject_ID AS Subject_ID, T.Subject_FirstName AS Subject_FirstName, T.Subject_LastName AS Subject_LastName, T.Subject_SSN AS Subject_SSN,T.Subject_DateOfBirth AS Subject_DateOfBirth, T.Subject_Gender AS Subject_Gender, T.Subject_RecruitedDate AS Subject_RecruitedDate, T.Subject_LastVisitCompleted AS Subject_LastVisitCompleted, T.Subject_Withdrawal_Date AS Subject_Withdrawal_Date, T.TrialSite_DateFileReceived AS TrialSite_DateFileReceive ORDER BY Subject_ID';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                console.log(result.data.responseData);
                return vm.testSubjects = result.data.responseData;
            });
        }

    }
})();
