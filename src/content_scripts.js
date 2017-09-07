/* global chrome */

(function() {
    'use strict';

    function dataToInput(obj) {
        var title = document.getElementById('issue_subject');
        title.value = '[friDay購物2.0][' + obj.moduleName + '] ' + obj.funcName;
    }

    function dataToTextarea(obj) {
        var textarea = document.getElementById('issue_description');
        var output = '[環境]\n正式站\n\n[描述]\n';

        output += obj.desc.replace(/(\n\n)/, '');
        output += '\n\n[希望完成日]\n' + obj.completeDay;
        output += '\n\n[EIP]\n' + obj.eipNumber+'\n'+obj.eipUrl;
        textarea.innerHTML = output;
        textarea.style.height = '400px';
    }

    function markWatcher() {
        var user = document.getElementsByClassName('user')[0].getAttribute('href');
        var id = user.replace('/users/', '');
        document.getElementById('issue_watcher_user_ids_' + id).getElementsByTagName('input')[0].checked = true;
    }

    function dataToRedmine(data) {

        document.getElementById('issue_tracker_id').value = '6';
        dataToInput(data);
        dataToTextarea(data);
        markWatcher();
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action == 'init') {
            var eform = document.getElementById('eform_content');
            var formData = eform.innerHTML;
            sendResponse({ formData: formData });
        } else {
            var obj = JSON.parse(request.data);
            dataToRedmine(obj);
        }
    });
})();
