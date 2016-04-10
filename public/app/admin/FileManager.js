(function () {
    'use strict';

    var controllerId = 'FileManager';
    angular.module('app').controller(controllerId, ['common', 'datacontext', FileManager]);

    function FileManager(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'File Manager';
        vm.nodes = [];

        vm.chooseFile = chooseFile;
        vm.uploadFile = uploadFile;
        vm.getFileStatus = getFileStatus;

        activate();

        function activate(){
            var promises = [];
            common.activateController(promises, controllerId).then(function() { log('Activated File Manager'); });
        }

        function chooseFile() {
            // handles the user choosing a file to upload
        }

        function uploadFile() {
            // function that handles uploading the chosen file
        }

        function getFileStatus() {
            // gets the upload status for a given file
        }
    }

})();