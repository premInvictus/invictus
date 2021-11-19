CKEDITOR.plugins.add( 'simpleVideoUpload', {
    init: function( editor ) {
        var videofileDialog = $('<input type="file" id="video" name="video">');
        console.log('editor--', editor);
        videofileDialog.on('change', function (e) {
            console.log('e.target video', e.target);
            var uploadUrl = editor.config.filebrowserUploadUrl;
			var file = videofileDialog[0].files[0];
			var imageData = new FormData();
			imageData.append('file', file);

			$.ajax({
				url: uploadUrl,
				type: 'POST',
				contentType: false,
				processData: false,
				data: imageData,
			}).done(function(done) {
				var ele = editor.document.createElement('video');
				ele.setAttribute('src', done);
                ele.setAttribute('controls', true);
				editor.insertElement(ele);
			});

        })
        editor.ui.addButton( 'SimpleVideoUpload', {
            label: 'Insert Video',
            command: 'openDialog',
            toolbar: 'insert',
            icon: CKEDITOR.plugins.getPath('simpleVideoUpload')+'video.png'
        });
        editor.addCommand('openDialog', {
            exec: function(editor) {
                console.log('videofileDialog--', videofileDialog);
                videofileDialog.click();
            }
        })
    }
});