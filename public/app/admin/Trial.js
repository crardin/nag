(function () {
    'use strict';

    var controllerId = 'Trial';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$routeParams', '$filter', Trial]);

    function Trial(common, datacontext, $routeParams, $filter) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Trial';
        vm.nodes = [];
        vm.studynodes = [];
        vm.trialnodes = [];
        vm.selectedContactType = 'Alternate';
        vm.TaskImportantNotes = "";
        vm.fixDate = fixDate;
        vm.selectedTaskContact = "";
        vm.primaryContact = {
            FirstName: "",
            LastName: "",
            Name: "",
            Title: "",
            PhoneNumber: "",
            Email: "",
            Fax: "",
            Department: "",
            contactMethod: "phone"
        };
        vm.taskContact = {
            FirstName: "",
            LastName: "",
            Name: "",
            Title: "",
            PhoneNumber: "",
            Email: "",
            Fax: "",
            Department: "",
            contactMethod: "phone"
        };
        vm.contact = {
            FirstName: "",
            LastName: "",
            Name: "",
            Title: "",
            PhoneNumber: "",
            Email: "",
            Fax: "",
            Department: "",
            contactMethod: "phone",
            Type: "Alternate"
        };
        vm.contacts = [];
        vm.importedContacts = [];
        vm.trialId = $routeParams.trialId;
        vm.lastname = $routeParams.lastname;
        vm.firstname = $routeParams.firstname;
        vm.studyId = $routeParams.StudyID;
        vm.tasknumber = 0;
        vm.taskAttempt = 1;
        vm.taskInfo = [];
        vm.Task = {
            Subject: "",
            Notes: "",
            Attempts: 0,
            ContactType: "",
            Status: "",
            ReminderSet: false,
            ReminderDate: vm.fixDate(new Date()),
            AMPM: "AM",
            Priority: "",
            AssociatedTrials: [],
            AssociatedTrials_Status: [],
            FacilityInformation: [],
            CloseFlag: false // false is close, true is delete
        };
        vm.trial = {
            ID: vm.trialId,
            Sponsor: "",
            Name: "",
            Status: "",
            Stage: "",
            NumberOfSubjects: "",
            TaskNumber: ""
        };
        vm.facility = {
            name: "",
            phone: "",
            fax: ""
        };
        vm.principalInvestigator = {
            LastName: vm.lastname,
            FirstName: vm.firstname,
            Name: vm.firstname + ' ' + vm.lastname,
            Address: "",
            City: "",
            State: "",
            Zip: "",
            PhoneNumber: "",
            FaxNumber: "",
            Email: ""
        };
        vm.trialSite_StatusValues = [];
        vm.runQuery = runQuery;
        vm.search = search;
        vm.getPrincipalInvestigator = getPrincipalInvestigator;
        vm.getTaskNumber = getTaskNumber;
        vm.getTaskInfo = getTaskInfo;
        vm.getPrimaryContact = getPrimaryContact;
        vm.getContacts = getContacts;
        vm.showTaskInfo = showTaskInfo;
        vm.hideTaskInfo = hideTaskInfo;
        vm.getAssociatedTrials = getAssociatedTrials;
        vm.getFacilityInformation = getFacilityInformation;
        vm.setReminderDateFlag = setReminderDateFlag;
        vm.fillContactForm = fillContactForm;
        vm.fillAlternateContactForm = fillAlternateContactForm;
        vm.newContactForm = newContactForm;
        vm.addContact = addContact;
        vm.removeContact = removeContact;
        vm.importContacts = importContacts;
        vm.saveImports = saveImports;
        vm.getPIContacts = getPIContacts;
        vm.getLocationContacts = getLocationContacts;
        vm.addContactToArray = addContactToArray;
        vm.checkAddPermission = checkAddPermission;
        vm.uploadFiles = uploadFiles;
        vm.fillTaskObject = fillTaskObject;
        vm.checkTrials = checkTrials;
        vm.newContact = newContact;
        vm.updateTaskContact = updateTaskContact;
        vm.getTaskContact = getTaskContact;
        vm.getTaskAttempt = getTaskAttempt;
        vm.updateTrialStatus = updateTrialStatus;
        vm.updateImportantNotes = updateImportantNotes;
        vm.getImportantNotes = getImportantNotes();
        vm.nameTemplate = '<div class="ngCellText"><a href=#/admin/Principal/LastName/{{row.getProperty(col.field)}}/FirstName/{{row.getProperty("FirstName")}}/TrialSiteId/{{row.getProperty("TrialSite_ID")}}>{{row.getProperty("FirstName")}} {{row.getProperty(col.field)}}</a></div>';
        vm.dateTemplate = '<div class="ngCellText">{{ (row.getProperty(col.field)) | date : "shortDate" }}</div>';
        vm.noteTemplate = '<div class="ngCellText wordWrap">{{row.getProperty(col.field)}}</div>';
        vm.showTrial = false;
        vm.username = "Karen";
        vm.clearTaskForm = clearTaskForm;
        vm.saveTask = saveTask;
        vm.closeTask = closeTask;
        vm.primaryFlag = false;
        vm.addFlag = false;
        vm.addTaskFlag = false;
        vm.showWarning = false;
        vm.trialSite_stage = '';

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Trial Page');
                });

            vm.historyOptions = {
                data: 'vm.taskInfo',
                multiSelect: false,
                showFilter: true,
                enableColumnResize: true,
                rowHeight: 75,
                columnDefs: [
                    {
                        field: 'Task_CreatedDate', displayName: 'Date'
                    },
                    {
                        field: 'Contact_LastName', displayName: 'Contact', cellTemplate: vm.nameTemplate
                    },
                    {
                        field: 'Task_ContactType', displayName: 'Type'
                    },
                    {
                        field: 'Task_Subject', displayName: 'Subject'
                    },
                    {
                        field: 'Task_Notes', displayName: 'Notes', cellTemplate: vm.noteTemplate
                    },
                    {
                        field: 'TrialSite_Stage', displayName: 'Trial Site Stage'
                    }
                ]
            }

            vm.getPrincipalInvestigator();
            return vm.getTaskNumber().then( function() {
                vm.getPrimaryContact();
                vm.getTaskContact();
                vm.getFacilityInformation();
                vm.getContacts();
            });
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

            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                return vm.nodes = result.data;
            });
        }

        function getPrincipalInvestigator() {
            // function to return the investigator and trial information
            vm.query = 'MATCH (SP)-[:SPONSORS]->(S)-[:HAS_SITE]->(TS)<-[:RUNS_TRIAL]-(PI)<-[:ASSIGNED_PI]-(CS: CSR {CSR_Owner:"' + vm.username + '"}) WHERE S.Study_ID="' + vm.studyId + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN SP.Sponsor AS Sponsor, S.Study_ID AS Study_ID, S.Study_Name AS Study_Name, PI.PI_FirstName AS FirstName, PI.PI_LastName AS LastName, PI.PI_StreetAddress AS StreetAddress, PI.PI_City AS City, PI.PI_State AS State, PI.PI_Zip AS Zip, PI.PI_Country AS Country, PI.PI_Email AS Email, PI.PI_TelephoneNumber AS TelephoneNumber, PI.PI_FaxNumber AS FaxNumber, TS.TrialSite_Status AS Status, TS.TrialSite_NumberOfSubjects AS NumberOfSubjects, TS.TrialSite_Stage AS Stage, TS.TrialSite_ProcessingQuarter AS ProcessingQuarter, TS.TrialSite_DateFileReceived AS DateFileReceived, CS.CSR_Owner AS CSR_Owner';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                var data = result.data.responseData[0];
                vm.principalInvestigator.Address = data.StreetAddress;
                vm.principalInvestigator.City = data.City;
                vm.principalInvestigator.State = data.State;
                vm.principalInvestigator.Zip = data.Zip;
                vm.principalInvestigator.PhoneNumber = data.TelephoneNumber;
                vm.principalInvestigator.FaxNumber = data.FaxNumber;
                vm.principalInvestigator.Email = data.Email;
                vm.trial.Sponsor = data.Sponsor;
                vm.trial.Name = data.Study_Name;
                vm.trial.Status = data.Status;
                vm.trial.Stage = data.Stage;
                vm.trial.NumberOfSubjects = data.NumberOfSubjects;
                vm.trialnodes = result.data.responseData;
                return vm.principalInvestigator;
            });
        }

        function getTaskNumber() {
            //vm.query = 'MATCH (PI)-[:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO] ->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN TR.Task_Number AS Task_Number ORDER BY TR.Task_Attempt DESC';
            vm.query = 'MATCH (PI)-[:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO] ->(TS)<-[:HAS_SITE]-(S) WHERE  S.Study_ID = "' + vm.studyId + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN TR.Task_Number AS Task_Number ORDER BY TR.Task_Attempt DESC';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                if (result.data.responseData.length > 0) {
                    vm.trial.TaskNumber = result.data.responseData[0].Task_Number;
                    vm.getTaskAttempt();
                    return vm.tasknumber = result.data.responseData[0].Task_Number;
                }
            });
        }

        function getTaskAttempt() {
            vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS)<-[NTR:TASK_RELATES_TO]-(TK) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN MAX(TOINT(NTR.Task_Attempt)) AS Task_Attempt';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function(result){
                if (result.data.responseData.length>0) {
                    return vm.taskAttempt = result.data.responseData[0].Task_Attempt;
                } else {
                    return vm.taskAttempt = 1;
                }
            });
        }

        function updateImportantNotes() {
            // this function will handle updating the important notes field
            vm.query = '';
            return datacontext.runAdhocQuery(vm.query).then(function(result){

            });
        }

        function getImportantNotes() {
            // this function will handle getting the latest important notes
            //vm.TaskImportantNotes = result.data.responseData[1].Task_ImportantNotes;
            vm.query = '';
            return datacontext.runAdhocQuery(vm.query).then(function(result){

            });
        }

        function getFacilityInformation() {
            vm.query = 'MATCH (SP)-[:SPONSORS]->(S)-[:HAS_SITE]->(TS)<-[:RUNS_TRIAL]-(PI)<-[:HAS_INVESTIGATOR]-(F) WHERE S.Study_ID="' + vm.studyId + '" AND PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN F.Facility_Name AS Facility_Name, F.Facility_Phone_Number AS Facility_Phone_Number, F.Facility_Fax_Number AS Facility_Fax_Number';
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                var data = result.data.responseData[0];
                vm.facility.name = data.Facility_Name;
                vm.facility.phone = data.Facility_Phone_Number;
                vm.facility.fax = data.Facility_Fax_Number;
            });
        }

        function getPrimaryContact() {
            //vm.query = 'MATCH (PI)<-[:HAS_INVESTIGATOR]-(F)<-[:CONTRACTS]-(SP)-[:SPONSORS]->(S)-[:HAS_SITE]->(TS)-[:CONTACT_TYPE {Type: "Primary"}]->(C) WHERE S.Study_ID="' + vm.studyId + '" AND PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber';
            vm.query = 'MATCH (S)-[:HAS_SITE]->(TS)-[:CONTACT_TYPE {Type: "Primary"}]->(C) WHERE S.Study_ID="' + vm.studyId + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                var data = result.data.responseData[0];
                if (data) {
                    vm.primaryContact.FirstName = data.Contact_FirstName;
                    vm.primaryContact.LastName = data.Contact_LastName;
                    vm.primaryContact.Name = data.Contact_FirstName + ' ' + data.Contact_LastName;
                    vm.primaryContact.Title = data.Contact_Title;
                    vm.primaryContact.PhoneNumber = data.Contact_TelephoneNumber;
                    vm.primaryContact.Email = data.Contact_EmailAddress;
                    vm.primaryContact.Fax = data.Contact_FaxNumber;
                    vm.primaryContact.Type = "Primary";
                }
                return vm.primaryContact;
            });
        }

        function getContacts() {
            //vm.query = 'MATCH (PI)<-[:HAS_INVESTIGATOR]-(F)<-[:CONTRACTS]-(SP)-[:SPONSORS]->(S)-[:HAS_SITE]->(TS)-[:CONTACT_TYPE]->(C) WHERE S.Study_ID="' + vm.studyId + '" AND PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber';
            vm.query = 'MATCH (S)-[:HAS_SITE]->(TS)-[:CONTACT_TYPE {Type: "Alternate"}]->(C) WHERE S.Study_ID="' + vm.studyId + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                return vm.contacts = result.data.responseData;
            });
        }

        function getTaskContact() {
            //vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS)-[TR:TASK_RELATES_TO {Task_Number:"' + vm.trial.TaskNumber + '"}]-(TK)<-[:RESPONSIBLE_PERSON]-(C) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber, C.Contact_PreferredContactMethod AS Contact_PreferredContactMethod, TR.Task_Attempt AS Task_Attempt ORDER BY TR.Task_Attempt DESC';
            vm.query = 'MATCH (S)-[:HAS_SITE]->(TS)-[TR:TASK_RELATES_TO {Task_Number:"' + vm.trial.TaskNumber + '"}]-(TK)<-[:RESPONSIBLE_PERSON]-(C) WHERE S.Study_ID="' + vm.studyId + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber, C.Contact_PreferredContactMethod AS Contact_PreferredContactMethod, TR.Task_Attempt AS Task_Attempt ORDER BY TR.Task_Attempt DESC';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                var data = result.data.responseData[0];
                if (data) {
                    console.log(data);
                    vm.taskContact.FirstName = data.Contact_FirstName;
                    vm.taskContact.LastName = data.Contact_LastName;
                    vm.taskContact.Name = data.Contact_FirstName + ' ' + data.Contact_LastName;
                    vm.taskContact.Title = data.Contact_Title;
                    vm.taskContact.PhoneNumber = data.Contact_TelephoneNumber;
                    vm.taskContact.Email = data.Contact_EmailAddress;
                    vm.taskContact.Fax = data.Contact_FaxNumber;
                    vm.taskContact.Type = "Task";
                }
                return vm.taskContact;
            });
        }

        function checkAddPermission() {
            // checks if the user can add a contact to the PI
            vm.query = 'IF MATCH (CS: CSR {CSR_Owner:"' + vm.username + '"})-[:ASSIGNED_PI]->(PI)-[:RUNS_TRIAL]->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" RETURN PI AS OK';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                console.log(result.data.responseData);
                return result.data.responseData;
            });

        }

        function addContact() {
            // function to add a contact to the database
            console.log("inside add contact");
            vm.query = 'MATCH (S)-[:HAS_SITE]->(TS) WHERE S.Study_ID="' + vm.studyId + '" AND TS.TrialSite_ID="' + vm.trialId + '" MERGE(C:Contact {Contact_Title:"' + vm.contact.Title + '", Contact_FirstName:"' + vm.contact.FirstName + '", Contact_LastName:"' + vm.contact.LastName + '", Contact_Department:"' + vm.contact.Department + '", Contact_EmailAddress:"' + vm.contact.Email + '", Contact_FaxNumber:"' + vm.contact.Fax + '", Contact_TelephoneNumber:"' + vm.contact.PhoneNumber + '"}) MERGE (TS)-[:CONTACT_TYPE {Type: "' + vm.contact.Type + '"}]->(C) RETURN C';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                console.log(result);
                vm.getContacts();
            });
        }

        function removeContact() {
            // function to remove a contact to the database
            vm.query = '';
            return datacontext.runAdhocQuery(vm.query).then(function (result) {

            });
        }

        function uploadFiles() {
            // function to upload files
        }

        function addContactToArray(contactArray) {
            // adds the objects in the array to the imported contacts array
            for (var i = 0; i < contactArray.length; i++) {
                vm.importedContacts.push(contactArray[i]);
            }
        }

        function getPIContacts() {
            vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS)-[:CONTACT_TYPE {Type: "Primary"}]->(C) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN DISTINCT C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber, C.Contact_PreferredContactMethod AS Contact_PreferredContactMethod';
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                console.log(result.data.responseData);
                return vm.addContactToArray(result.data.responseData);
            });
        }

        function getLocationContacts() {
            vm.query = 'MATCH (PI)<-[:HAS_INVESTIGATOR]-(F)-[:EMPLOYS]->(C) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN DISTINCT C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber, C.Contact_PreferredContactMethod AS Contact_PreferredContactMethod';
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                console.log(result.data.responseData);
                return vm.addContactToArray(result.data.responseData);
            });
        }

        function importContacts() {
            // function to import existing contacts from PI and Facility data
            vm.importedContacts = [];
            return vm.getPIContacts().then(function () {
                return vm.getLocationContacts().then(function () {
                    console.log(vm.importedContacts);
                    vm.saveImports();
                })
            });
        }

        function saveImports() {
            // performs the actual functions of the contact import
            for (var i = 0; i < vm.importedContacts.length; i++) {
                vm.newContactForm();
                var currentContact = vm.importedContacts[i];
                vm.contact.FirstName = currentContact.Contact_FirstName;
                vm.contact.LastName = currentContact.Contact_LastName;
                vm.contact.Name = currentContact.Contact_FirstName + ' ' + currentContact.Contact_LastName;
                vm.contact.Title = currentContact.Contact_Title;
                vm.contact.PhoneNumber = currentContact.Contact_TelephoneNumber;
                vm.contact.Email = currentContact.Contact_EmailAddress;
                vm.contact.Fax = currentContact.Contact_FaxNumber;
                vm.contact.Department = "";
                vm.contact.contactMethod = currentContact.Contact_PrefferedContactMethod;
                vm.contact.Type = "Alternate";
                vm.query = 'MATCH (TS) WHERE  TS.TrialSite_ID="' + vm.trialId + '" MERGE(C:Contact {Contact_Title:"' + vm.contact.Title + '", Contact_FirstName:"' + vm.contact.FirstName + '", Contact_LastName:"' + vm.contact.LastName + '", Contact_Department:"' + vm.contact.Department + '", Contact_EmailAddress:"' + vm.contact.Email + '", Contact_FaxNumber:"' + vm.contact.FaxNumber + '", Contact_TelephoneNumber:"' + vm.contact.PhoneNumber + '"}) MERGE (TS)-[:CONTACT_TYPE {Type: "' + vm.contact.Type + '"}]->(C) RETURN C';
                return datacontext.runAdhocQuery(vm.query).then(function (result) {
                    console.log(result);
                });
            }
        }

        function setReminderDateFlag() {
            // sets the reminder date flag when a date is chosen
            vm.Task.ReminderSet = "Yes";
        }

        function getAssociatedTrials() {
            // function to return the associated trials for a given Task
            vm.query = 'MATCH (PI)-[:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO {Task_Number:"' + vm.tasknumber + '"}]->(TS)<-[:HAS_SITE]-(S) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN DISTINCT S.Study_ID AS Study_ID, TS.TrialSite_ID AS TrialSite_ID, TS.TrialSite_Status AS TrialSite_Status, TS.TrialSite_Stage AS TrialSite_Stage';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                console.log(result.data.responseData);
                return vm.Task.AssociatedTrials = result.data.responseData;
            });
        }

        function fillAlternateContactForm(input_node) {
            // function to fill the popup contact form when the alternate contacts are clicked
            vm.contact.FirstName = input_node.Contact_FirstName;
            vm.contact.LastName = input_node.Contact_LastName;
            vm.contact.Name = input_node.Contact_FirstName + ' ' + input_node.Contact_LastName;
            vm.contact.Title = input_node.Contact_Title;
            vm.contact.PhoneNumber = input_node.Contact_TelephoneNumber;
            vm.contact.Email = input_node.Contact_EmailAddress;
            vm.contact.Fax = input_node.Contact_FaxNumber;
            vm.contact.Department = "";
            vm.contact.contactMethod = "phone";
            vm.contact.Type = "Alternate";
        }

        function fillContactForm() {
            // function to fill the popup Contact form when the contact is clicked
            vm.contact.FirstName = vm.primaryContact.FirstName;
            vm.contact.LastName = vm.primaryContact.LastName;
            vm.contact.Name = vm.contact.FirstName + ' ' + vm.contact.LastName;
            vm.contact.Title = vm.primaryContact.Title;
            vm.contact.PhoneNumber = vm.primaryContact.PhoneNumber;
            vm.contact.Email = vm.primaryContact.Email;
            vm.contact.Fax = vm.primaryContact.Fax;
            vm.contact.Department = vm.primaryContact.Department;
            vm.contact.contactMethod = vm.primaryContact.contactMethod;
            vm.contact.Type = vm.primaryContact.Type;
        }

        function newContactForm() {
            // function to generate a clean contact form
            vm.contact.FirstName = "";
            vm.contact.LastName = "";
            vm.contact.Name = "";
            vm.contact.Title = "";
            vm.contact.PhoneNumber = "";
            vm.contact.Email = "";
            vm.contact.Fax = "";
            vm.contact.Department = "";
            vm.contact.contactMethod = "phone";
            vm.contact.Type = "Alternate";
        }

        function getTaskInfo() {
            // function to retrieve task info based on task number and PI name
            //vm.query = 'MATCH (PI)-[HT:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO {Task_Number:"' + vm.tasknumber + '"}] ->(TS)-[:CONTACT_TYPE]->(C) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" RETURN TR.Task_Attempt AS Task_Attempt, HT.Task_IsReminderSet AS Task_IsReminderSet, HT.Task_IsClosed AS Task_IsClosed, HT.Task_IsDeleted AS Task_IsDeleted, TK.Task_DateTime AS Task_DateTime, TK.Task_Priority AS Task_Priority, TK.Task_ContactType AS Task_ContactType, TK.Task_ImportantNotes AS Task_ImportantNotes, TK.Task_Subject AS Task_Subject, TK.Task_Notes AS Task_Notes, TK.Task_CreatedBy AS Task_CreatedBy, TK.Task_CreatedDate AS Task_CreatedDate,TK.Task_ReminderDate AS Task_ReminderDate, TK.Task_Status AS Task_Status, C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber, C.Contact_PreferredContactMethod AS Contact_PreferredContactMethod ORDER BY TR.Task_Attempt DESC';
            vm.query = 'MATCH (PI)-[HT:HAS_TASK]->(TK)-[TR:TASK_RELATES_TO {Task_Number:"' + vm.tasknumber + '"}]-(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" WITH PI, TK, HT, TS, TR OPTIONAL MATCH(TK)-[:RESPONSIBLE_PERSON]->(C) RETURN TR.Task_Attempt AS Task_Attempt, HT.Task_IsReminderSet AS Task_IsReminderSet, HT.Task_IsClosed AS Task_IsClosed, HT.Task_IsDeleted AS Task_IsDeleted, TK.Task_Priority AS Task_Priority, TK.Task_ContactType AS Task_ContactType, TK.Task_ImportantNotes AS Task_ImportantNotes, TK.Task_Subject AS Task_Subject, TK.Task_Notes AS Task_Notes, TK.Task_CreatedBy AS Task_CreatedBy, TK.Task_CreatedDate AS Task_CreatedDate,TK.Task_ReminderDate AS Task_ReminderDate, TK.Task_Status AS Task_Status, TK.TrialSite_Stage AS TrialSite_Stage, C.Contact_Title AS Contact_Title, C.Contact_FirstName AS Contact_FirstName, C.Contact_LastName AS Contact_LastName, C.Contact_EmailAddress AS Contact_EmailAddress, C.Contact_FaxNumber AS Contact_FaxNumber, C.Contact_TelephoneNumber AS Contact_TelephoneNumber, C.Contact_PreferredContactMethod AS Contact_PreferredContactMethod ORDER BY TOINT(TR.Task_Attempt) DESC';
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                // get the task important notes from the latest entry
                if (result.data.responseData.length>1){
                    vm.TaskImportantNotes = result.data.responseData[0].Task_ImportantNotes;
                    //vm.fillTaskObject(result.data.responseData[0]);
                    console.log(result.data.responseData);
                }
                return vm.taskInfo = result.data.responseData;
            });
        }

        function fillTaskObject(inputData) {
            console.log(inputData);
            vm.Task.Subject = inputData.Task_Subject;
            vm.Task.Notes = inputData.Task_Notes;
            vm.Task.Attempts = inputData.Task_Attempt;
            vm.Task.ContactType = inputData.Task_ContactType;
            vm.Task.Status = inputData.Task_Status;
            if (inputData.Task_IsReminderSet == "No") {
                vm.Task.ReminderSet = "No";
            } else {
                vm.Task.ReminderSet = "Yes";
            }

            vm.Task.ReminderDate = vm.fixDate(new Date(inputData.Task_ReminderDate));
            vm.Task.AMPM = "AM";
            vm.Task.Priority = inputData.Task_Priority;
            vm.Task.CloseFlag = false; // false is close, true is delete
        }

        function showTaskInfo(taskNumber) {
            // function to handle showing a task when the task number is clicked
            if (taskNumber) {
                vm.showTask = true;
                vm.tasknumber = taskNumber;
                vm.getTaskInfo();
                vm.getAssociatedTrials();
            }
        }

        function hideTaskInfo() {
            vm.showTask = false;
        }

        function clearTaskForm() {
            // function to clear the values in the task form without saving
            vm.Task.Subject = "";
            vm.Task.Notes = "";
            vm.Task.Attempts = vm.taskAttempt;
            vm.Task.ContactType = "";
            vm.Task.Status = "";
            vm.Task.ReminderSet = "No";
            vm.Task.ReminderDate = vm.fixDate(new Date());
            vm.Task.AMPM = "AM";
            vm.Task.Priority = "";
            //vm.Task.AssociatedTrials = [];
            vm.Task.AssociatedTrials_Status = [];
            vm.Task.FacilityInformation = [];
            vm.Task.CloseFlag = false; // false is close, true is delete
        }

        function checkTrials(){
            // checks to make sure there are no "Needs Analysis" status trials
            for (var i = 0; i < vm.Task.AssociatedTrials.length; i++) {
                if (vm.Task.AssociatedTrials[i].TrialSite_Stage == "Needs Analysis") {
                    // inform the user that there are trials pending
                    // make sure that the checkbox remains unchecked
                    vm.showWarning = true;
                    vm.addTaskFlag = !vm.addTaskFlag;
                    break;
                }
            }
        }

        function newContact() {
            // function to add a new contact to the system
            vm.query = '';
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                // refresh the contact data
                vm.getContacts();
            });
        }

        function fixDate(dateToFix) {
            // function to fix the date for display on the screen
            dateToFix = $filter("date")(dateToFix, 'yyyy-MM-dd');
            return dateToFix;
        }

        function saveTask_old() {
            // function to save the values in the task form
            // first check to make sure there are no trial statuses of need analysis
            vm.checkTrials().then(function() {
                if (vm.addTaskFlag) {
                    vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" MERGE (NTK:Task {Task_DateTime:"' + new Date().toString() + '", Task_Priority:"' + vm.Task.Priority + '", Task_ContactType:"' + vm.Task.ContactType + '", Task_ImportantNotes:"' + vm.TaskImportantNotes + '", Task_Subject:"' + vm.Task.Subject + '", Task_Notes:"' + vm.Task.Notes + '", Task_CreatedBy:"' + vm.username + '", Task_CreatedDate:"' + new Date().toString() + '", Task_ReminderDate:"' + vm.Task.ReminderDate.toString() + '", Task_Status:"' + vm.Task.Status + '"}) MERGE (C: Contact {Contact_Title:"' + vm.primaryContact.Title + '", Contact_FirstName:"' + vm.primaryContact.FirstName + '", Contact_LastName:"' + vm.primaryContact.LastName + '", Contact_EmailAddress:"' + vm.primaryContact.Email + '", Contact_FaxNumber:"' + vm.primaryContact.Fax + '", Contact_TelephoneNumber:"' + vm.primaryContact.PhoneNumber + '", Contact_PreferredContactMethod:"' + vm.primaryContact.contactMethod + '"}) MERGE (TS: TrialSite {TrialSite_Stage:"' + vm.Task.AssociatedTrials_Status[0] + '"}) MERGE (PI)-[HT:HAS_TASK {Task_IsReminderSet:"' + vm.Task.ReminderSet + '", Task_IsClosed:"' + vm.Task.CloseFlag + '", Task_IsDeleted:"' + vm.Task.CloseFlag + '"}]->(NTK) MERGE (NTK)-[NTR:TASK_RELATES_TO {Task_Number:"' + vm.tasknumber + '",Task_Attempt:"' + vm.Task.Attempts + '"}]->(TS) MERGE (NTK)<-[:RESPONSIBLE_PERSON]-(C) RETURN NTK';
                    return datacontext.runAdhocQuery(vm.query).then(function (result) {
                        console.log(result.data.responseData);
                    });
                } else {
                    console.log("in progress trials still present");
                }
            });
        }

        function saveTask() {
            // function to save the values in the task form
            vm.taskAttempt = parseInt(vm.taskAttempt) + 1;
            //vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" MERGE (NTK:Task {Study_ID: "' + vm.studyId + '", Site_ID: "' + vm.trialId + '", Task_Priority:"' + vm.Task.Priority + '", Task_ContactType:"' + vm.Task.ContactType + '", Task_ImportantNotes:"' + vm.TaskImportantNotes + '", Task_Subject:"' + vm.Task.Subject + '", Task_Notes:"' + vm.Task.Notes + '", Task_CreatedBy:"' + vm.username + '", Task_CreatedDate:"' + new Date().toString() + '", Task_ReminderDate:"' + vm.Task.ReminderDate.toString() + '", Task_AM_PM: "' + vm.Task.AMPM + '", Task_Status:"' + vm.Task.Status + '",Task_Number:"' + vm.tasknumber + '",Task_Attempt:"' + vm.taskAttempt + '", TrialSite_Stage:"' + vm.Task.AssociatedTrials[0].TrialSite_Stage + '"}) MERGE (C: Contact {Contact_Title:"' + vm.primaryContact.Title + '", Contact_FirstName:"' + vm.primaryContact + '", Contact_LastName:"' + vm.primaryContact + '", Contact_EmailAddress:"' + vm.primaryContact.Email + '", Contact_FaxNumber:"' + vm.primaryContact.Fax + '", Contact_TelephoneNumber:"' + vm.primaryContact.PhoneNumber + '", Contact_PreferredContactMethod:"' + vm.primaryContact.contactMethod + '"}) SET (PI)-[HT:HAS_TASK {Task_IsReminderSet:"No", Task_IsClosed:"No", Task_IsDeleted:"No"}]->(NTK) SET (NTK)-[NTR:TASK_RELATES_TO {Task_Number:"' + vm.tasknumber + '",Task_Attempt:"' + vm.taskAttempt + '"}]->(TS) MERGE (NTK)<-[:RESPONSIBLE_PERSON]-(C) RETURN NTK';
            vm.query = 'MATCH (PI)-[:RUNS_TRIAL]-(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" MERGE (PI)-[HT:HAS_TASK {Task_IsReminderSet:"' + vm.Task.ReminderSet + '", Task_IsClosed:"No", Task_IsDeleted:"No"}]-> (NTK: Task {Study_ID: "' + vm.studyId + '", Site_ID: "' + vm.trialId + '", Task_Priority:"' + vm.Task.Priority + '", Task_ContactType:"' + vm.Task.ContactType + '", Task_ImportantNotes:"' + vm.TaskImportantNotes + '", Task_Subject:"' + vm.Task.Subject + '", Task_Notes:"' + vm.Task.Notes + '", Task_CreatedBy:"' + vm.username + '", Task_CreatedDate:"' + new Date().toString() + '", Task_ReminderDate:"' + vm.Task.ReminderDate.toString() + '", Task_AM_PM: "' + vm.Task.AMPM + '", Task_Status:"' + vm.Task.Status +'",Task_Number:"' + vm.tasknumber + '",Task_Attempt:"' + vm.taskAttempt + '", TrialSite_Stage:"' + vm.Task.AssociatedTrials[0].TrialSite_Stage + '"}) <-[NTR:TASK_RELATES_TO {Task_Number:"' + vm.tasknumber + '",Task_Attempt:"' + vm.taskAttempt + '"}]-(TS) MERGE (C: Contact {Contact_Title:"' + vm.primaryContact.Title + '", Contact_FirstName:"' + vm.primaryContact.FirstName + '", Contact_LastName:"' + vm.primaryContact.LastName + '", Contact_EmailAddress:"' + vm.primaryContact.Email + '", Contact_FaxNumber:"' + vm.primaryContact.Fax + '", Contact_TelephoneNumber:"' + vm.primaryContact.PhoneNumber + '", Contact_PreferredContactMethod:"' + vm.primaryContact.contactMethod + '"}) MERGE (NTK)-[:RESPONSIBLE_PERSON]->(C)RETURN NTK';
            vm.query = vm.query.replace(/""/g, '" "');
            console.log(vm.query);
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                console.log(result.data.responseData);
                vm.clearTaskForm();
                vm.showTaskInfo(vm.tasknumber);
            });
        }

        function updateTrialStatus(selected_node){
            // function to update the trial status when the value is changed on the form
            // reset the warning to false
            console.log(selected_node);
            vm.trialSite_stage = selected_node.TrialSite_Stage;
            vm.showWarning = false;
            vm.query = 'MATCH (PI)-[:RUNS_TRIAL]->(TS) WHERE PI.PI_FirstName="' + vm.firstname + '" AND PI.PI_LastName="' + vm.lastname + '" AND TS.TrialSite_ID="' + vm.trialId + '" SET TS.TrialSite_Stage = "' + selected_node.TrialSite_Stage + '"';
            return datacontext.runAdhocQuery(vm.query).then(function(result) {
                vm.getAssociatedTrials();
            });
        }

        function closeTask(){
            // function to save the current changes and close out the task
            vm.query = '';
            return datacontext.runAdhocQuery(vm.query).then(function(result){

            });
        }

        function updateTaskContact() {
            // function to handle updating the contact for a given task
            console.log("ran update task contact");
            console.log(vm.selectedTaskContact);
            //vm.taskContact.FirstName = selected_contact.Contact_FirstName;
            //vm.taskContact.LastName = selected_contact.Contact_LastName;
            //vm.taskContact.Name = selected_contact.Contact_FirstName + ' ' + selected_contact.Contact_LastName;
            //vm.taskContact.Title = selected_contact.Contact_Title;
            //vm.taskContact.PhoneNumber = selected_contact.Contact_TelephoneNumber;
            //vm.taskContact.Email = selected_contact.Contact_Email;
            //vm.taskContact.Fax = selected_contact.Contact_FaxNumber;
            //vm.taskContact.Department = "";
            //vm.taskContact.contactMethod = "phone";

            vm.query = '';
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                console.log(result.data.responseData);
            });
        }
    }
})();