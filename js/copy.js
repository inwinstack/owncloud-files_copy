/**
 * ownCloud - files_copy
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author simon <simon.l@inwinstack.com>
 * @copyright simon 2016
 */

if(!OCA.Files_copy){
	/**
	 * Namespace for the files_copy app
	 * @namespace OCA.Files_copy
	 */
	OCA.Files_copy = {};
}
/**
 * @namespace OCA.Files_copy.copy
 */
OCA.Files_copy.Copy = {
	/**
	 * @var string appName used for translation file
	 * as transifex uses the github project name, use this instead of the appName
	 */
	appName: 'oc_files_copy',
	registerFileAction: function(){
		var img = OC.imagePath('files_copy','copy');
		OCA.Files.fileActions.register(
			'all',
			t(this.appName,'Copy'),
			OC.PERMISSION_READ,
			OC.imagePath('files_copy','copy'),
			function(file) {
			    OCA.Files_copy.Copy.createUI(true,file);
			}
		);
		
        // append copy button to Actions
		var el = $('#app-content-files #headerName .selectedActions');
		$('<a class="copy" id="copy" href=""><img class="svg" src="'+img+'" alt="'+t(this.appName,'Copy')+'">'+t(this.appName,'Copy')+'</a>').appendTo(el);
		el.find('.copy').click(this.selectFiles)
    },

	initialize: function(){
		this.registerFileAction();
    },	
    	
	selectFiles: function(event){
		// copy multiple files
		event.stopPropagation();
		event.preventDefault();
        
        var files = FileList.getSelectedFiles();
		var file='';
		for( var i=0;i<files.length;++i){
			file += (files[i].name)+';';
		}
		OCA.Files_copy.Copy.createUI(false,file);
		return false;
	},

	/**
	 * draw the copy-dialog;
	 *
	 * @local - true for single file, false for global use
	 * @file - filename in the local directory
	 */
	createUI: function (local,file){
        OC.dialogs.filepicker(
            t(OCA.Files_copy.Copy.appName, "Select a Dest"),
            function (path) {
                var dir  = $('#dir').val();
                $.post(
                    OC.generateUrl('/apps/files_copy/copy'),
                    {
                        srcDir: dir, 
                        srcFile: file, 
                        dest: path
                    },
                    function(data) {
                        if(data.status == "error") {
                            OC.Notification.showTemporary(t(OCA.Files_copy.Copy.appName,data.message));
                        }
                        
                        if(data.status == "success") {
                            
                            OC.Notification.showTemporary(t(OCA.Files_copy.Copy.appName,"copy successfully"));
                        }
                    });
            },
            false,
            ['httpd/unix-directory']
        );
    },
}
$(document).ready(function() {
	/**
	 * check whether we are in files-app and we are not in a public-shared folder
	 */
	if(!OCA.Files){ // we don't have the files app, so ignore anything
		return;
	}
	if(/(public)\.php/i.exec(window.location.href)!=null){
		return; // escape when the requested file is public.php
	}
        if (/^(.*)\/index.php\/s\/(.*)/i.exec(location.pathname)){
            return;
        }
	/**
	 * Init Files_copy
	 */
	OCA.Files_copy.Copy.initialize();
});
